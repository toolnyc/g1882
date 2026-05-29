import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

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
 * Returns a cached function to fetch posts.
 * Pass draft=true (from draftMode() at the page level) to bypass cache for editor previews.
 */
export const getCachedPosts = (depth = 1, draft = false) => {
  if (draft) {
    return () => getPosts(depth, true)
  }

  return unstable_cache(async () => getPosts(depth), ['posts'], {
    tags: ['posts'],
    revalidate: false,
  })
}

export { getPosts }

