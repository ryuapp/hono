export { requestID } from './request-id'
import type { RequestIDVariables } from './request-id'
export type { RequestIDVariables }

declare module '../..' {
  interface ContextVariableMap extends RequestIDVariables {}
}
