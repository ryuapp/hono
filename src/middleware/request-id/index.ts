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
 * app.use(requestId())
 * app.get('/', (c) => {
 *   console.log(c.req.header('X-Request-Id')) // Debug
 *   return c.text('Hello World!')
 * })
 * ```
 */
export const requestId = (): MiddlewareHandler => {
  return async function requestId(c, next) {
    c.header('X-Request-Id', c.req.header('X-Request-Id') ?? crypto.randomUUID())
    await next()
  }
}
