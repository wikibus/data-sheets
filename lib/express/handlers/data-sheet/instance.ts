import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { getDataSheet } from '../../../read-model/data-sheet-drafts'
import repo from '../../../repository'
import { rename } from '../../../domain/data-sheet/rename'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { NotFoundError } from '../../../error'

export function get (req: Request, res, next) {
  getDataSheet(req.params.id)
    .then(graph => {
      if (graph.length === 0) {
        throw new NotFoundError()
      }

      res.graph(graph)
    })
    .catch(next)
}

export const put = asyncMiddleware(async (req: Request, res: Response, next) => {
  const { dataSheets } = await repo
  const ar = await dataSheets.load(req.params.id)

  const { label } = buildVariables(req, {
    label: expand('rdfs:label'),
  })

  await ar.mutation(rename)({
    label: label.value,
  })
    .commit(dataSheets)
    .catch(next)

  next()
})
