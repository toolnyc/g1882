import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

async function getHappeningBySlug(slug: string, depth = 2, draft = false) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'happenings',
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
 * Returns a function to fetch a happening by slug
 * Automatically handles draft mode - skips cache when previewing drafts
 */
export const getCachedHappeningBySlug = (slug: string) => {
  return async () => {
    const { isEnabled: isDraftMode } = await draftMode()

    // Don't cache draft mode requests
    if (isDraftMode) {
      return getHappeningBySlug(slug, 2, true)
    }

    return unstable_cache(async () => getHappeningBySlug(slug), ['happening', slug], {
      tags: [`happening_${slug}`, 'happenings'],
      revalidate: 60,
    })()
  }
}

export { getHappeningBySlug }

