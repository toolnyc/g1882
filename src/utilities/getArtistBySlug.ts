import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

async function getArtistBySlug(slug: string, depth = 2, draft = false) {
  const payload = await getPayload({ config: configPromise })

  // Decode URI-encoded slugs (e.g., "Louise%20Jones" -> "Louise Jones")
  // This handles legacy slugs that contain spaces or special characters
  const decodedSlug = decodeURIComponent(slug)

  const result = await payload.find({
    collection: 'artists',
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

  return result.docs[0] || null
}

/**
 * Returns a function to fetch an artist by slug
 * Automatically handles draft mode - skips cache when previewing drafts
 */
export const getCachedArtistBySlug = (slug: string) => {
  // Decode early so cache keys are consistent regardless of encoding
  const decodedSlug = decodeURIComponent(slug)

  return async () => {
    const { isEnabled: isDraftMode } = await draftMode()

    if (isDraftMode) {
      return getArtistBySlug(decodedSlug, 2, true)
    }

    return unstable_cache(async () => getArtistBySlug(decodedSlug), ['artist', decodedSlug], {
      tags: [`artist_${decodedSlug}`, 'artists'],
      revalidate: 60,
    })()
  }
}

export { getArtistBySlug }

