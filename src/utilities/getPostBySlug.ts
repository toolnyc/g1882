import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

async function getPostBySlug(slug: string, depth = 2, draft = false) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth,
    draft,
    where: {
      slug: {
        equals: slug,
      },
      ...(draft ? {} : { _status: { equals: 'published' } }),
    },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  return result.docs[0] || null
}

/**
 * Returns a function to fetch a post by slug
 * Automatically handles draft mode - skips cache when previewing drafts
 */
export const getCachedPostBySlug = (slug: string) => {
  return async () => {
    const { isEnabled: isDraftMode } = await draftMode()

    if (isDraftMode) {
      return getPostBySlug(slug, 2, true)
    }

    return unstable_cache(async () => getPostBySlug(slug), ['post', slug], {
      tags: [`post_${slug}`],
    })()
  }
}

export { getPostBySlug }

