import { Request, Response } from 'express'
import SparqlHttp from 'sparql-http-client'
import { Params, ParamsDictionary } from 'express-serve-static-core'

declare module 'express' {

  interface Request<P extends Params = ParamsDictionary> {
    sparql: SparqlHttp;
    graph: any;
  }

  interface Response {
    graph(dataset: any): void;
  }
}
