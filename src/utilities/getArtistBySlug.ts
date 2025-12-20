import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

async function getArtistBySlug(slug: string, depth = 2, draft = false) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'artists',
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
 * Returns a function to fetch an artist by slug
 * Automatically handles draft mode - skips cache when previewing drafts
 */
export const getCachedArtistBySlug = (slug: string) => {
  return async () => {
    const { isEnabled: isDraftMode } = await draftMode()

    if (isDraftMode) {
      return getArtistBySlug(slug, 2, true)
    }

    return unstable_cache(async () => getArtistBySlug(slug), ['artist', slug], {
      tags: [`artist_${slug}`, 'artists'],
      revalidate: 60,
    })()
  }
}

export { getArtistBySlug }

