import express from 'express'
import { createDataSheet } from '../../../domain/data-sheet/create'
import { dataSheets } from '../../../repository'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'

export function post (req: express.DataCubeRequest, res: express.Response, next: express.NextFunction) {
  const { label } = buildVariables(req, {
    label: expand('rdfs:label'),
  })

  createDataSheet({
    label: label.value,
  })
    .commit(dataSheets)
    .then(ds => {
      res.status(201)
      res.setHeader('Location', `${process.env.BASE_URI}data-sheet/${ds['@id']}`)
      res.end()
    })
    .catch(next)
}
