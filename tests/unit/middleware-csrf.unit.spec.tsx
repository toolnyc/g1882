import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// We need to mock process.env before importing the middleware
// The middleware module reads env at call time, so we can import it directly

describe('middleware CSRF Origin validation', () => {
  let middleware: (request: NextRequest) => NextResponse

  beforeEach(async () => {
    vi.resetModules()
    // Set up env for tests
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'http://localhost:3003')

    const mod = await import('@/middleware')
    middleware = mod.middleware
  })

  function createRequest(method: string, pathname: string, origin?: string, host?: string): NextRequest {
    const url = `http://${host || 'localhost:3003'}${pathname}`
    const headers = new Headers()
    if (origin) {
      headers.set('Origin', origin)
    }
    if (!origin && method === 'GET') {
      // GET requests from browsers always have at least Host; Origin may be absent
    }

    return new NextRequest(url, {
      method,
      headers,
    })
  }

  describe('cross-origin blocked', () => {
    it('blocks cross-origin POST to /api/*', async () => {
      const req = createRequest('POST', '/api/users/login', 'https://evil.com')
      const res = middleware(req)

      expect(res.status).toBe(403)
      const body = await res.json()
      expect(body.error).toBe('Origin not allowed')
    })

    it('blocks cross-origin PUT to /api/*', async () => {
      const req = createRequest('PUT', '/api/pages/1', 'https://evil.com')
      const res = middleware(req)

      expect(res.status).toBe(403)
    })

    it('blocks cross-origin PATCH to /api/*', async () => {
      const req = createRequest('PATCH', '/api/pages/1', 'https://evil.com')
      const res = middleware(req)

      expect(res.status).toBe(403)
    })

    it('blocks cross-origin DELETE to /api/*', async () => {
      const req = createRequest('DELETE', '/api/pages/1', 'https://evil.com')
      const res = middleware(req)

      expect(res.status).toBe(403)
    })
  })

  describe('same-origin allowed', () => {
    it('allows same-origin POST to /api/*', () => {
      const req = createRequest('POST', '/api/users/login', 'http://localhost:3003')
      const res = middleware(req)

      // Should not be a 403 — it passes through
      expect(res.status).not.toBe(403)
    })

    it('allows POST with Origin matching request host', () => {
      const req = createRequest('POST', '/api/form-submissions', 'http://localhost:3003', 'localhost:3003')
      const res = middleware(req)

      expect(res.status).not.toBe(403)
    })
  })

  describe('GET passthrough', () => {
    it('allows GET regardless of cross-origin Origin header', () => {
      const req = createRequest('GET', '/api/pages', 'https://evil.com')
      const res = middleware(req)

      expect(res.status).not.toBe(403)
    })

    it('allows HEAD regardless of cross-origin Origin', () => {
      const req = createRequest('HEAD', '/api/pages', 'https://evil.com')
      const res = middleware(req)

      expect(res.status).not.toBe(403)
    })

    it('allows OPTIONS regardless of cross-origin Origin', () => {
      const req = createRequest('OPTIONS', '/api/users/login', 'https://evil.com')
      const res = middleware(req)

      expect(res.status).not.toBe(403)
    })
  })

  describe('no Origin header allowed', () => {
    it('allows POST without Origin header', () => {
      const req = createRequest('POST', '/api/users/login')
      const res = middleware(req)

      expect(res.status).not.toBe(403)
    })

    it('allows PUT without Origin header', () => {
      const req = createRequest('PUT', '/api/pages/1')
      const res = middleware(req)

      expect(res.status).not.toBe(403)
    })
  })

  describe('non-API routes unaffected', () => {
    it('allows cross-origin POST to non-API route', () => {
      const req = createRequest('POST', '/newsletter', 'https://evil.com')
      const res = middleware(req)

      expect(res.status).not.toBe(403)
    })

    it('allows cross-origin POST to frontend page', () => {
      const req = createRequest('POST', '/', 'https://evil.com')
      const res = middleware(req)

      expect(res.status).not.toBe(403)
    })
  })

  describe('localhost dev flexibility', () => {
    it('allows any localhost origin in dev mode', () => {
      const req = createRequest('POST', '/api/users/login', 'http://localhost:3000')
      const res = middleware(req)

      expect(res.status).not.toBe(403)
    })
  })
})
