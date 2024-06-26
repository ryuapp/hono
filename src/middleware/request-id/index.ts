/**
 * @module
 * Request ID Middleware for Hono.
 */

import type { MiddlewareHandler } from '../../types'

export type RequesIdOptions = {
  header: string
  maxLength: number
  variableName: string
  generator: () => string
}

/**
 * Request ID Middleware for Hono.
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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const maxLength = options?.maxLength ?? 255
    const headerName = options?.header ?? 'X-Request-Id'
    const requestId = c.req.header(headerName) ?? options?.generator() ?? crypto.randomUUID()
    const variableName = options?.variableName ?? 'requestId'
    requestId.replace(/[^\w\-]gi/, '').substring(0, maxLength)

    c.set(variableName, requestId)
    c.header(headerName, requestId)
    await next()
  }
}
