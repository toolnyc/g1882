import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getSpace(depth = 0) {
  const payload = await getPayload({ config: configPromise })
  const space = await payload.findGlobal({
    slug: 'space',
    depth,
  })

  return space
}

/**
 * Returns a cached function to fetch the space global
 */
export const getCachedSpace = (depth = 0) =>
  unstable_cache(async () => getSpace(depth), ['space'], {
    tags: ['space'],
  })

