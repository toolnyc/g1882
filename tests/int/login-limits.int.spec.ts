// @vitest-environment node

import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload
const TEST_EMAIL = 'login-test@test.com'
const TEST_PASSWORD = 'correct-password-123'
const WRONG_PASSWORD = 'wrong-password-456'

/**
 * Helper: ensure a fresh test user exists.
 * Deletes any existing user with TEST_EMAIL first, then creates a new one.
 */
async function ensureFreshUser(): Promise<{ id: string }> {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: TEST_EMAIL } },
  })
  for (const user of existing.docs) {
    await payload.delete({ collection: 'users', id: user.id })
  }

  const created = await payload.create({
    collection: 'users',
    data: {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      name: 'Login Test User',
    },
  })
  return { id: created.id }
}

describe('Login Limits', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    if (!payload.secret) {
      throw new Error('PAYLOAD_SECRET not available for auth tests')
    }

    await ensureFreshUser()
  })

  afterAll(async () => {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: TEST_EMAIL } },
    })
    for (const user of existing.docs) {
      await payload.delete({ collection: 'users', id: user.id })
    }
  })

  it('has correct auth config values on users collection', () => {
    const usersCollection = payload.collections['users']
    const authConfig = (usersCollection.config as Record<string, unknown>).auth as Record<
      string,
      unknown
    >

    expect(authConfig).toBeDefined()
    expect(authConfig.maxLoginAttempts).toBe(5)
    expect(authConfig.lockTime).toBe(600000)
  })

  it('locks account after 5 consecutive failed login attempts', async () => {
    await ensureFreshUser()

    // Make 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      try {
        await payload.login({
          collection: 'users',
          data: {
            email: TEST_EMAIL,
            password: WRONG_PASSWORD,
          },
        })
        expect.unreachable(`Attempt ${i + 1} should have failed`)
      } catch (err: unknown) {
        expect(err).toBeDefined()
      }
    }

    // 6th attempt with correct password should be rejected (account locked)
    try {
      await payload.login({
        collection: 'users',
        data: {
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        },
      })
      expect.unreachable('6th attempt should have been rejected due to lockout')
    } catch (err: unknown) {
      expect(err).toBeDefined()
      const errObj = err as { message?: string; name?: string }
      const msg = (errObj.message || '').toLowerCase()
      expect(msg).toMatch(/lock|attempt|too many|exceed/i)
    }
  })

  it('resets failure counter on successful login before reaching limit', { timeout: 15000 }, async () => {
    await ensureFreshUser()

    // Make 4 failed login attempts
    for (let i = 0; i < 4; i++) {
      try {
        await payload.login({
          collection: 'users',
          data: {
            email: TEST_EMAIL,
            password: WRONG_PASSWORD,
          },
        })
        expect.unreachable(`Attempt ${i + 1} should have failed`)
      } catch (err: unknown) {
        expect(err).toBeDefined()
      }
    }

    // Successful login resets counter
    const result = await payload.login({
      collection: 'users',
      data: {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      },
    })
    expect(result).toBeDefined()
    expect(result.token).toBeDefined()

    // After reset, make 4 more failures — should NOT lock
    for (let i = 0; i < 4; i++) {
      try {
        await payload.login({
          collection: 'users',
          data: {
            email: TEST_EMAIL,
            password: WRONG_PASSWORD,
          },
        })
        expect.unreachable(`Post-reset attempt ${i + 1} should have failed`)
      } catch (err: unknown) {
        expect(err).toBeDefined()
      }
    }

    // 5th attempt after reset should succeed (not locked)
    const result2 = await payload.login({
      collection: 'users',
      data: {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      },
    })
    expect(result2).toBeDefined()
    expect(result2.token).toBeDefined()
  })
})
