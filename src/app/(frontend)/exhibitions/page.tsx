import React from 'react'
import { DirectoryListing } from '@/components/DirectoryListing'
import { CurrentExhibitionBanner } from '@/components/CurrentExhibitionBanner'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { formatDateRange } from '@/utilities/dateHelpers'
import type { Happening, Media } from '@/payload-types'

export default async function ExhibitionsPage() {
  // Fetch with depth 2 to populate heroImage relation
  const happenings = await getCachedHappenings({}, 2)()

  // Find the most recent happening
  const mostRecentHappening = [...happenings].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  )[0]

  // Map happenings to DirectoryListing format
  const exhibitionItems = happenings.map((happening) => {
    const imageUrl = resolveMediaUrl(happening.heroImage, '/media/test-art.jpg')
    const subtitle = formatDateRange(happening.startDate, happening.endDate)

    // Get artist name
    const artistName =
      typeof happening.featuredPerson === 'object' && happening.featuredPerson
        ? (happening.featuredPerson as { name: string }).name
        : happening.featuredPersonName || ''

    return {
      id: happening.id,
      slug: happening.slug,
      name: happening.title,
      title: happening.title,
      groupKey: happening.startDate
        ? new Date(happening.startDate).getFullYear().toString()
        : 'Unknown',
      displayName: happening.title,
      subtitle,
      artist: artistName,
      startDate: happening.startDate,
      endDate: happening.endDate || '',
      description: happening.description ? JSON.stringify(happening.description) : '',
      image: imageUrl,
      featured: happening.featured || false,
      href: `/happenings/${happening.slug}`,
      category: happening.category || null,
    }
  })

  // Format most recent happening for banner
  const mostRecentExhibitionData = mostRecentHappening
    ? {
        id: mostRecentHappening.id,
        title: mostRecentHappening.title,
        artist:
          typeof mostRecentHappening.featuredPerson === 'object' &&
          mostRecentHappening.featuredPerson
            ? (mostRecentHappening.featuredPerson as { name: string }).name
            : mostRecentHappening.featuredPersonName || '',
        startDate: mostRecentHappening.startDate,
        endDate: mostRecentHappening.endDate || '',
        description: mostRecentHappening.description
          ? JSON.stringify(mostRecentHappening.description)
          : '',
        image: resolveMediaUrl(mostRecentHappening.heroImage, '/media/test-art.jpg'),
        featured: mostRecentHappening.featured || false,
        category: mostRecentHappening.category || null,
      }
    : null

  return (
    <main className="min-h-screen bg-off-white">
      <DirectoryListing
        items={exhibitionItems}
        title="Exhibitions"
        groupBy="chronological"
        banner={
          mostRecentExhibitionData ? (
            <CurrentExhibitionBanner exhibition={mostRecentExhibitionData} />
          ) : undefined
        }
      />
    </main>
  )
}
