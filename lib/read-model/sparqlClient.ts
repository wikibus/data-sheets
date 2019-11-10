import rdfFetch from 'hydra-box/lib/rdfFetch'
import SparqlHttp from 'sparql-http-client'

let sparqlClient
export function getClient () {
  sparqlClient = sparqlClient || new SparqlHttp({
    endpointUrl: process.env.SPARQL_ENDPOINT,
    updateUrl: process.env.SPARQL_UPDATE_ENDPOINT || process.env.SPARQL_ENDPOINT,
    fetch: rdfFetch,
  })

  return sparqlClient
}
