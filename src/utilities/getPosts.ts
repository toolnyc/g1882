import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

async function getPosts(depth = 1, draft = false) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth,
    draft,
    sort: '-publishedAt',
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    where: {
      ...(draft ? {} : { _status: { equals: 'published' } }),
    },
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      heroImage: true,
    },
  })

  return result.docs
}

/**
 * Returns a cached function to fetch posts
 * Bypasses cache in draft mode
 */
export const getCachedPosts = (depth = 1) =>
  async () => {
    const { isEnabled } = await draftMode()

    if (isEnabled) {
      return getPosts(depth, true)
    }

    return unstable_cache(async () => getPosts(depth), ['posts'], {
      tags: ['posts'],
      revalidate: 60,
    })()
  }

export { getPosts }

