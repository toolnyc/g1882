import React from 'react'

import { DirectoryListing } from '@/components/DirectoryListing'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { FeatureBanner } from '@/components/FeatureBanner'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { formatHappeningDate } from '@/utilities/dateHelpers'
import { resolveHappeningType } from '@/utilities/happeningTypeHelpers'
import type { Artist, Happening } from '@/payload-types'

const getArtistNames = (happening: Happening): string => {
  if (happening.artists && happening.artists.length > 0) {
    return happening.artists
      .map((a) => {
        if (typeof a === 'object' && (a as Artist)?.name) return (a as Artist).name
        return null
      })
      .filter(Boolean)
      .join(', ')
  }
  if (typeof happening.featuredPerson === 'object' && happening.featuredPerson?.name) {
    return happening.featuredPerson.name
  }
  return happening.featuredPersonName || ''
}

export default async function HappeningsPage() {
  // Fetch with depth 2 to populate heroImage, artists, featuredPerson, and type relations
  const getHappenings = getCachedHappenings({}, 2)
  const allHappenings = await getHappenings()

  const now = new Date()
  const oneMonthFromNow = new Date(now)
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

  // Featured happenings: featured: true AND startDate within current month
  const featuredHappenings = allHappenings.filter((happening) => {
    if (!happening.featured || !happening.startDate) return false
    const startDate = new Date(happening.startDate as string)
    return startDate >= now && startDate <= oneMonthFromNow
  })

  // Upcoming events: startDate in future, not in featured section — sorted ascending
  const upcomingHappenings = allHappenings
    .filter((happening) => {
      if (!happening.startDate) return false
      const startDate = new Date(happening.startDate as string)
      if (startDate <= now) return false
      return !featuredHappenings.some((f) => f.id === happening.id)
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate as string).getTime()
      const dateB = new Date(b.startDate as string).getTime()
      return dateA - dateB
    })

  // All happenings for timeline (upcoming ascending first, then past descending)
  const futureHappenings = allHappenings
    .filter((h) => h.startDate && new Date(h.startDate as string) > now)
    .sort((a, b) => new Date(a.startDate as string).getTime() - new Date(b.startDate as string).getTime())

  const pastHappenings = allHappenings
    .filter((h) => h.startDate && new Date(h.startDate as string) <= now)
    .sort((a, b) => new Date(b.startDate as string).getTime() - new Date(a.startDate as string).getTime())

  const timelineHappenings = [...futureHappenings, ...pastHappenings]

  // Get the most upcoming happening for the banner
  const upcomingBannerHappening = upcomingHappenings.length > 0 ? upcomingHappenings[0] : null
  let upcomingBanner = null

  if (upcomingBannerHappening) {
    const imageUrl = resolveMediaUrl(upcomingBannerHappening.heroImage)
    const personName = getArtistNames(upcomingBannerHappening)
    const bannerType = resolveHappeningType(upcomingBannerHappening.type)
    const dateSubtitle = formatHappeningDate(
      upcomingBannerHappening.startDate,
      upcomingBannerHappening.endDate,
      bannerType?.dateDisplayMode || 'datetime',
    )

    upcomingBanner = (
      <FeatureBanner
        image={imageUrl}
        imageAlt={upcomingBannerHappening.title || 'Upcoming Event'}
        title={upcomingBannerHappening.title || 'Upcoming Event'}
        subtitle={personName || undefined}
        description={dateSubtitle || undefined}
        label="Coming Up"
        href={`/happenings/${upcomingBannerHappening.slug || upcomingBannerHappening.id}`}
        showLiveIndicator={false}
        category={bannerType?.name || upcomingBannerHappening.category || undefined}
      />
    )
  }

  return (
    <main className="bg-off-white">
      {/* Timeline View */}
      <DirectoryListing
        items={timelineHappenings.map((happening) => {
          const happeningType = resolveHappeningType(happening.type)
          const dateDisplayMode = happeningType?.dateDisplayMode || 'datetime'
          const subtitle = formatHappeningDate(
            happening.startDate,
            happening.endDate,
            dateDisplayMode,
          )
          const personName = getArtistNames(happening)
          const fullSubtitle =
            personName && subtitle ? `${subtitle} \u2022 ${personName}` : subtitle || personName || ''

          return {
            ...happening,
            name: happening.title || '',
            displayName: happening.title || '',
            groupKey: happening.startDate
              ? new Date(happening.startDate as string).getFullYear().toString()
              : 'Unknown',
            subtitle: fullSubtitle,
            href: `/happenings/${happening.slug || happening.id}`,
            featuredPersonName: personName,
            category: happeningType?.name || happening.category || null,
          }
        })}
        title="Happenings"
        groupBy="chronological"
        banner={upcomingBanner}
      />
    </main>
  )
}
