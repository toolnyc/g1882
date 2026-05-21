import { afterEach, describe, expect, it, vi } from 'vitest'

import { canRunPayloadJobs } from '@/jobs/access'

const headersWithAuth = (authorization: string | null) =>
  ({
    get: vi.fn((name: string) => (name.toLowerCase() === 'authorization' ? authorization : null)),
  }) as unknown as Headers

describe('canRunPayloadJobs', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('allows logged-in users', () => {
    expect(canRunPayloadJobs({ user: { id: 'user' }, headers: headersWithAuth(null) })).toBe(true)
  })

  it('rejects cron requests when CRON_SECRET is missing', () => {
    vi.stubEnv('CRON_SECRET', '')

    expect(canRunPayloadJobs({ user: null, headers: headersWithAuth('Bearer anything') })).toBe(false)
  })

  it('allows Vercel cron requests with the matching bearer token', () => {
    vi.stubEnv('CRON_SECRET', 'secret-123')

    expect(canRunPayloadJobs({ user: null, headers: headersWithAuth('Bearer secret-123') })).toBe(true)
  })

  it('rejects Vercel cron requests with a mismatched bearer token', () => {
    vi.stubEnv('CRON_SECRET', 'secret-123')

    expect(canRunPayloadJobs({ user: null, headers: headersWithAuth('Bearer wrong') })).toBe(false)
  })
})
