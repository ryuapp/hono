/**
 * @module
 * Request ID Middleware for Hono.
 */

import type { MiddlewareHandler } from '../../types'

/**
 * Request ID Middleware for Hono.
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * const app = new Hono()
 *
 * app.use(requestID())
 * app.get('/', (c) => {
 *   console.log(c.req.header('X-Request-ID')) // Debug
 *   return c.text('Hello World!')
 * })
 * ```
 */
export const requestID = (): MiddlewareHandler => {
  return async function requestID(c, next) {
    const requestID = c.req.header('X-Request-ID') ?? crypto.randomUUID()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    c.req.raw.headers['X-Request-ID'] = requestID
    await next()
  }
}
