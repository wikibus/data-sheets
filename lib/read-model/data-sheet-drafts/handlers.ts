import { handle } from '@tpluscode/fun-ddr/lib/events'
import { DataSheetEvents } from '../../domain/data-sheet'
import { deleteInsert, insertData } from '../../sparql'
import { getClient } from '../sparqlClient'
import { ds, schema } from '../../namespaces'

handle<DataSheetEvents, 'DataSheetCreated'>('DataSheetCreated', function insertDraft (ev) {
  insertData(`
    <data-sheet/${ev.id}> 
        a ds:DataSheet ; 
        schema:label "${ev.data.label}" ; 
        ds:draft true .
  `)
    .prefixes({
      schema,
      ds,
    })
    .execute(getClient())
    .catch(console.error)
})

handle<DataSheetEvents, 'DataSheetRenamed'>('DataSheetRenamed', function updateDataSheetName (ev) {
  deleteInsert(`
    <data-sheet/${ev.id}> schema:label ?label .
  `)
    .insert(`
      <data-sheet/${ev.id}> schema:label "${ev.data.label}" .
    `)
    .where(`
      <data-sheet/${ev.id}> a ds:DataSheet ; schema:label ?label.
    `)
    .prefixes({ schema, ds })
    .execute(getClient())
    .catch(console.error)
})
