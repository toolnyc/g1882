import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { cache } from 'react'

type Global = keyof Config['globals']

const getGlobal = cache(async (slug: Global, depth = 0, draft = false) => {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    draft,
  })

  return global
})

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 * When draft mode is enabled, bypasses cache to always fetch fresh draft content
 */
export const getCachedGlobal = (slug: Global, depth = 0) => {
  return async () => {
    const { isEnabled } = await draftMode()

    // When in draft mode, bypass cache to always get fresh draft content
    if (isEnabled) {
      return getGlobal(slug, depth, true)
    }

    return unstable_cache(
      async () => getGlobal(slug, depth, false),
      [`global-${slug}`, `depth-${depth}`],
      {
        tags: [`global_${slug}`],
        revalidate: 60,
      },
    )()
  }
}
