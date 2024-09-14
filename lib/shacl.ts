import { Quad } from '@rdfjs/types';
import SHACLValidator from 'rdf-validate-shacl'
import rdf from '@zazuko/env-node'
import {Context} from "barnard59-core";

const shapes = rdf.dataset().import(rdf.fromFile(new URL('../shape/DataSheet.ttl', import.meta.url)));

export async function chunkIsValid(this: Context, chunk: Quad[]): Promise<Iterable<Quad>> {
  const documentId = this.variables.get('documentId');
  const validator = new SHACLValidator(await shapes);

  const report = validator.validate(this.env.dataset(chunk));

  if (report.conforms) {
    return chunk
  } else {
    this.error(new Error('Some data sheets failed validation'));
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
