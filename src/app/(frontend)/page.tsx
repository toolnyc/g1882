import React from 'react'

import { HomePageClient } from '@/components/HomePage/HomePageClient'
import { getCachedHappenings } from '@/utilities/getHappenings'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'
import { getCachedSpace } from '@/utilities/getSpace'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { transformFeaturedArtist, transformVisitSection } from '@/utilities/dataTransformers'
import type { Happening, Home } from '@/payload-types'

type FormattedHappening = Omit<Happening, 'heroImage'> & {
  heroImage: { url: string; alt?: string } | string | null
  featured: boolean
  isActive: boolean
}

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

  const formatHeroImage = (
    heroImage: Happening['heroImage'],
  ): { url: string; alt?: string } | string | null => {
    if (typeof heroImage === 'object' && heroImage) {
      return {
        url: resolveMediaUrl(heroImage, '/media/test-art.jpg'),
        alt: heroImage.alt || undefined,
      }
    }

    return (heroImage as string | null) || null
  }

  const formattedCurrentHappening: FormattedHappening | undefined = currentHappening
    ? {
        ...currentHappening,
        heroImage: formatHeroImage(currentHappening.heroImage),
        featured: currentHappening.featured ?? false,
        isActive: currentHappening.isActive ?? false,
      }
    : undefined

  return (
    <HomePageClient
      homeData={homeData}
      currentHappening={formattedCurrentHappening}
      upcomingHappenings={upcomingHappenings.slice(0, 3).map((h) => ({
        ...h,
        featured: h.featured ?? false,
      }))}
      featuredArtistData={featuredArtistData}
      visitSectionData={visitSectionData}
    />
  )
}
