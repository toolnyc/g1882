import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getPosts(depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth,
    sort: '-publishedAt',
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    where: {
      _status: {
        equals: 'published',
      },
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
 */
export const getCachedPosts = (depth = 1) =>
  unstable_cache(async () => getPosts(depth), ['posts'], {
    tags: ['posts'],
    revalidate: 60,
  })

export { getPosts }

