import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload({ config: configPromise })
  const { isEnabled } = await draftMode()

  const global = await payload.findGlobal({
    slug,
    depth,
    draft: isEnabled,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 * When draft mode is enabled, bypasses cache to always fetch fresh draft content
 */
export const getCachedGlobal = (slug: Global, depth = 0) => {
  return async () => {
    const { isEnabled } = await draftMode()
    
    // When in draft mode, bypass cache to always get fresh draft content
    if (isEnabled) {
      return getGlobal(slug, depth)
    }
    
    // When not in draft mode, use cache
    const cachedGetGlobal = unstable_cache(
      async () => getGlobal(slug, depth),
      [slug],
      {
        tags: [`global_${slug}`],
      }
    )
    
    return cachedGetGlobal()
  }
}
