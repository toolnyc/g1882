import React from 'react'

import { HomePageClient } from '@/components/HomePage/HomePageClient'
import { getCachedHappenings } from '@/utilities/getHappenings'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'
import { getCachedSpace } from '@/utilities/getSpace'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { transformFeaturedArtist, transformVisitSection } from '@/utilities/dataTransformers'
import { isDateRangeType } from '@/utilities/happeningTypeHelpers'
import type { Happening, Home } from '@/payload-types'

type FormattedHappening = Omit<Happening, 'heroImage'> & {
  heroImage: { url: string; alt?: string } | string | null
  featured: boolean
  isActive: boolean
}

export default async function HomePage() {
  // Fetch home global data
  const homeData = (await getCachedGlobal('home', 2)()) as Home
  // Fetch all published happenings once at depth 2 (populates artists, images, and type),
  // then filter in memory. This consolidates what was previously 3 separate DB queries into 1.
  const allHappenings = await getCachedHappenings({}, 2)()

  // Fetch space global for structured hours and visit section
  const space = await getCachedSpace()()

  const now = new Date()

  // Find current active exhibition (prefer date-range types over datetime for "On Now")
  const activeExhibitions = allHappenings.filter(
    (h) => h.isActive && isDateRangeType(h.type),
  )
  const currentHappening =
    activeExhibitions.find((h) => h.featured) ||
    activeExhibitions[0] ||
    allHappenings.find((h) => h.isActive && h.featured) ||
    allHappenings.find((h) => h.isActive)

  // If nothing is active, find the soonest upcoming exhibition for "Up Next"
  let displayHappening = currentHappening
  let isUpNext = false
  if (!displayHappening) {
    const upcomingExhibitions = allHappenings
      .filter((h) => {
        if (!h.startDate) return false
        const startDate = new Date(h.startDate as string)
        return startDate > now && isDateRangeType(h.type)
      })
      .sort((a, b) => new Date(a.startDate as string).getTime() - new Date(b.startDate as string).getTime())
    if (upcomingExhibitions.length > 0) {
      displayHappening = upcomingExhibitions[0]
      isUpNext = true
    }
  }

  // Get upcoming happenings from the same dataset (future start dates, sorted ascending)
  const upcomingHappenings = allHappenings
    .filter((h) => h.startDate && new Date(h.startDate as string) > now)
    .sort((a, b) => new Date(a.startDate as string).getTime() - new Date(b.startDate as string).getTime())

  const featuredArtistData = transformFeaturedArtist(homeData)
  const visitSectionData = transformVisitSection(homeData, space)

  const formatHeroImage = (
    heroImage: Happening['heroImage'],
  ): { url: string; alt?: string } | string | null => {
    if (typeof heroImage === 'object' && heroImage) {
      const url = resolveMediaUrl(heroImage)
      if (!url) return null
      return {
        url,
        alt: heroImage.alt || undefined,
      }
    }

    return (heroImage as string | null) || null
  }

  const formattedCurrentHappening: FormattedHappening | undefined = displayHappening
    ? {
        ...displayHappening,
        heroImage: formatHeroImage(displayHappening.heroImage),
        featured: displayHappening.featured ?? false,
        isActive: displayHappening.isActive ?? false,
      }
    : undefined

  // Extract structured hours for open/closed calculation
  const structuredHours = space?.structuredHours?.map((h: { day: string; open: string; close: string }) => ({
    day: h.day,
    open: h.open,
    close: h.close,
  })) || null

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
      heroVideoUrl={homeData?.heroVideoUrl}
      structuredHours={structuredHours}
      isUpNext={isUpNext}
    />
  )
}
