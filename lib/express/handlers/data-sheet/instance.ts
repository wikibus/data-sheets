import express from 'express'
import { getDataSheet } from '../../../read-model/data-sheet-drafts'
import { dataSheets } from '../../../repository'
import { rename } from '../../../domain/data-sheet/rename'

export function get (req: express.Request, res, next) {
  getDataSheet(req.params.id)
    .then(graph => res.graph(graph))
    .catch(next)
}

export async function put (req: express.Request, res, next) {
  const ar = await dataSheets.load(req.params.id)

  ar.mutation(rename)({
    label: 'bar',
  })
    .commit(dataSheets)
    .then(() => {
      res.status(200)
      next()
    })
    .catch(next)
}
