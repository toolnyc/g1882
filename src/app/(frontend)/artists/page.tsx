import React from 'react'
import { DirectoryListing } from '@/components/DirectoryListing'
import { CurrentArtistBanner } from '@/components/CurrentArtistBanner'
import { getCachedArtists } from '@/utilities/getArtists'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Artist, Happening, Media } from '@/payload-types'

export default async function ArtistsPage() {
  const artists = await getCachedArtists(1)()
  const happenings = await getCachedHappenings({})()

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
  } | null = null
  let exhibitionTitle: string | undefined

  if (mostRecentHappening) {
    const artist =
      typeof mostRecentHappening.featuredPerson === 'object' && mostRecentHappening.featuredPerson
        ? (mostRecentHappening.featuredPerson as Artist)
        : null

    if (artist) {
      const artistImage =
        typeof artist.image === 'object' && artist.image ? (artist.image as Media) : null
      const imageUrl = artistImage?.url
        ? getMediaUrl(artistImage.url, artistImage.updatedAt)
        : '/media/test-artist.jpg'

      associatedArtist = {
        id: artist.id,
        name: artist.name,
        bio: artist.bio || '',
        image: imageUrl,
        exhibitions: [],
      }
      exhibitionTitle = mostRecentHappening.title
    }
  }

  // Map artists to DirectoryListing format
  const artistItems = artists.map((artist) => {
    const artistImage =
      typeof artist.image === 'object' && artist.image ? (artist.image as Media) : null
    const imageUrl = artistImage?.url
      ? getMediaUrl(artistImage.url, artistImage.updatedAt)
      : '/media/test-artist.jpg'

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
    <main className="min-h-screen bg-off-white">
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
