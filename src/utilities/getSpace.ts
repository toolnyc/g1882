import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

async function getSpace(depth = 0) {
  const payload = await getPayload({ config: configPromise })
  const { isEnabled } = await draftMode()

  const space = await payload.findGlobal({
    slug: 'space',
    depth,
    draft: isEnabled,
  })

  return space
}

/**
 * Returns a cached function to fetch the space global
 * When draft mode is enabled, bypasses cache to always fetch fresh draft content
 */
export const getCachedSpace = (depth = 0) => {
  return async () => {
    const { isEnabled } = await draftMode()
    
    // When in draft mode, bypass cache to always get fresh draft content
    if (isEnabled) {
      return getSpace(depth)
    }
    
    // When not in draft mode, use cache
    const cachedGetSpace = unstable_cache(
      async () => getSpace(depth),
      ['space'],
      {
        tags: ['space'],
      }
    )
    
    return cachedGetSpace()
  }
}

