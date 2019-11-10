import express from 'express'
import { createDataSheet } from '../../../domain/data-sheet/create'
import { dataSheets } from '../../../repository'

export function post (req: express.Request, res: express.Response, next: express.NextFunction) {
  createDataSheet({
    label: 'foo',
  })
    .commit(dataSheets)
    .then(() => {
      res.status(201)
      res.end()
    })
    .catch(next)
}
