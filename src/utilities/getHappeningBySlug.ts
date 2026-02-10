import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

async function getHappeningBySlug(slug: string, depth = 2, draft = false) {
  const payload = await getPayload({ config: configPromise })

  // Decode URI-encoded slugs (e.g., "because%20flowers" -> "because flowers")
  // This handles legacy slugs that contain spaces or special characters
  const decodedSlug = decodeURIComponent(slug)

  // First try to find by slug
  const result = await payload.find({
    collection: 'happenings',
    depth,
    draft,
    where: {
      slug: {
        equals: decodedSlug,
      },
      ...(draft ? {} : { _status: { equals: 'published' } }),
    },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  if (result.docs[0]) {
    return result.docs[0]
  }

  // Fall back to finding by ID (for happenings that may lack a slug)
  try {
    const byId = await payload.findByID({
      collection: 'happenings',
      id: slug,
      depth,
      draft,
    })
    if (byId && (draft || byId._status === 'published')) {
      return byId
    }
  } catch {
    // ID lookup failed (invalid ID format, not found, etc.) -- return null
  }

  return null
}

/**
 * Returns a function to fetch a happening by slug
 * Automatically handles draft mode - skips cache when previewing drafts
 */
export const getCachedHappeningBySlug = (slug: string) => {
  // Decode early so cache keys are consistent regardless of encoding
  const decodedSlug = decodeURIComponent(slug)

  return async () => {
    const { isEnabled: isDraftMode } = await draftMode()

    // Don't cache draft mode requests
    if (isDraftMode) {
      return getHappeningBySlug(decodedSlug, 2, true)
    }

    return unstable_cache(async () => getHappeningBySlug(decodedSlug), ['happening', decodedSlug], {
      tags: [`happening_${decodedSlug}`, 'happenings'],
      revalidate: 60,
    })()
  }
}

export { getHappeningBySlug }

