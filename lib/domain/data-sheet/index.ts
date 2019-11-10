import { Applicators, EventSourcedEntity } from '../EventSourcedEntity'
import { Entity } from '@tpluscode/fun-ddr'

export interface DataSheet extends Entity {
  label: string;
  rename(label: string): void;
}

export class DataSheetEntity extends EventSourcedEntity<DataSheetEvents> implements DataSheet {
  private __label: string

  public get label () {
    return this.__label
  }

  public rename (label: string) {
    if (this.label !== label) {
      this.applyEvent('DataSheetRenamed', {
        label,
      })
    }
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

export interface DataSheetEvents {
  DataSheetCreated: {
    label: string;
  };
  DataSheetRenamed: {
    label: string;
  };
}
