import React from 'react'

import { DirectoryListing } from '@/components/DirectoryListing'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'
import { CurrentArtistBanner } from '@/components/CurrentArtistBanner'
import { getCachedArtists } from '@/utilities/getArtists'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { resolveArtist, resolveMediaUrl } from '@/utilities/mediaHelpers'

export default async function ArtistsPage() {
  const artists = await getCachedArtists(1)()
  // Fetch with depth 2 to populate featuredPerson.image relation
  const happenings = await getCachedHappenings({}, 2)()

  // Find the most recent happening
  const mostRecentHappening = [...happenings].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  )[0]

  // Find the associated artist
  let associatedArtist: {
    id: string
    name: string
    bio: string
    image: string
    exhibitions: string[]
    slug?: string
  } | null = null
  let exhibitionTitle: string | undefined

  if (mostRecentHappening) {
    const artist = resolveArtist(mostRecentHappening.featuredPerson)

    if (artist) {
      const imageUrl = resolveMediaUrl(artist.image, '/media/test-artist.jpg')

      associatedArtist = {
        id: artist.id,
        name: artist.name,
        bio: artist.bio || '',
        image: imageUrl,
        exhibitions: [],
        slug: artist.slug,
      }
      exhibitionTitle = mostRecentHappening.title
    }
  }

  // Map artists to DirectoryListing format
  const artistItems = artists.map((artist) => {
    const imageUrl = resolveMediaUrl(artist.image, '/media/test-artist.jpg')

    return {
      id: artist.id,
      slug: artist.slug,
      name: artist.name,
      groupKey: artist.name.charAt(0).toUpperCase(),
      displayName: artist.name,
      subtitle: artist.bio || undefined,
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
          associatedArtist && exhibitionTitle ? (
            <CurrentArtistBanner artist={associatedArtist} exhibitionTitle={exhibitionTitle} />
          ) : undefined
        }
      />
    </main>
  )
}
