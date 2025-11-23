import React from 'react'
import { DirectoryListing } from '@/components/DirectoryListing'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { FeaturedHappenings } from '@/components/FeaturedHappenings'
import { UpcomingHappenings } from '@/components/UpcomingHappenings'
import { FeatureBanner } from '@/components/FeatureBanner'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Media } from '@/payload-types'

export default async function HappeningsPage() {
  const getHappenings = getCachedHappenings({})
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

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getHappeningSubtitle = (happening: any) => {
    if (!happening.startDate) return ''
    const startDate = formatDate(happening.startDate)
    if (happening.endDate) {
      const endDate = formatDate(happening.endDate)
      return `${startDate} - ${endDate}`
    }
    return startDate
  }

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
    const happeningImage =
      typeof upcomingBannerHappening.heroImage === 'object' && upcomingBannerHappening.heroImage
        ? (upcomingBannerHappening.heroImage as Media)
        : null
    const imageUrl = happeningImage?.url
      ? getMediaUrl(happeningImage.url, happeningImage.updatedAt)
      : '/media/test-space.jpg'

    const personName = getFeaturedPersonName(upcomingBannerHappening)
    const dateSubtitle = getHappeningSubtitle(upcomingBannerHappening)

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
    <main className="min-h-screen bg-off-white">
      {/* Timeline View */}
      <DirectoryListing
        items={timelineHappenings.map((happening) => {
          const subtitle = getHappeningSubtitle(happening)
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
