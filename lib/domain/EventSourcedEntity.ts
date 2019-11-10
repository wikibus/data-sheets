import { Entity } from '@tpluscode/fun-ddr'
import uuid from 'uuid'
import { DomainEventEmitter } from '@tpluscode/fun-ddr/lib'

export type Applicators<TEvents extends Record<string, any>> = {
  [key in keyof TEvents]: (value: TEvents[key]) => void
}

export interface Initializer {
  id?: string;
  emitter?: DomainEventEmitter;
}

export abstract class EventSourcedEntity<TEvents extends Record<string, any>> implements Entity {
  public readonly '@id': string;
  public readonly '@type': string | string[];
  private readonly __applicators: Applicators<TEvents>
  private __emitter?: DomainEventEmitter

  protected constructor ({ id, emitter }: Initializer) {
    this['@type'] = 'DataSheet'
    this['@id'] = id || uuid()
    this.__applicators = this._getApplicators()
    this._setEmitter(emitter)
  }

  public _setEmitter (emitter: DomainEventEmitter) {
    this.__emitter = emitter
  }

  public applyEvent <K extends keyof Pick<TEvents, string>> (name: K, ev: unknown extends TEvents[K] ? never : TEvents[K]): void {
    const applicator = this.__applicators[name]
    applicator(ev)
    if (this.__emitter) {
      this.__emitter.emit(name, ev)
    }
  }

  protected abstract _getApplicators(): Applicators<TEvents>
}
