import { EventSourcedRepository } from './EventSourceRepository'
import eventstore from 'eventstore'
import { DataSheet, DataSheetEntity, DataSheetEvents } from '../domain/data-sheet'
import env from '../env'

function storeSettings () {
  if (env.has('STORE_AZURE_ACCOUNT')) {
    return {
      type: 'azuretable',
      storageAccount: env.STORE_AZURE_ACCOUNT,
      storageTableHost: env.STORE_AZURE_TABLE_HOST,
      storageAccessKey: env.STORE_AZURE_ACCESS_KEY,
      eventsTableName: 'factsevents',
    }
  }

  return undefined
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
