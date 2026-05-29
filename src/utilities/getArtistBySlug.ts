import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

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
 * Returns a cached function to fetch an artist by slug.
 * Pass draft=true (from draftMode() at the page level) to bypass cache for editor previews.
 */
export const getCachedArtistBySlug = (slug: string, draft = false) => {
  const decodedSlug = decodeURIComponent(slug)

  if (draft) {
    return () => getArtistBySlug(decodedSlug, 2, true)
  }

  return unstable_cache(async () => getArtistBySlug(decodedSlug), ['artist', decodedSlug], {
    tags: [`artist_${decodedSlug}`, 'artists'],
    revalidate: false,
  })
}

export { getArtistBySlug }

