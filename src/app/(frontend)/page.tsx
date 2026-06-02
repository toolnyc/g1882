import type { Metadata } from 'next'
import React from 'react'

import { HomePageClient } from '@/components/HomePage/HomePageClient'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { draftMode } from 'next/headers'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: '/',
    },
    title: {
      absolute: 'Gallery 1882 — Contemporary Art in Chesterton, IN',
    },
    description:
      'Gallery 1882 is a contemporary art gallery in Chesterton, Indiana featuring rotating exhibitions, artist residencies, and community events.',
  }
}

import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { transformFeaturedArtist, transformVisitSection } from '@/utilities/dataTransformers'
import { isDateRangeType } from '@/utilities/happeningTypeHelpers'
import type { Happening, Home, SiteSetting } from '@/payload-types'

type FormattedHappening = Omit<Happening, 'heroImage'> & {
  heroImage: { url: string; alt?: string; caption?: Record<string, unknown> | null } | string | null
  featured: boolean
  isActive: boolean
}

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  // Fetch all data in parallel — these are independent queries
  const [homeData, allHappenings, siteSettings] = await Promise.all([
    getCachedGlobal('home', 2, draft)() as Promise<Home>,
    // Fetch all published happenings once at depth 2 (populates artists, images, and type),
    // then filter in memory. This consolidates what was previously 3 separate DB queries into 1.
    getCachedHappenings({}, 2, undefined, draft)(),
    // SiteSettings contains gallery info (name, description, hours, etc.) used by the visit section
    getCachedGlobal('site-settings', 0, draft)() as Promise<SiteSetting>,
  ])

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

  // Get upcoming happenings: include active ones and those that haven't ended yet
  const upcomingHappenings = allHappenings
    .filter((h) => {
      if (!h.startDate) return false
      if (h.isActive) return true
      const endDate = h.endDate ? new Date(h.endDate as string) : null
      if (endDate) return endDate > now
      return new Date(h.startDate as string) > now
    })
    .sort((a, b) => new Date(a.startDate as string).getTime() - new Date(b.startDate as string).getTime())

  const featuredArtistData = transformFeaturedArtist(homeData)
  const visitSectionData = transformVisitSection(homeData, siteSettings)

  const formatHeroImage = (
    heroImage: Happening['heroImage'],
  ): { url: string; alt?: string; caption?: Record<string, unknown> | null } | string | null => {
    if (typeof heroImage === 'object' && heroImage) {
      const url = resolveMediaUrl(heroImage)
      if (!url) return null
      return {
        url,
        alt: heroImage.alt || undefined,
        caption: (heroImage.caption as Record<string, unknown> | null) || null,
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
      heroVideoUrl={resolveMediaUrl(homeData?.heroVideo) || null}
      heroVideoMobileUrl={resolveMediaUrl(homeData?.heroVideoMobile) || null}
      heroVideoPosterUrl={resolveMediaUrl(homeData?.heroVideoPoster) || null}
      isUpNext={isUpNext}
      siteSettings={siteSettings}
    />
  )
}
