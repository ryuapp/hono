import { Hono } from '../../hono'
import type { RequestIDVariables } from '.'
import { requestID } from '.'

describe('Request ID Middleware', () => {
  type Variables = RequestIDVariables
  const app = new Hono<{ Variables: Variables }>()

  app.use('*', requestID())
  app.get('/requestId', (c) => c.text(c.get('requestID') ?? 'No Request ID'))

  it('Should return random request id', async () => {
    const res = await app.request('http://localhost/requestId')
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).not.toBe('No Request ID')
  })

  it('Should return custom request id', async () => {
    const res = await app.request('http://localhost/requestId', {
      headers: {
        'X-Request-Id': 'hono-is-cool',
      },
    })
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('hono-is-cool')
  })

  it('Should return sanitized custom request id', async () => {
    const res = await app.request('http://localhost/requestId', {
      headers: {
        'X-Request-Id': 'Hello!12345-@*^',
      },
    })
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello12345-')
  })
})

describe('Request ID Middleware with custom header', () => {
  type Variables = RequestIDVariables
  const app = new Hono<{ Variables: Variables }>()

  app.use('*', requestID({ headerName: 'Hono-Request-Id' }))
  app.get('/requestId', (c) => c.text(c.get('requestID') ?? 'No Request ID'))

  it('Should return custom request id', async () => {
    const res = await app.request('http://localhost/requestId', {
      headers: {
        'Hono-Request-Id': 'hono-is-cool',
      },
    })
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('hono-is-cool')
  })
})

describe('Request ID Middleware with custom generator', () => {
  function generateWord() {
    return 'HonoHonoHono'
  }

  type Variables = RequestIDVariables
  const app = new Hono<{ Variables: Variables }>()
  app.use('*', requestID({ generator: generateWord }))
  app.get('/requestId', (c) => c.text(c.get('requestID') ?? 'No Request ID'))

  it('Should return custom request id', async () => {
    const res = await app.request('http://localhost/requestId')
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('HonoHonoHono')
  })
})

describe('Request ID Middleware with custom max length', () => {
  type Variables = RequestIDVariables
  const app = new Hono<{ Variables: Variables }>()

  app.use('*', requestID({ maxLength: 9 }))
  app.get('/requestId', (c) => c.text(c.get('requestID') ?? 'No Request ID'))

  it('Should return cut custom request id', async () => {
    const res = await app.request('http://localhost/requestId', {
      headers: {
        'X-Request-Id': '12345678910',
      },
    })
    expect(res).not.toBeNull()
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('123456789')
  })
})
