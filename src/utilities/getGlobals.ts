import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
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
 * Returns a cached function to fetch a global by slug.
 * Pass draft=true (from draftMode() at the page level) to bypass cache for editor previews.
 */
export const getCachedGlobal = (slug: Global, depth = 0, draft = false) => {
  if (draft) {
    return () => getGlobal(slug, depth, true)
  }

  return unstable_cache(
    async () => getGlobal(slug, depth, false),
    [`global-${slug}`, `depth-${depth}`],
    {
      tags: [`global_${slug}`],
      revalidate: false,
    },
  )
}
