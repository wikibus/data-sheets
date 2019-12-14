import rdfFetch from 'hydra-box/lib/rdfFetch'
import SparqlHttp from 'sparql-http-client'
import env from '../env'

let sparqlClient
export function getClient () {
  sparqlClient = sparqlClient || new SparqlHttp({
    endpointUrl: env.SPARQL_ENDPOINT,
    updateUrl: env.SPARQL_UPDATE_ENDPOINT || env.SPARQL_ENDPOINT,
    fetch: rdfFetch,
  })

  return sparqlClient
}
