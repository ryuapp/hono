/**
 * @module
 * Request ID Middleware for Hono.
 */

import type { MiddlewareHandler } from '../../types'

export type RequestIDVariables = {
  requestID: string
}

export type RequesIDOptions = {
  maxLength: number
  headerName: string
  generator: () => string
}

/**
 * Request ID Middleware for Hono.
 *
 * @param {object} options - Options for Request ID middleware.
 * @param {number} [options.maxLength=255] - A maximum length of request id.
 * If a value retrieved from headers exceeds the length, it will be cut to the length.
 * @param {string} [options.headerName=X-Request-Id] - A header name.
 * @param {generator} [options.generator=crypto.randomUUID()] - A request id generation function
 *
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * type Variables = RequestIDVariables
 * const app = new Hono<{Variables: Variables}>()
 *
 * app.use(requestID())
 * app.get('/', (c) => {
 *   console.log(c.get('requestID')) // Debug
 *   return c.text('Hello World!')
 * })
 * ```
 */
export const requestID = (options?: RequesIDOptions): MiddlewareHandler => {
  return async function requestID(c, next) {
    const maxLength = options?.maxLength ?? 255
    const headerName = options?.headerName ?? 'X-Request-Id'
    const requestID = c.req.header(headerName) ?? options?.generator() ?? crypto.randomUUID()
    requestID.replace(/[^\w\-]gi/, '').substring(0, maxLength)

    c.set('requestID', requestID)
    c.header(headerName, requestID)
    await next()
  }
}
