import { Hono } from '../../hono'
import { requestId } from '.'

describe('Request ID Middleware', () => {
  type Env = {
    Variables: {
      requestId: string
    }
  }

  const app = new Hono<Env>()

  app.use('*', requestId())
  app.get('/requestId', (c) => c.text(c.var.requestId ?? 'No Response'))

  it('Should return random request id', async () => {
    const res = await app.request('http://localhost/requestId')
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).not.toBe('No Response')
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
