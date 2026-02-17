import React from 'react'
import Link from 'next/link'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { formatHappeningDate } from '@/utilities/dateHelpers'
import { resolveHappeningType } from '@/utilities/happeningTypeHelpers'
import type { Artist } from '@/payload-types'

type RelatedHappeningsProps = {
  artistId: string
  artistName: string | null
}

export async function RelatedHappenings({ artistId, artistName }: RelatedHappeningsProps) {
  const getHappenings = getCachedHappenings({}, 2)
  const allHappenings = await getHappenings()

  const relatedHappenings = allHappenings.filter((happening) => {
    // Check new artists array
    if (happening.artists && happening.artists.length > 0) {
      const match = happening.artists.some((a) => {
        if (typeof a === 'object' && a) return (a as Artist).id === artistId
        if (typeof a === 'string') return a === artistId
        return false
      })
      if (match) return true
    }
    // Check legacy featuredPerson
    const featuredPerson =
      typeof happening.featuredPerson === 'object' && happening.featuredPerson
        ? happening.featuredPerson
        : null
    if (featuredPerson?.id === artistId) return true
    if (happening.featuredPersonName === artistName) return true
    return false
  })

  if (relatedHappenings.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-navy/20">
      <h2 className="text-2xl font-bold text-navy mb-6">Related Happenings</h2>
      <div className="space-y-4">
        {relatedHappenings.map((happening) => {
          const happeningType = resolveHappeningType(happening.type)
          const dateDisplay = happening.startDate
            ? formatHappeningDate(
                happening.startDate,
                happening.endDate,
                happeningType?.dateDisplayMode || 'datetime',
              )
            : ''

          return (
            <Link
              key={happening.id}
              href={`/happenings/${happening.slug}`}
              className="block p-4 border border-navy/20 rounded-lg hover:border-bright-lake transition-colors"
            >
              <h3 className="text-xl font-semibold text-navy mb-2">{happening.title}</h3>
              <div className="flex items-center gap-3 text-sm text-navy/70">
                {happeningType?.name && (
                  <span className="px-2 py-0.5 bg-lake/10 text-lake rounded text-xs font-medium">
                    {happeningType.name}
                  </span>
                )}
                {dateDisplay && <span>{dateDisplay}</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
