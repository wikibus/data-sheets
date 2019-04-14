const cors = require('cors')
const express = require('express')
const hydraBox = require('hydra-box')
const path = require('path')
const url = require('url')

function logger (req, res, next) {
    process.stdout.write(`${req.method} ${req.url} `)

    res.on('finish', () => {
        process.stdout.write(`${res.statusCode}\n`)
    })

    next()
}

function hydraMiddleware () {
    return hydraBox.fromUrl('/api', 'file://' + path.join(__dirname, 'hydra/apidoc.ttl'), {
        debug: true,
        sparqlEndpointQueryUrl: 'https://dydra.com/tpluscode/wikibus-test-tech-sheets/sparql',
        sparqlEndpointUpdateUrl: 'https://dydra.com/tpluscode/wikibus-test-tech-sheets/sparql',
        contextHeader: '/context/'
    })
}

Promise.resolve().then(async () => {
    const baseUrl = 'http://localhost:12345/'

    const app = express()

    app.use(logger)
    app.use(cors({
        exposedHeaders: ['link', 'location']
    }))
    app.use(await hydraMiddleware())

    const server = app.listen(url.parse(baseUrl).port, () => {
        const host = server.address().address
        const port = server.address().port

        console.log(`listening at http://${host}:${port}`)
    })
}).catch(err => console.error(err))
