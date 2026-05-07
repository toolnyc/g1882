import type { Metadata } from 'next'
import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import type { SiteSetting, Space } from '@/payload-types'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'
import { generateMeta } from '@/utilities/generateMeta'
import { SpacePageClient } from './SpacePage.client'

export default async function SpacePage() {
  const [space, siteSettings] = await Promise.all([
    getCachedGlobal('space', 1)() as Promise<Space>,
    getCachedGlobal('site-settings', 0)() as Promise<SiteSetting>,
  ])

  return <SpacePageClient space={space} siteSettings={siteSettings ?? undefined} />
}

export async function generateMetadata(): Promise<Metadata> {
  const [space, siteSettings] = await Promise.all([
    getCachedGlobal('space', 0)() as Promise<Space>,
    getCachedGlobal('site-settings', 0)() as Promise<SiteSetting>,
  ])

  const galleryName = siteSettings?.name || 'Gallery 1882'
  const title = space?.pageTitle || 'Gallery Space'
  const description =
    space?.intro?.description ||
    siteSettings?.description ||
    siteSettings?.tagline ||
    'Rent our contemporary gallery space for private events, corporate gatherings, and art-centric celebrations.'

  if (!space) {
    return {
      alternates: {
        canonical: '/space',
      },
      title,
      description,
    }
  }

  const meta = await generateMeta({
    doc: {
      ...space,
      meta: {
        title: `${title} | ${galleryName}`,
        description,
      },
    },
  })

  return {
    ...meta,
    alternates: {
      canonical: '/space',
    },
  }
}
