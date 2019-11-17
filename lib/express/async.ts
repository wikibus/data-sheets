import { Request } from 'express'
import Timeout from 'await-timeout'
import asyncMiddleware from 'middleware-async'

export const preferredTimeout = asyncMiddleware(async (req: Request, res, next) => {
  if (req.prefer.wait) {
    const seconds = Number.parseFloat(req.prefer.wait)

    if (!Number.isNaN(seconds)) {
      await Timeout.set(seconds * 1000)
    }
  }

  next()
})
