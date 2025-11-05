'use client'
import React from 'react'
import { DirectoryListing } from '@/components/DirectoryListing'
import { ArtistFeature } from '@/components/ArtistFeature'
import { CurrentArtistBanner } from '@/components/CurrentArtistBanner'
import { mockExhibitions, mockArtists } from '@/data/mockData'
import { toKebabCase } from '@/utilities/toKebabCase'

export default function ArtistsPage() {
  // Find the most recent exhibition
  const mostRecentExhibition = [...mockExhibitions].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  )[0]

  // Find the associated artist
  const associatedArtist = mockArtists.find((artist) => artist.name === mostRecentExhibition.artist)

  // Create artist slug
  const artistSlug = toKebabCase(mostRecentExhibition.artist)

  return (
    <main className="min-h-screen bg-off-white">
      <DirectoryListing
        items={mockArtists}
        title="Artists"
        groupBy="alphabetical"
        getGroupKey={(artist) => artist.name.charAt(0).toUpperCase()}
        getDisplayName={(artist) => artist.name}
        getSubtitle={(artist) => artist.bio}
        banner={
          associatedArtist ? (
            <CurrentArtistBanner
              artist={associatedArtist}
              exhibitionTitle={mostRecentExhibition.title}
            />
          ) : undefined
        }
      />
    </main>
  )
}
