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
  heroVideoUrl?: string | null
  heroVideoPosterUrl?: string | null
  structuredHours?: { day: string; open: string; close: string }[] | null
  isUpNext?: boolean
}

export const HomePageClient: React.FC<HomePageClientProps> = ({
  homeData,
  currentHappening,
  upcomingHappenings,
  featuredArtistData,
  visitSectionData,
  heroVideoUrl,
  heroVideoPosterUrl,
  structuredHours,
  isUpNext = false,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const { shouldShowFullSite } = useNewsletterGate()

  // Set header theme for glassy navbar effect on homepage
  useEffect(() => {
    setHeaderTheme('glassy')
  }, [setHeaderTheme])

  const showFullSite = shouldShowFullSite
  const showLanderContent = !shouldShowFullSite

  return (
    <main className="min-h-screen bg-off-white">
      {/* Gate enabled (pre-launch): show only video with "Coming Soon" */}
      {showLanderContent && (
        <GalleryHero
          heroVideoUrl={heroVideoUrl}
          heroVideoPosterUrl={heroVideoPosterUrl}
          structuredHours={structuredHours}
        />
      )}

      {/* Gate disabled (launched): show full site */}
      {showFullSite && (
        <>
          <GalleryHero
            heroVideoUrl={heroVideoUrl}
            heroVideoPosterUrl={heroVideoPosterUrl}
            structuredHours={structuredHours}
          />

          <MissionSection
            missionCaption={homeData?.missionCaption}
            missionStatement={homeData?.missionStatement}
            missionCtaText={homeData?.missionCtaText}
            missionCtaUrl={homeData?.missionCtaUrl}
          />

          {currentHappening && (
            <CurrentExhibition happening={currentHappening} isUpNext={isUpNext} />
          )}

          {featuredArtistData && <ArtistFeature {...featuredArtistData} />}

          {upcomingHappenings.length > 0 && homeData?.whatsHappeningEnabled !== false && (
            <UpcomingHappenings
              happenings={upcomingHappenings}
              sectionTitle={homeData?.whatsHappeningTitle}
              showIcon={homeData?.whatsHappeningIcon !== false}
            />
          )}

          {visitSectionData && homeData?.visitSectionEnabled !== false && (
            <VisitSection {...visitSectionData} />
          )}
        </>
      )}
    </main>
  )
}
