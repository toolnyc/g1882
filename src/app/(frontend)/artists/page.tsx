import type { Metadata } from 'next'
import React from 'react'

import { DirectoryListing } from '@/components/DirectoryListing'
import { draftMode } from 'next/headers'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: '/artists',
    },
    title: 'Artists',
    description:
      'Meet the artists exhibited at Gallery 1882 in Chesterton, Indiana.',
  }
}

import { getCachedArtists } from '@/utilities/getArtists'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import type { SiteSetting } from '@/payload-types'

const getLastName = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  return parts[parts.length - 1] || name
}

export default async function ArtistsPage() {
  const { isEnabled: draft } = await draftMode()
  const [siteSettings, artists] = await Promise.all([
    getCachedGlobal('site-settings', 0, draft)() as Promise<SiteSetting>,
    getCachedArtists(1, draft)(),
  ])
  const showSearch = siteSettings?.search?.artistsShowSearch !== false

  const sortedArtists = [...artists].sort((a, b) => {
    const lastA = getLastName(a.name).toLowerCase()
    const lastB = getLastName(b.name).toLowerCase()
    return lastA.localeCompare(lastB)
  })

  const artistItems = sortedArtists.map((artist) => ({
    id: artist.id,
    slug: artist.slug,
    name: artist.name,
    groupKey: getLastName(artist.name).charAt(0).toUpperCase(),
    displayName: artist.name,
    href: `/artists/${artist.slug}`,
    image: resolveMediaUrl(artist.image),
  }))

  return (
    <main className="bg-off-white">
      <DirectoryListing
        items={artistItems}
        title={siteSettings?.pageTitles?.artists || 'Artists'}
        groupBy="alphabetical"
        showSearch={showSearch}
      />
    </main>
  )
}
