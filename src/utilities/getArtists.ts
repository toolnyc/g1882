import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

async function getArtists(depth = 1, draft = false) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'artists',
    depth,
    draft,
    pagination: false,
    limit: 1000,
    sort: 'name',
    overrideAccess: true,
    where: {
      ...(draft ? {} : { _status: { equals: 'published' } }),
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
 * Bypasses cache in draft mode
 */
export const getCachedArtists = (depth = 1) =>
  async () => {
    const { isEnabled } = await draftMode()

    if (isEnabled) {
      return getArtists(depth, true)
    }

    return unstable_cache(async () => getArtists(depth), ['artists'], {
      tags: ['artists'],
      revalidate: 60,
    })()
  }

export { getArtists }

