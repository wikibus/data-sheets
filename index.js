const cors = require('cors')
const express = require('express')
const hydraBox = require('hydra-box')
const path = require('path')
const url = require('url')
const program = require('commander')

require('dotenv').config()

function logger (req, res, next) {
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
    contextHeader: '/context/'
  })
}

program
  .option('--port <port>', '', 12345)
  .action(({ port }) => {
    Promise.resolve().then(async () => {
      const baseUrl = `http://localhost:${port}/`

      const app = express()

      app.enable('trust proxy')
      app.use(logger)
      app.use(cors({
        exposedHeaders: ['link', 'location']
      }))
      app.use(await hydraMiddleware())

      const server = app.listen(new url.URL(baseUrl).port, () => {
        const host = server.address().address
        const port = server.address().port

        console.log(`listening at http://${host}:${port}`)
      })
    }).catch(err => console.error(err))
  })

program.parse(process.argv)
