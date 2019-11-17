import { EventSourcedRepository } from './EventSourceRepository'
import eventstore from 'eventstore'
import { DataSheet, DataSheetEntity, DataSheetEvents } from '../domain/data-sheet'

function storeSettings () {
  if (process.env.STORE_AZURE_ACCOUNT) {
    return {
      type: 'azuretable',
      storageAccount: process.env.STORE_AZURE_ACCOUNT,
      storageTableHost: process.env.STORE_AZURE_TABLE_HOST,
      storageAccessKey: process.env.STORE_AZURE_ACCESS_KEY,
      eventsTableName: 'factsevents',
    }
  }
}

const es = eventstore(storeSettings())

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
