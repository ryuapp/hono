/**
 * @module
 * Request ID Middleware for Hono.
 */

import type { MiddlewareHandler } from '../../types'

export type RequestIDVariables = {
  requestID: string
}

export type RequesIDOptions = {
  headerName?: string
  generator?: () => string
}

/**
 * Request ID Middleware for Hono.
 *
 * @param {object} options - Options for Request ID middleware.
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
  const headerName = options?.headerName ?? 'X-Request-Id'
  return async function requestID(c, next) {
    let requestId = c.req.header(headerName)
    if (requestId) {
      requestId = requestId.replace(/[^\w\-]/g, '').substring(0, 255)
    } else {
      requestId = options?.generator?.() ?? crypto.randomUUID()
    }

    c.set('requestID', requestId)
    c.header(headerName, requestId)
    await next()
  }
}
