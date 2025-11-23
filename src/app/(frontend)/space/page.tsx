import type { Metadata } from 'next'
import React from 'react'
import { getCachedSpace } from '@/utilities/getSpace'
import { generateMeta } from '@/utilities/generateMeta'
import { SpacePageClient } from './SpacePage.client'

export default function SpacePage() {
  return <SpacePageClient />
}

export async function generateMetadata(): Promise<Metadata> {
  const space = await getCachedSpace()()

  if (!space) {
    return {
      title: 'Space',
    }
  }

  return generateMeta({
    doc: {
      ...space,
      meta: {
        title: space.name || 'Space',
        description: space.description || space.tagline || undefined,
      },
    },
  })
}
