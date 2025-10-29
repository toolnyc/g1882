import React from 'react'
import { GalleryHero } from '@/components/GalleryHero'
import { CurrentExhibition } from '@/components/CurrentExhibition'
import { VisitSection } from '@/components/VisitSection'
import { ArtistFeature } from '@/components/ArtistFeature'
import { UpcomingExhibitions } from '@/components/UpcomingExhibitions'
import { JournalBanner } from '@/components/JournalBanner'
import { MissionSection } from '@/components/MissionSection'
import { GalleryInfo } from '@/components/GalleryInfo'
import {
  mockExhibitions,
  mockGalleryInfo,
  mockVisitSection,
  mockFeaturedArtist,
  mockJournalBanner,
  mockMission,
} from '@/data/mockData'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <GalleryHero />

      {/* Current Exhibition */}
      <CurrentExhibition exhibition={mockExhibitions[0]} />

      {/* Visit Section */}
      <VisitSection {...mockVisitSection} />

      {/* Artist Feature */}
      <ArtistFeature {...mockFeaturedArtist} />

      {/* Upcoming Exhibitions */}
      <UpcomingExhibitions exhibitions={mockExhibitions.slice(1)} />

      {/* Journal Banner */}
      <JournalBanner {...mockJournalBanner} />

      {/* Mission Section */}
      <MissionSection {...mockMission} />

      {/* Gallery Info */}
      <GalleryInfo info={mockGalleryInfo} />
    </main>
  )
}
