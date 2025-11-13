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
    overrideAccess: false,
  })

  return result.docs
}

/**
 * Returns a cached function to fetch artists
 */
export const getCachedArtists = (depth = 1) =>
  unstable_cache(async () => getArtists(depth), ['artists'], {
    tags: ['artists'],
  })

export { getArtists }

