import { DomainError, initialize } from '@tpluscode/fun-ddr'
import { DataSheet, DataSheetEntity } from '.'

interface CreateCommand {
  label: string;
}

export const createDataSheet = initialize<DataSheet, CreateCommand>(function ({ label }, emitter) {
  if (!label) {
    throw new DomainError('', 'Cannot create data sheet', 'Label is missing')
  }

  return new DataSheetEntity({ emitter, label })
})
