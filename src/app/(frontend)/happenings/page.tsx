import type { Metadata } from 'next'
import React from 'react'

import { DirectoryListing } from '@/components/DirectoryListing'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: '/happenings',
    },
    title: 'Happenings',
    description:
      'Explore exhibitions, workshops, and events at Gallery 1882 in Chesterton, Indiana.',
  }
}

import { getCachedHappenings } from '@/utilities/getHappenings'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { formatHappeningDateParts } from '@/utilities/dateHelpers'
import { resolveHappeningType } from '@/utilities/happeningTypeHelpers'
import type { Artist, Happening, SiteSetting } from '@/payload-types'

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
  return ''
}

export default async function HappeningsPage() {
  const [siteSettings, allHappenings] = await Promise.all([
    getCachedGlobal('site-settings', 0)() as Promise<SiteSetting>,
    getCachedHappenings({}, 2)(),
  ])
  const showSearch = siteSettings?.search?.happeningsShowSearch !== false

  const now = new Date()

  // All happenings for timeline (upcoming ascending first, then past descending)
  const futureHappenings = allHappenings
    .filter((h) => h.startDate && new Date(h.startDate as string) > now)
    .sort((a, b) => new Date(a.startDate as string).getTime() - new Date(b.startDate as string).getTime())

  const pastHappenings = allHappenings
    .filter((h) => h.startDate && new Date(h.startDate as string) <= now)
    .sort((a, b) => new Date(b.startDate as string).getTime() - new Date(a.startDate as string).getTime())

  const timelineHappenings = [...futureHappenings, ...pastHappenings]

  return (
    <main className="bg-off-white">
      {/* Timeline View */}
      <DirectoryListing
        showSearch={showSearch}
        items={timelineHappenings.map((happening) => {
          const happeningType = resolveHappeningType(happening.type)
          const dateDisplayMode = happeningType?.dateDisplayMode || 'datetime'
          const dateParts = formatHappeningDateParts(
            happening.startDate,
            happening.endDate,
            dateDisplayMode,
          )
          const personName = getArtistNames(happening)

          return {
            ...happening,
            name: happening.title || '',
            displayName: happening.title || '',
            groupKey: happening.startDate
              ? new Date(happening.startDate as string).getFullYear().toString()
              : 'Unknown',
            dateParts,
            subtitle: personName || undefined,
            href: `/happenings/${happening.slug || happening.id}`,
            category: happeningType?.name || null,
          }
        })}
        title={siteSettings?.pageTitles?.happenings || 'Happenings'}
        groupBy="chronological"
      />
    </main>
  )
}
