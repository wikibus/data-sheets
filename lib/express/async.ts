import { Request } from 'express'
import Timeout from 'await-timeout'

export async function preferredTimeout (req: Request) {
  if (req.prefer.wait) {
    const seconds = Number.parseFloat(req.prefer.wait)

    if (!Number.isNaN(seconds)) {
      await Timeout.set(seconds * 1000)
    }
  }
}
