import { Entity, Repository } from '@tpluscode/fun-ddr'
import { AggregateRoot, DomainEvent } from '@tpluscode/fun-ddr/lib'
import { AggregateRootImpl } from '@tpluscode/fun-ddr/lib/AggregateRootImpl'
import { EventSourcedEntity } from '../domain/EventSourcedEntity'
import Eventstore from 'eventstore/lib/eventstore'
import Event from 'eventstore/lib/event'
import EventStream from 'eventstore/lib/eventStream'
import { ConcurrencyError } from '@tpluscode/fun-ddr/lib/errors'

export class EventSourcedRepository<IE extends Entity, E extends EventSourcedEntity<TEvents> & IE, TEvents> implements Repository<IE> {
  private readonly eventstore: Eventstore
  private createEntity: (id: string) => E

  public constructor (eventstore: Eventstore, createEntity: (id: string) => E) {
    this.eventstore = eventstore
    this.createEntity = createEntity
  }

  public delete (id: string): Promise<void> {
    return Promise.reject(new Error('Not implemented'))
  }

  public load (id: string): Promise<AggregateRoot<IE>> {
    return new Promise<EventStream>((resolve, reject) => {
      this.eventstore.getEventStream(id, (err, stream) => {
        if (err) reject(err)
        else {
          resolve(stream)
        }
      })
    }).then(stream => {
      const entity = this.createEntity(id)
      stream.events.forEach((ev: Event<DomainEvent>) => {
        entity.applyEvent(ev.payload.name, ev.payload.data as any)
      })
      const ar = new AggregateRootImpl<IE>(entity, stream.lastRevision + 1)
      entity.setEmitter(ar)
      return ar
    })
  }

  public async save (ar: AggregateRoot<IE>, version: number): Promise<void> {
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
