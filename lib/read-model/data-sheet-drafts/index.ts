import { construct } from '../../sparql'
import { getClient } from '../sparqlClient'
import { ds } from '../../namespaces'

export function getDataSheet (id: string) {
  return construct()
    .graph(`
      ?ds ?p ?o .
    `)
    .where(`
      BIND (<data-sheet/${id}> as ?ds)
    
      ?ds a ds:DataSheet ; ?p ?o .
    `)
    .prefixes({ ds })
    .execute(getClient())
}
