import React from 'react'
import { GalleryHero } from '@/components/GalleryHero'
import { CurrentExhibition } from '@/components/CurrentExhibition'
import { VisitSection } from '@/components/VisitSection'
import { ArtistFeature } from '@/components/ArtistFeature'
import { UpcomingHappenings } from '@/components/UpcomingHappenings'
import { MissionSection } from '@/components/MissionSection'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { getCachedSpace } from '@/utilities/getSpace'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { transformFeaturedArtist, transformVisitSection } from '@/utilities/dataTransformers'
import type { Happening, Home } from '@/payload-types'

export default async function HomePage() {
  // Fetch home global data
  const homeData = (await getCachedGlobal('home', 2)()) as Home
  // Fetch with depth 2 to populate featuredPerson.image relation
  const getHappenings = getCachedHappenings({}, 2)
  const activeHappenings = await getHappenings()

  // Get the most active happening (or first featured)
  const currentHappening = activeHappenings.find((h) => h.featured) || activeHappenings[0]
  // Get upcoming happenings (not active, future dates)
  const getUpcoming = getCachedHappenings({ upcoming: true }, 2)
  const upcomingHappenings = await getUpcoming()

  // Fetch space global for visit section
  const space = await getCachedSpace()()

  // Get featured happening for artist feature
  const getFeaturedHappenings = getCachedHappenings({ featured: true }, 2)
  const featuredHappenings = await getFeaturedHappenings()

  const featuredHappening = featuredHappenings[0] || currentHappening

  const featuredArtistData = transformFeaturedArtist(homeData, featuredHappening)
  const visitSectionData = transformVisitSection(homeData, space)

  const formatHeroImage = (heroImage: Happening['heroImage']) => {
    if (typeof heroImage === 'object' && heroImage) {
      return {
        url: resolveMediaUrl(heroImage, '/media/test-art.jpg'),
        alt: heroImage.alt || undefined,
      }
    }

    return (heroImage as string | null) || null
  }

  return (
    <main className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <GalleryHero />

      {/* Mission Section */}
      <MissionSection
        missionStatement={homeData?.missionStatement}
        missionCtaText={homeData?.missionCtaText}
        missionCtaUrl={homeData?.missionCtaUrl}
      />

      {/* Current Happening */}
      {currentHappening && (
        <CurrentExhibition
          happening={{
            ...currentHappening,
            heroImage: formatHeroImage(currentHappening.heroImage),
            featured: currentHappening.featured ?? false,
            isActive: currentHappening.isActive ?? false,
          }}
        />
      )}

      {/* Visit Section */}
      {visitSectionData && <VisitSection {...visitSectionData} />}

      {/* Artist Feature */}
      {featuredArtistData && <ArtistFeature {...featuredArtistData} />}

      {/* Upcoming Happenings */}
      {upcomingHappenings.length > 0 && (
        <UpcomingHappenings
          happenings={upcomingHappenings.slice(0, 3).map((h) => ({
            ...h,
            featured: h.featured ?? false,
          }))}
        />
      )}

      {/* Gallery Info */}
    </main>
  )
}
