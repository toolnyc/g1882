import React from 'react'
import { GalleryHero } from '@/components/GalleryHero'
import { CurrentExhibition } from '@/components/CurrentExhibition'
import { UpcomingExhibitions } from '@/components/UpcomingExhibitions'
import { GalleryInfo } from '@/components/GalleryInfo'
import { mockExhibitions, mockGalleryInfo } from '@/data/mockData'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <GalleryHero />

      {/* Current Exhibition */}
      <CurrentExhibition exhibition={mockExhibitions[0]} />

      {/* Upcoming Exhibitions */}
      <UpcomingExhibitions exhibitions={mockExhibitions.slice(1)} />

      {/* Gallery Info */}
      <GalleryInfo info={mockGalleryInfo} />
    </main>
  )
}
