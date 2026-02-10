import type { Metadata } from 'next'
import React from 'react'

import { getCachedSpace } from '@/utilities/getSpace'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'
import { generateMeta } from '@/utilities/generateMeta'
import { SpacePageClient } from './SpacePage.client'

export default async function SpacePage() {
  const space = await getCachedSpace()()

  return <SpacePageClient space={space ?? undefined} />
}

export async function generateMetadata(): Promise<Metadata> {
  const space = await getCachedSpace()()

  if (!space) {
    return {
      title: 'Gallery Space',
    }
  }

  return generateMeta({
    doc: {
      ...space,
      meta: {
        title: `Gallery Space | ${space.name || 'Gallery 1882'}`,
        description:
          space.description ||
          space.tagline ||
          'Rent our contemporary gallery space for private events, corporate gatherings, and art-centric celebrations.',
      },
    },
  })
}
