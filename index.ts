import cors from 'cors'
import express from 'express'
import hydraBox from 'hydra-box'
import path from 'path'
import url from 'url'
import program from 'commander'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { NotFoundError } from './lib/error'
import { httpProblemMiddleware } from './lib/express/problemDetails'
import authentication from './lib/express/authentication'

dotenvExpand(dotenv.config())
import('./lib/handlers')

function logger (req: express.Request, res: express.Response, next: express.NextFunction) {
  process.stdout.write(`${req.method} ${req.url} \n`)

  res.on('finish', () => {
    process.stdout.write(`${res.statusCode}\n`)
  })

  next()
}

function hydraMiddleware () {
  const sparqlEndpointUrl = process.env.SPARQL_ENDPOINT

  return hydraBox.fromUrl('/api', 'file://' + path.join(__dirname, 'hydra/apidoc.ttl'), {
    debug: true,
    sparqlEndpointUrl,
    contextHeader: '/context/',
  })
}

program
  .action(() => {
    Promise.resolve().then(async () => {
      const baseUrl = `${process.env.BASE_URI}`

      const app = express()

      app.enable('trust proxy')
      app.use(logger)
      app.use(cors({
        exposedHeaders: ['link', 'location'],
      }))
      app.use(authentication)
      app.use(await hydraMiddleware())
      app.use(function (req, res, next) {
        next(new NotFoundError())
      })
      app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log(err)
        next(err)
      })
      app.use(httpProblemMiddleware)

      app.listen((process.env.PORT || new url.URL(baseUrl).port), () => {
        console.log(`listening at ${baseUrl}`)
      })
    }).catch(err => console.error(err))
  })

program.parse(process.argv)
