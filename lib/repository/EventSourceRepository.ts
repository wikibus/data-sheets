import { Entity, Repository } from '@tpluscode/fun-ddr'
import { AggregateRoot, DomainEvent } from '@tpluscode/fun-ddr/lib'
import { AggregateRootImpl } from '@tpluscode/fun-ddr/lib/AggregateRootImpl'
import { EventSourcedEntity } from '../domain/EventSourcedEntity'
import Eventstore from 'eventstore/lib/eventstore'
import Event from 'eventstore/lib/event'
import EventStream from 'eventstore/lib/eventStream'
import { AggregateNotFoundError, ConcurrencyError } from '@tpluscode/fun-ddr/lib/errors'

interface EConstructor<TEvents> {
  new({ id: string }): EventSourcedEntity<TEvents>;
}

export class EventSourcedRepository<E extends Entity, TEvents> implements Repository<E> {
  private readonly eventstore: Eventstore
  private readonly __impl: EConstructor<TEvents>

  public constructor (eventstore: Eventstore, impl: EConstructor<TEvents>) {
    this.eventstore = eventstore
    this.__impl = impl
  }

  public delete (id: string): Promise<void> {
    return Promise.reject(new Error('Not implemented'))
  }

  public load (id: string): Promise<AggregateRoot<E>> {
    return new Promise<EventStream>((resolve, reject) => {
      this.eventstore.getEventStream(id, (err, stream) => {
        if (err) reject(err)
        else {
          resolve(stream)
        }
      })
    }).then(stream => {
      if (stream.lastRevision === -1) {
        return new AggregateRootImpl<E>(new AggregateNotFoundError(id))
      }

      const entity = new this.__impl({ id })
      stream.events.forEach((ev: Event<DomainEvent>) => {
        entity.applyEvent(ev.payload.name, ev.payload.data as any)
      })
      const ar = new AggregateRootImpl<E>(entity as any, stream.lastRevision + 1)
      entity._setEmitter(ar)
      return ar
    })
  }

  public async save (ar: AggregateRoot<E>, version: number): Promise<void> {
    const state = await ar.state
    if (!state) {
      throw new Error(`Failed to save aggregate: ${await ar.error}`)
    }

    if (ar.version >= version) {
      throw new ConcurrencyError(state['@id'], ar.version, version)
    }

    const stream = await new Promise<EventStream>((resolve) => {
      this.eventstore.getEventStream(state['@id'], (err, stream) => {
        if (err) throw err

        resolve(stream)
      })
    })

    stream.addEvents(await ar.events)

    return new Promise(resolve => {
      stream.commit((err: Error) => {
        if (err) throw err

        resolve()
      })
    })
  }
}
