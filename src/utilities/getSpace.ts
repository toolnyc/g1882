import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

const getSpace = cache(async (depth = 0, draft = false) => {
  const payload = await getPayload({ config: configPromise })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth,
    draft,
  })

  return siteSettings
})

/**
 * Returns a cached function to fetch gallery info from the site-settings global.
 * This is a compatibility wrapper — all callers that previously read the Space global
 * now read from SiteSettings, which contains the same fields (name, address, phone,
 * email, structuredHours, admission, etc.) under the Gallery Info tab.
 *
 * Pass draft=true (from draftMode() at the page level) to bypass cache for editor previews.
 */
export const getCachedSpace = (depth = 0, draft = false) => {
  if (draft) {
    return () => getSpace(depth, true)
  }

  return unstable_cache(
    async () => getSpace(depth, false),
    ['site-settings', `site-settings-depth-${depth}`],
    {
      tags: ['global_site-settings'],
      revalidate: false,
    },
  )
}
