import { mutate } from '@tpluscode/fun-ddr'
import { DataSheet } from './index'

interface RenameCommand {
  label: string;
}

export const rename = mutate<DataSheet, RenameCommand>((state, cmd) => {
  state.rename(cmd.label)

  return state
})
