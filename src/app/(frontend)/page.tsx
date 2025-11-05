import React from 'react'
import { GalleryHero } from '@/components/GalleryHero'
import { CurrentExhibition } from '@/components/CurrentExhibition'
import { VisitSection } from '@/components/VisitSection'
import { ArtistFeature } from '@/components/ArtistFeature'
import { UpcomingExhibitions } from '@/components/UpcomingExhibitions'
import { MissionSection } from '@/components/MissionSection'
import { GalleryInfo } from '@/components/GalleryInfo'
import {
  mockExhibitions,
  mockGalleryInfo,
  mockVisitSection,
  mockFeaturedArtist,
} from '@/data/mockData'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <GalleryHero />

      {/* Mission Section */}
      <MissionSection />

      {/* Current Exhibition */}
      <CurrentExhibition exhibition={mockExhibitions[0]} />

      {/* Visit Section */}
      <VisitSection {...mockVisitSection} />

      {/* Artist Feature */}
      <ArtistFeature {...mockFeaturedArtist} />

      {/* Upcoming Exhibitions */}
      <UpcomingExhibitions exhibitions={mockExhibitions.slice(1)} />

      {/* Gallery Info */}
    </main>
  )
}
