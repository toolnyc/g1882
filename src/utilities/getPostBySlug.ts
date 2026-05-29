import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

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
 * Returns a cached function to fetch a post by slug.
 * Pass draft=true (from draftMode() at the page level) to bypass cache for editor previews.
 */
export const getCachedPostBySlug = (slug: string, draft = false) => {
  if (draft) {
    return () => getPostBySlug(slug, 2, true)
  }

  return unstable_cache(async () => getPostBySlug(slug), ['post', slug], {
    tags: [`post_${slug}`],
    revalidate: false,
  })
}

export { getPostBySlug }

