import express from 'express'
import { asyncMiddleware } from 'middleware-async'
import { createDataSheet } from '../../../domain/data-sheet/create'
import repo from '../../../repository'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import env from '../../../env'

export const post = asyncMiddleware(async (req: express.Request, res, next) => {
  const { label } = buildVariables(req, {
    label: expand('rdfs:label'),
  })

  const { dataSheets } = await repo

  createDataSheet({
    label: label.value,
  })
    .commit(dataSheets)
    .then(ds => {
      res.status(201)
      res.setHeader('Location', `${env.BASE_URI}${ds['@id']}`)
      res.end()
    })
    .catch(next)
})
