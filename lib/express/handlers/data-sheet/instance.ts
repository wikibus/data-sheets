import express from 'express'
import { getDataSheet } from '../../../read-model/data-sheet-drafts'
import { dataSheets } from '../../../repository'
import { rename } from '../../../domain/data-sheet/rename'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { NotFoundError } from '../../../error'

export function get (req: express.Request, res, next) {
  getDataSheet(req.params.id)
    .then(graph => {
      if (graph.length === 0) {
        throw new NotFoundError()
      }

      res.graph(graph)
    })
    .catch(next)
}

export async function put (req: express.DataCubeRequest, res, next) {
  const ar = await dataSheets.load(req.params.id)

  const { label } = buildVariables(req, {
    label: expand('rdfs:label'),
  })

  ar.mutation(rename)({
    label: label.value,
  })
    .commit(dataSheets)
    .then(() => getDataSheet(req.params.id))
    .then(graph => {
      if (graph.length === 0) {
        throw new NotFoundError()
      }

      res.graph(graph)
    })
    .catch(next)
}
