import { revalidatePath, revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request): Promise<Response> {
  // Authenticate via Payload
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse request body for optional specific tags
  const body = await request.json().catch(() => ({}))
  const { tags, paths } = body

  // Default tags to revalidate all content
  const defaultTags = ['posts', 'artists', 'happenings', 'posts-sitemap']
  const defaultPaths = ['/journal', '/artists', '/happenings', '/']

  const tagsToRevalidate = tags || defaultTags
  const pathsToRevalidate = paths || defaultPaths

  // Revalidate tags
  for (const tag of tagsToRevalidate) {
    revalidateTag(tag)
  }

  // Revalidate paths
  for (const path of pathsToRevalidate) {
    revalidatePath(path)
  }

  payload.logger.info(`Cache revalidated by ${user.email}: tags=${tagsToRevalidate.join(',')}, paths=${pathsToRevalidate.join(',')}`)

  return Response.json({
    success: true,
    revalidated: { tags: tagsToRevalidate, paths: pathsToRevalidate },
  })
}
