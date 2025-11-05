'use client'
import React from 'react'
import { DirectoryListing } from '@/components/DirectoryListing'
import { ArtistFeature } from '@/components/ArtistFeature'
import { CurrentExhibitionBanner } from '@/components/CurrentExhibitionBanner'
import { mockExhibitions, mockArtists } from '@/data/mockData'
import { toKebabCase } from '@/utilities/toKebabCase'

export default function ExhibitionsPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getExhibitionSubtitle = (exhibition: any) => {
    const startDate = formatDate(exhibition.startDate)
    const endDate = formatDate(exhibition.endDate)
    return `${startDate} - ${endDate}`
  }

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
        items={mockExhibitions.map((exhibition) => ({ ...exhibition, name: exhibition.title }))}
        title="Exhibitions"
        groupBy="chronological"
        getGroupKey={(exhibition) => new Date(exhibition.startDate).getFullYear().toString()}
        getDisplayName={(exhibition) => exhibition.title}
        getSubtitle={getExhibitionSubtitle}
        banner={<CurrentExhibitionBanner exhibition={mostRecentExhibition} />}
      />
    </main>
  )
}
