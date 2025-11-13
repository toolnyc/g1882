import React from 'react'
import { DirectoryListing } from '@/components/DirectoryListing'
import { CurrentExhibitionBanner } from '@/components/CurrentExhibitionBanner'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Happening, Media } from '@/payload-types'

export default async function ExhibitionsPage() {
  const happenings = await getCachedHappenings({})()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Find the most recent happening
  const mostRecentHappening = [...happenings].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  )[0]

  // Map happenings to DirectoryListing format
  const exhibitionItems = happenings.map((happening) => {
    const heroImage =
      typeof happening.heroImage === 'object' && happening.heroImage
        ? (happening.heroImage as Media)
        : null
    const imageUrl = heroImage?.url
      ? getMediaUrl(heroImage.url, heroImage.updatedAt)
      : '/media/test-art.jpg'

    const startDate = happening.startDate ? formatDate(happening.startDate) : ''
    const endDate = happening.endDate ? formatDate(happening.endDate) : ''
    const subtitle = startDate && endDate ? `${startDate} - ${endDate}` : startDate || ''

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
        image:
          typeof mostRecentHappening.heroImage === 'object' && mostRecentHappening.heroImage
            ? getMediaUrl(
                (mostRecentHappening.heroImage as Media).url,
                (mostRecentHappening.heroImage as Media).updatedAt,
              )
            : '/media/test-art.jpg',
        featured: mostRecentHappening.featured || false,
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
