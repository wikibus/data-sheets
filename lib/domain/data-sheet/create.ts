import { initialize } from '@tpluscode/fun-ddr'
import { DataSheet, DataSheetEntity } from '.'

interface CreateCommand {
  label: string;
}

export const createDataSheet = initialize<DataSheet, CreateCommand>(function ({ label }, emitter) {
  return new DataSheetEntity({ emitter, label })
})
