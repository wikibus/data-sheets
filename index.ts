import cors from 'cors'
import express from 'express'
import preferenceHeaders from 'express-prefer'
import url from 'url'
import program from 'commander'
import { NotFoundError } from './lib/error'
import { httpProblemMiddleware } from './lib/express/problemDetails'
import authentication from './lib/express/authentication'
import { logRequest, logRequestError } from './lib/express/logger'
import { log, error } from './lib/log'
import env from './lib/env'

import('./lib/handlers')

program
  .action(() => {
    Promise.resolve().then(async () => {
      const baseUrl = `${env.BASE_URI}`
      const hydraMiddleware = await import('./hydra')

      const app = express()

      app.enable('trust proxy')
      app.use(logRequest)
      app.use(preferenceHeaders)
      app.use(cors({
        exposedHeaders: ['link', 'location'],
      }))
      app.use(authentication)
      app.use(await hydraMiddleware.default())
      app.use(function (req, res, next) {
        next(new NotFoundError())
      })
      app.use(logRequestError)
      app.use(httpProblemMiddleware)

      app.listen((env.PORT || new url.URL(baseUrl).port), () => {
        log(`listening at port ${env.PORT}`)
      })
    }).catch(err => {
      error('Failed to start: %O', err)
      process.exit(1)
    })
  })

program.parse(process.argv)
