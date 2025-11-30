import React from 'react'
import { DirectoryListing } from '@/components/DirectoryListing'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { FeaturedHappenings } from '@/components/FeaturedHappenings'
import { UpcomingHappenings } from '@/components/UpcomingHappenings'
import { FeatureBanner } from '@/components/FeatureBanner'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { formatDate, formatDateRange } from '@/utilities/dateHelpers'

export default async function HappeningsPage() {
  // Fetch with depth 2 to populate heroImage and featuredPerson.image relations
  const getHappenings = getCachedHappenings({}, 2)
  const allHappenings = await getHappenings()

  const now = new Date()
  const oneWeekFromNow = new Date(now)
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
  const oneMonthFromNow = new Date(now)
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

  // Featured happenings: featured: true AND startDate within current week/month
  const featuredHappenings = allHappenings.filter((happening) => {
    if (!happening.featured || !happening.startDate) return false
    const startDate = new Date(happening.startDate as string)
    return startDate >= now && startDate <= oneMonthFromNow
  })

  // Upcoming events: startDate in future, not in featured section
  const upcomingHappenings = allHappenings.filter((happening) => {
    if (!happening.startDate) return false
    const startDate = new Date(happening.startDate as string)
    if (startDate <= now) return false
    // Exclude featured happenings
    return !featuredHappenings.some((f) => f.id === happening.id)
  })

  // All happenings for timeline (sorted by startDate descending)
  const timelineHappenings = [...allHappenings].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate as string).getTime() : 0
    const dateB = b.startDate ? new Date(b.startDate as string).getTime() : 0
    return dateB - dateA
  })

  const getFeaturedPersonName = (happening: any) => {
    if (typeof happening.featuredPerson === 'object' && happening.featuredPerson?.name) {
      return happening.featuredPerson.name
    }
    return happening.featuredPersonName || ''
  }

  // Get the most upcoming happening for the banner
  const upcomingBannerHappening = upcomingHappenings.length > 0 ? upcomingHappenings[0] : null
  let upcomingBanner = null

  if (upcomingBannerHappening) {
    const imageUrl = resolveMediaUrl(upcomingBannerHappening.heroImage, '/media/test-space.jpg')
    const personName = getFeaturedPersonName(upcomingBannerHappening)
    const dateSubtitle = formatDateRange(
      upcomingBannerHappening.startDate,
      upcomingBannerHappening.endDate,
    )

    upcomingBanner = (
      <FeatureBanner
        image={imageUrl}
        imageAlt={upcomingBannerHappening.title || 'Upcoming Event'}
        title={upcomingBannerHappening.title || 'Upcoming Event'}
        subtitle={personName || undefined}
        description={dateSubtitle || undefined}
        label="Coming Up"
        href={upcomingBannerHappening.slug ? `/happenings/${upcomingBannerHappening.slug}` : null}
        showLiveIndicator={false}
        category={upcomingBannerHappening.category || undefined}
      />
    )
  }

  return (
    <main className="bg-off-white">
      {/* Timeline View */}
      <DirectoryListing
        items={timelineHappenings.map((happening) => {
          const subtitle = formatDateRange(happening.startDate, happening.endDate)
          const personName = getFeaturedPersonName(happening)
          const fullSubtitle =
            personName && subtitle ? `${subtitle} • ${personName}` : subtitle || personName || ''

          return {
            ...happening,
            name: happening.title || '',
            displayName: happening.title || '',
            groupKey: happening.startDate
              ? new Date(happening.startDate as string).getFullYear().toString()
              : 'Unknown',
            subtitle: fullSubtitle,
            href: happening.slug ? `/happenings/${happening.slug}` : null,
            featuredPersonName: personName,
            category: happening.category || null,
          }
        })}
        title="Happenings"
        groupBy="chronological"
        banner={upcomingBanner}
      />
    </main>
  )
}
