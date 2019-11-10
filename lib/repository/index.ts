import { EventSourcedRepository } from './EventSourceRepository'
import eventstore from 'eventstore'
import { DataSheet, DataSheetEntity, DataSheetEvents } from '../domain/data-sheet'

const es = eventstore()
es.init()

export const dataSheets = new EventSourcedRepository<DataSheet, DataSheetEvents>(es, DataSheetEntity)
