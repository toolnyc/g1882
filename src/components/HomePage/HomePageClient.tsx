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
import type { Happening, Home, SiteSetting } from '@/payload-types'

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
  isUpNext?: boolean
  siteSettings?: SiteSetting | null
}

export const HomePageClient: React.FC<HomePageClientProps> = ({
  homeData,
  currentHappening,
  upcomingHappenings,
  featuredArtistData,
  visitSectionData,
  heroVideoUrl,
  heroVideoPosterUrl,
  isUpNext = false,
  siteSettings,
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
        />
      )}

      {/* Gate disabled (launched): show full site */}
      {showFullSite && (
        <>
          <GalleryHero
            heroVideoUrl={heroVideoUrl}
            heroVideoPosterUrl={heroVideoPosterUrl}
          />

          <MissionSection
            missionCaption={homeData?.missionCaption}
            missionStatement={homeData?.missionStatement}
            missionCtaText={homeData?.missionCtaText}
            missionCtaUrl={homeData?.missionCtaUrl}
          />

          {currentHappening && (
            <CurrentExhibition
              happening={currentHappening}
              isUpNext={isUpNext}
              onNowLabel={siteSettings?.labels?.onNow}
              upNextLabel={siteSettings?.labels?.upNext}
              viewHappeningLabel={siteSettings?.labels?.viewHappening}
            />
          )}

          {featuredArtistData && (
            <ArtistFeature
              {...featuredArtistData}
              caption={siteSettings?.labels?.featuredArtist}
              ctaPrefix={homeData?.featuredArtistCtaPrefix}
            />
          )}

          {upcomingHappenings.length > 0 && homeData?.whatsHappeningEnabled !== false && (
            <UpcomingHappenings
              happenings={upcomingHappenings}
              sectionTitle={homeData?.whatsHappeningTitle}
              upcomingCaption={siteSettings?.labels?.upcoming}
              opensLabel={siteSettings?.labels?.opens}
              closesLabel={siteSettings?.labels?.closes}
              viewHappeningLabel={siteSettings?.labels?.viewHappening}
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
