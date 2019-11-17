import { Params, ParamsDictionary } from 'express-serve-static-core'

declare module 'express' {
  interface Request<P extends Params = ParamsDictionary> {
    prefer: Readonly<Record<string, string>>;
  }
}
