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
      <section className="py-16 bg-off-white">
        <div className="container">
          <CurrentExhibition exhibition={mockExhibitions[0]} />
        </div>
      </section>

      {/* Upcoming Exhibitions */}
      <section className="py-16 bg-white">
        <div className="container">
          <UpcomingExhibitions exhibitions={mockExhibitions.slice(1)} />
        </div>
      </section>

      {/* Gallery Info */}
      <section className="py-16 bg-off-white">
        <div className="container">
          <GalleryInfo info={mockGalleryInfo} />
        </div>
      </section>
    </main>
  )
}
