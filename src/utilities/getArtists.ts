import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getArtists(depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'artists',
    depth,
    pagination: false,
    limit: 1000,
    sort: 'name',
    overrideAccess: true,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      name: true,
      slug: true,
      bio: true,
      image: true,
    },
  })

  return result.docs
}

/**
 * Returns a cached function to fetch artists
 */
export const getCachedArtists = (depth = 1) =>
  unstable_cache(async () => getArtists(depth), ['artists'], {
    tags: ['artists'],
    revalidate: 60,
  })

export { getArtists }

