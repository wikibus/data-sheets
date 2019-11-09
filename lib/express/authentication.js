const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

module.exports = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://wikibus.eu.auth0.com/.well-known/jwks.json'
  }),

  // Validate the audience and the issuer.
  audience: 'https://wikibus.org',
  issuer: 'https://wikibus.eu.auth0.com/',
  algorithms: ['RS256']
})
