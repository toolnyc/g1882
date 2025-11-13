import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getArtistBySlug(slug: string, depth = 2) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'artists',
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
 * Returns a cached function to fetch an artist by slug
 */
export const getCachedArtistBySlug = (slug: string) =>
  unstable_cache(async () => getArtistBySlug(slug), ['artist', slug], {
    tags: [`artist_${slug}`],
  })

export { getArtistBySlug }

