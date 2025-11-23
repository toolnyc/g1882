import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getPostBySlug(slug: string, depth = 2) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    pagination: false,
    overrideAccess: false,
  })

  return result.docs[0] || null
}

/**
 * Returns a cached function to fetch a post by slug
 */
export const getCachedPostBySlug = (slug: string) =>
  unstable_cache(async () => getPostBySlug(slug), ['post', slug], {
    tags: [`post_${slug}`],
  })

export { getPostBySlug }

