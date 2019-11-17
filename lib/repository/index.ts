import { EventSourcedRepository } from './EventSourceRepository'
import eventstore from 'eventstore'
import { DataSheet, DataSheetEntity, DataSheetEvents } from '../domain/data-sheet'

function createStore () {
  if (process.env.MONGODB_URI) {
    return eventstore({
      type: 'mongodb',
      url: process.env.MONGODB_URI,
      eventsCollectionName: 'data-sheets-events',
    })
  } else {
    return eventstore()
  }
}

const es = createStore()

export default new Promise((resolve, reject) => es.init((err) => {
  if (err) {
    reject(err)
  } else {
    resolve()
  }
}))
  .then(() => ({
    dataSheets: new EventSourcedRepository<DataSheet, DataSheetEvents>(es, DataSheetEntity),
  }))
