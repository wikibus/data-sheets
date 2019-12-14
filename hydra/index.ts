import hydraBox from 'hydra-box'
import Parser from '@rdfjs/parser-n3'
import rdf from 'rdf-ext'
import { createReadStream } from 'fs'
import { relative } from 'path'
import walk from '@fcostarodrigo/walk'
import { log, warning } from '../lib/log'
import env from '../lib/env'

export default async function () {
  const parser = new Parser({
    baseIRI: env.BASE_URI,
  })

  const options: Record<string, unknown> = {
    debug: true,
    sparqlEndpointUrl: env.SPARQL_ENDPOINT,
    sparqlEndpointUpdateUrl: env.SPARQL_UPDATE_ENDPOINT,
    contextHeader: '/context/',
  }

  const dataset = rdf.dataset()
  const apiDocSources: Promise<unknown>[] = []
  for await (const file of walk(__dirname) as AsyncIterable<string>) {
    if (!file.match(/\.ttl$/)) {
      continue
    }

    const promise = dataset.import(parser.import(createReadStream(file)))
      .then(() => {
        log.extend('hydra-box')('Loaded %s', relative(__dirname, file))
      })
      .catch(e => {
        warning('Failed to load %s: %s', relative(__dirname, file), e.message)
      })
    apiDocSources.push(promise)
  }
  await Promise.all(apiDocSources)

  log('Loaded ApiDocumentation graph with %d triples', dataset.length)
  return hydraBox('/api', dataset, options)
}
