import { cookies } from 'next/headers'
import type { User } from '../payload-types'
import { getClientSideURL } from './getURL'

export async function getAuthStatus(): Promise<{ isAuthenticated: boolean; user: User | null }> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return { isAuthenticated: false, user: null }
  }

  try {
    const res = await fetch(`${getClientSideURL()}/api/users/me`, {
      headers: { Authorization: `JWT ${token}` },
    })

    if (!res.ok) {
      return { isAuthenticated: false, user: null }
    }

    const { user } = await res.json()
    return { isAuthenticated: Boolean(user), user: user || null }
  } catch {
    return { isAuthenticated: false, user: null }
  }
}
