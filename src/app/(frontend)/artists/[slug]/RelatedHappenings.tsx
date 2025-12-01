import React from 'react'
import Link from 'next/link'
import { getCachedHappenings } from '@/utilities/getHappenings'

type RelatedHappeningsProps = {
  artistId: string
  artistName: string | null
}

export async function RelatedHappenings({ artistId, artistName }: RelatedHappeningsProps) {
  const getHappenings = getCachedHappenings({})
  const allHappenings = await getHappenings()
  const relatedHappenings = allHappenings.filter((happening) => {
    const featuredPerson =
      typeof happening.featuredPerson === 'object' && happening.featuredPerson
        ? happening.featuredPerson
        : null
    return featuredPerson?.id === artistId || happening.featuredPersonName === artistName
  })

  if (relatedHappenings.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-navy/20">
      <h2 className="text-2xl font-bold text-navy mb-6">Related Happenings</h2>
      <div className="space-y-4">
        {relatedHappenings.map((happening) => (
          <Link
            key={happening.id}
            href={`/happenings/${happening.slug}`}
            className="block p-4 border border-navy/20 rounded-lg hover:border-bright-lake transition-colors"
          >
            <h3 className="text-xl font-semibold text-navy mb-2">{happening.title}</h3>
            {happening.startDate && (
              <p className="text-sm text-navy/70">
                {new Date(happening.startDate as string).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}


