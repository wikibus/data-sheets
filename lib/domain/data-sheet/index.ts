import { Applicators, EventSourcedEntity, Initializer } from '../EventSourcedEntity'
import { EventsWithIris } from '../fun-ddr'
import { Entity } from '@tpluscode/fun-ddr'

export interface DataSheet extends Entity {
  label: string;
  iri: string;
  rename(label: string): DataSheet;
}

interface ConstructorParams {
  label: string;
}

export class DataSheetEntity extends EventSourcedEntity<DataSheetEvents> implements DataSheet {
  private __label: string

  public get iri () {
    return `data-sheet/${this['@id']}`
  }

  public constructor (init: Initializer & Partial<ConstructorParams>) {
    super(init)
    if ('label' in init) {
      this.applyEvent('DataSheetCreated', {
        label: init.label,
      })
    }
  }

  public get label () {
    return this.__label
  }

  public rename (label: string) {
    if (this.label !== label) {
      this.applyEvent('DataSheetRenamed', {
        label,
      })
    }

    return this
  }

  protected _getApplicators (): Applicators<DataSheetEvents> {
    return {
      DataSheetCreated: (ev) => {
        this.__label = ev.label
      },
      DataSheetRenamed: (ev) => {
        this.__label = ev.label
      },
    }
  }
}

interface CoreEvents {
  DataSheetCreated: {
    label: string;
  };
  DataSheetRenamed: {
    label: string;
  };
}

export type DataSheetEvents = EventsWithIris<CoreEvents>
