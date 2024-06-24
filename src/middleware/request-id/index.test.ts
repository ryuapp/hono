import { Hono } from '../../hono'
import { requestID } from '.'

describe('Request ID Middleware', () => {
  const app = new Hono()

  app.use(requestID())
  app.get('/requestID', (c) => c.text(c.req.header('X-Request-ID') ?? 'No response'))

  it('Should return random request id', async () => {
    const res = await app.request('http://localhost/requestID')
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).not.toBe('No response')
  })

  it('Should return configured request id', async () => {
    const res = await app.request('http://localhost/requestID', {
      headers: {
        'X-Request-ID': 'hono-is-cool',
      },
    })
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('hono-is-cool')
  })
})
