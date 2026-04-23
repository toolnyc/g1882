import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
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
 * When draft mode is enabled, bypasses cache to always fetch fresh draft content.
 */
export const getCachedSpace = (depth = 0) => {
  return async () => {
    const { isEnabled } = await draftMode()

    // When in draft mode, bypass cache to always get fresh draft content
    if (isEnabled) {
      return getSpace(depth, true)
    }

    return unstable_cache(
      async () => getSpace(depth, false),
      ['site-settings', `site-settings-depth-${depth}`],
      {
        tags: ['global_site-settings'],
        revalidate: 60,
      },
    )()
  }
}
