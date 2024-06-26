import { Hono } from '../../hono'
import type { RequestIDVariables } from '.'
import { requestID } from '.'

describe('Request ID Middleware', () => {
  type Variables = RequestIDVariables
  const app = new Hono<{Variables: Variables}>()

  app.use('*', requestID())
  app.get('/requestId', (c) => c.text(c.get('requestID') ?? 'No Request ID'))

  it('Should return random request id', async () => {
    const res = await app.request('http://localhost/requestId')
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).not.toBe('No Request ID')
  })

  it('Should return configured request id', async () => {
    const res = await app.request('http://localhost/requestId', {
      headers: {
        'X-Request-Id': 'hono-is-cool',
      },
    })
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('hono-is-cool')
  })
})
