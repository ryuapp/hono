/**
 * @module
 * Request ID Middleware for Hono.
 */

import type { MiddlewareHandler } from '../../types'

export type RequesIdOptions = {
  maxLength: number
  headerName: string
  variableName: string
  generator: () => string
}

/**
 * Request ID Middleware for Hono.
 *
 * @param {object} options - Options for Request ID middleware.
 * @param {number} [options.maxLength=255] - A maximum length of request id.
 * If a value retrieved from headers exceeds the length, it will be cut to the length.
 * @param {string} [options.headerName=X-Request-Id] - A header name.
 * @param {string} [options.variableName=requestId] - A variable name used in Variables.
 * @param {generator} [options.generator=crypto.randomUUID()] - A request id generation function
 *
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * type Env = {
 *   Variables: {
 *    requestId: string
 *  }
 * }
 * const app = new Hono<Env>()
 *
 * app.use(requestId())
 * app.get('/', (c) => {
 *   console.log(c.var.requestId) // Debug
 *   return c.text('Hello World!')
 * })
 * ```
 */
export const requestId = (options?: RequesIdOptions): MiddlewareHandler => {
  return async function requestId(c, next) {
    const maxLength = options?.maxLength ?? 255
    const headerName = options?.headerName ?? 'X-Request-Id'
    const requestId = c.req.header(headerName) ?? options?.generator() ?? crypto.randomUUID()
    const variableName = options?.variableName ?? 'requestId'
    requestId.replace(/[^\w\-]gi/, '').substring(0, maxLength)

    c.set(variableName, requestId)
    c.header(headerName, requestId)
    await next()
  }
}
