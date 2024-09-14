import {DatasetCore, Term} from "@rdfjs/types";
import {Context} from "barnard59-core";

export default function (this: Context, dataset: DatasetCore): DatasetCore {
  const documentId = this.variables.get('documentId');

  const map = <T extends Term>(term: T): T => {
    return <T>(term.value.startsWith("urn:bnode:") ? this.env.blankNode(`${documentId}-${term.value.substr(10)}`) : term);
  };

  return this.env.dataset([...dataset].map(quad => {
    return this.env.quad(map(quad.subject), quad.predicate, map(quad.object));
  }))
}
