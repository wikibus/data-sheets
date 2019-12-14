import { handle } from '@tpluscode/fun-ddr/lib/events'
import { DataSheetEvents } from '../../domain/data-sheet'
import { deleteInsert, insertData } from '../../sparql'
import { getClient } from '../sparqlClient'
import { ds, rdfs } from '../../namespaces'

handle<DataSheetEvents, 'DataSheetCreated'>('DataSheetCreated', function insertDraft (ev) {
  return insertData(`
    <${ev.data.iri}> 
        a ds:DataSheet ; 
        rdfs:label "${ev.data.label}" ; 
        ds:draft true .
  `)
    .prefixes({
      rdfs,
      ds,
    })
    .execute(getClient())
    .catch(console.error)
})

handle<DataSheetEvents, 'DataSheetRenamed'>('DataSheetRenamed', function updateDataSheetName (ev) {
  return deleteInsert(`
    <${ev.data.iri}> rdfs:label ?label .
  `)
    .insert(`
      <${ev.data.iri}> rdfs:label "${ev.data.label}" .
    `)
    .where(`
      <${ev.data.iri}> a ds:DataSheet ; rdfs:label ?label.
    `)
    .prefixes({ rdfs, ds })
    .execute(getClient())
    .catch(console.error)
})
