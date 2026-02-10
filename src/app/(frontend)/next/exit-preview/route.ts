import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config })
  const headersList = await headers()

  // Verify user is authenticated before allowing draft mode changes
  const { user } = await payload.auth({ headers: headersList })
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
