'use client'

import React, { useEffect } from 'react'
import { GalleryHero } from '@/components/GalleryHero'
import { CurrentExhibition } from '@/components/CurrentExhibition'
import { VisitSection } from '@/components/VisitSection'
import { ArtistFeature } from '@/components/ArtistFeature'
import { UpcomingHappenings } from '@/components/UpcomingHappenings'
import { MissionSection } from '@/components/MissionSection'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useNewsletterGate } from '@/providers/NewsletterGate/context'
import type { Happening, Home } from '@/payload-types'

type FormattedHappening = Omit<Happening, 'heroImage'> & {
  heroImage: { url: string; alt?: string } | string | null
  featured: boolean
  isActive: boolean
}

interface HomePageClientProps {
  homeData: Home
  currentHappening?: FormattedHappening
  upcomingHappenings: (Happening & { featured: boolean })[]
  featuredArtistData: ReturnType<typeof import('@/utilities/dataTransformers').transformFeaturedArtist>
  visitSectionData: ReturnType<typeof import('@/utilities/dataTransformers').transformVisitSection>
}

export const HomePageClient: React.FC<HomePageClientProps> = ({
  homeData,
  currentHappening,
  upcomingHappenings,
  featuredArtistData,
  visitSectionData,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const { shouldShowFullSite } = useNewsletterGate()

  // Set header theme for glassy navbar effect on homepage
  useEffect(() => {
    setHeaderTheme('glassy')
  }, [setHeaderTheme])

  // Two states:
  // 1. Gate enabled (pre-launch) and not admin -> show only video/logo/weather with "Coming Soon"
  // 2. Gate disabled OR admin previewing -> show full site
  const showFullSite = shouldShowFullSite
  const showLanderContent = !shouldShowFullSite

  return (
    <main className="min-h-screen bg-off-white">
      {/* Gate enabled (pre-launch): show only video with "Coming Soon" */}
      {showLanderContent && (
        <GalleryHero statusText="Coming Soon" statusIndicatorColor="bg-lake" />
      )}

      {/* Gate disabled (launched): show full site */}
      {showFullSite && (
        <>
          <GalleryHero statusText="Open" statusIndicatorColor="bg-bright-lake" />

          <MissionSection
            missionStatement={homeData?.missionStatement}
            missionCtaText={homeData?.missionCtaText}
            missionCtaUrl={homeData?.missionCtaUrl}
          />

          {currentHappening && <CurrentExhibition happening={currentHappening} />}

          {visitSectionData && <VisitSection {...visitSectionData} />}

          {featuredArtistData && <ArtistFeature {...featuredArtistData} />}

          {upcomingHappenings.length > 0 && <UpcomingHappenings happenings={upcomingHappenings} />}
        </>
      )}
    </main>
  )
}
