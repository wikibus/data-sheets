import { Quad } from '@rdfjs/types';
import SHACLValidator from 'rdf-validate-shacl'
import rdf from '@zazuko/env-node'
import { Context } from "barnard59-core";
import { createPlaygroundUrl } from '@zazuko/shacl-playground'
import { shorten } from '@zazuko/s'
import pretty from '@rdfjs-elements/formats-pretty'

rdf.formats.import(pretty)
const shapes = rdf.dataset().import(rdf.fromFile(new URL('../shape/DataSheet.ttl', import.meta.url)));

const prefixes = [
  'sh', 'mads', 'xsd', 'schema', 'rdf', 'rdfs', 'unit', 'qudt', 'dcterms',
  ['wb', 'http://www.wikidata.org/entity/'],
  ['wikibus', 'https://schema.wikibus.org/'],
]

export async function chunkIsValid(this: Context, chunk: Quad[]): Promise<Iterable<Quad>> {
  const documentId = this.variables.get('documentId');
  const shapesGraph = await shapes;
  const validator = new SHACLValidator(shapesGraph);

  const dataGraph = this.env.dataset(chunk);
  const report = validator.validate(this.env.dataset(chunk));

  if (report.conforms) {
    return chunk
  } else {
    this.error(new Error('Some data sheets failed validation'));
    const results = report.results.length;

    const playgroundLink = await shorten(await createPlaygroundUrl(shapesGraph, dataGraph, { env: rdf, prefixes }));
    this.logger.warn(`Document ${documentId}: ${results} validation issues found. Check ${playgroundLink}`)

    return [...report.dataset, ...chunk].map(renameReportQuad(documentId));
  }
}

function renameReportQuad(documentId: any) {
  const report = rdf.blankNode('report');

  return (quad: Quad) => {
    const subject = quad.subject.equals(report) ? rdf.blankNode(`${documentId}-report`) : quad.subject;

    return rdf.quad(subject, quad.predicate, quad.object);
  }
}
