import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { User } from '../payload-types'

export async function getAuthStatus(): Promise<{ isAuthenticated: boolean; user: User | null }> {
  try {
    const payload = await getPayload({ config: configPromise })
    const requestHeaders = await headers()

    const { user } = await payload.auth({ headers: requestHeaders })

    return {
      isAuthenticated: Boolean(user),
      user: (user as User) || null,
    }
  } catch {
    return { isAuthenticated: false, user: null }
  }
}
