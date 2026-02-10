import React from 'react'

import { DirectoryListing } from '@/components/DirectoryListing'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'
import { CurrentArtistBanner } from '@/components/CurrentArtistBanner'
import { getCachedArtists } from '@/utilities/getArtists'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import type { Artist } from '@/payload-types'

const getLastName = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  return parts[parts.length - 1] || name
}

export default async function ArtistsPage() {
  const artists = await getCachedArtists(1)()
  // Fetch with depth 2 to populate artists array relations
  const happenings = await getCachedHappenings({ active: true }, 2)()

  // Find active exhibitions that reference artists via the new `artists` array
  const activeExhibitions = happenings.filter(
    (h) => h.isActive && (h.type === 'exhibition' || (!h.type && h.endDate)),
  )

  // Build a map of artist ID → exhibition titles
  const artistExhibitionMap = new Map<string, string[]>()
  for (const exhibition of activeExhibitions) {
    const exhibArtists = exhibition.artists || []
    for (const a of exhibArtists) {
      const artistObj = typeof a === 'object' && a ? (a as Artist) : null
      if (artistObj) {
        const existing = artistExhibitionMap.get(artistObj.id) || []
        existing.push(exhibition.title || 'Exhibition')
        artistExhibitionMap.set(artistObj.id, existing)
      }
    }
    // Also check legacy featuredPerson
    const fp = typeof exhibition.featuredPerson === 'object' && exhibition.featuredPerson
      ? (exhibition.featuredPerson as Artist)
      : null
    if (fp && !artistExhibitionMap.has(fp.id)) {
      artistExhibitionMap.set(fp.id, [exhibition.title || 'Exhibition'])
    }
  }

  // Find an artist for the "Currently Showing" banner — only from active exhibitions
  let bannerArtist: {
    id: string
    name: string
    bio: string
    image: string
    exhibitions: string[]
    slug?: string
  } | null = null
  let exhibitionTitle: string | undefined

  if (activeExhibitions.length > 0) {
    const firstExhibition = activeExhibitions[0]
    // Try the new artists array first
    const exhibitionArtists = firstExhibition.artists || []
    const firstArtist = exhibitionArtists.find(
      (a) => typeof a === 'object' && a,
    ) as Artist | undefined

    if (firstArtist) {
      bannerArtist = {
        id: firstArtist.id,
        name: firstArtist.name,
        bio: firstArtist.bio || '',
        image: resolveMediaUrl(firstArtist.image),
        exhibitions: [],
        slug: firstArtist.slug,
      }
      exhibitionTitle = firstExhibition.title
    } else {
      // Fall back to legacy featuredPerson
      const fp = typeof firstExhibition.featuredPerson === 'object' && firstExhibition.featuredPerson
        ? (firstExhibition.featuredPerson as Artist)
        : null
      if (fp) {
        bannerArtist = {
          id: fp.id,
          name: fp.name,
          bio: fp.bio || '',
          image: resolveMediaUrl(fp.image),
          exhibitions: [],
          slug: fp.slug,
        }
        exhibitionTitle = firstExhibition.title
      }
    }
  }

  // Sort artists alphabetically by last name
  const sortedArtists = [...artists].sort((a, b) => {
    const lastA = getLastName(a.name).toLowerCase()
    const lastB = getLastName(b.name).toLowerCase()
    return lastA.localeCompare(lastB)
  })

  // Map artists to DirectoryListing format
  const artistItems = sortedArtists.map((artist) => {
    const imageUrl = resolveMediaUrl(artist.image)
    const exhibitions = artistExhibitionMap.get(artist.id)
    const subtitle = exhibitions
      ? `Currently in: ${exhibitions.join(', ')}`
      : (artist.bio || undefined)

    return {
      id: artist.id,
      slug: artist.slug,
      name: artist.name,
      groupKey: getLastName(artist.name).charAt(0).toUpperCase(),
      displayName: artist.name,
      subtitle,
      href: `/artists/${artist.slug}`,
      image: imageUrl,
    }
  })

  return (
    <main className="bg-off-white">
      <DirectoryListing
        items={artistItems}
        title="Artists"
        groupBy="alphabetical"
        banner={
          bannerArtist && exhibitionTitle ? (
            <CurrentArtistBanner artist={bannerArtist} exhibitionTitle={exhibitionTitle} />
          ) : undefined
        }
      />
    </main>
  )
}
