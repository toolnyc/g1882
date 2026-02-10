import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getCachedHappeningBySlug } from '@/utilities/getHappeningBySlug'
import RichText from '@/components/RichText'
import { getServerSideURL } from '@/utilities/getURL'
import { generateMeta } from '@/utilities/generateMeta'
import { CalendarButton } from './CalendarButton'
import { CategoryTag } from '@/components/CategoryTag'
import type { Artist } from '@/payload-types'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function HappeningPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const getHappening = getCachedHappeningBySlug(slug)
  const happening = await getHappening()

  if (!happening) {
    return (
      <main className="min-h-screen bg-off-white">
        <div className="container py-32">
          <h1 className="text-4xl font-bold">Happening not found</h1>
        </div>
      </main>
    )
  }

  const heroImage =
    typeof happening.heroImage === 'object' && happening.heroImage ? happening.heroImage : null

  // Resolve all artists from the new array field
  const artists: Artist[] = (happening.artists || [])
    .map((a) => (typeof a === 'object' && a ? (a as Artist) : null))
    .filter(Boolean) as Artist[]

  // Fall back to legacy featuredPerson
  if (artists.length === 0) {
    const featuredPerson =
      typeof happening.featuredPerson === 'object' && happening.featuredPerson
        ? happening.featuredPerson
        : null
    if (featuredPerson) {
      artists.push(featuredPerson as Artist)
    }
  }

  const legacyPersonName =
    artists.length === 0 ? (happening.featuredPersonName || '') : ''

  const startDate = happening.startDate ? new Date(happening.startDate as string) : null
  const endDate = happening.endDate ? new Date(happening.endDate as string) : null

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const typeLabel = happening.type === 'exhibition' ? 'Exhibition' : happening.type === 'event' ? 'Event' : null
  const hasHeroImage = heroImage && typeof heroImage === 'object' && heroImage.url
  const isEvent = happening.type === 'event'

  // For events on the same day, show a compact single-line date with time range
  const isSameDay =
    startDate && endDate &&
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()

  return (
    <main className="min-h-screen bg-off-white">
      <article className={`pb-24${hasHeroImage ? '' : ' pt-48'}`}>
        {/* Hero Image */}
        {hasHeroImage && (
          <div className="relative w-full h-[60vh] min-h-[400px] mb-16">
            <Image
              src={heroImage.url!}
              alt={heroImage.alt || happening.title || ''}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Title and Artists */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-navy mb-4">
                {happening.title}
              </h1>
              {artists.length > 0 && (
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {artists.map((artist, i) => (
                    <React.Fragment key={artist.id}>
                      {i > 0 && <span className="text-2xl text-bright-lake">,</span>}
                      {artist.slug ? (
                        <Link
                          href={`/artists/${artist.slug}`}
                          className="text-2xl text-bright-lake font-semibold hover:text-lake transition-colors"
                        >
                          {artist.name}
                        </Link>
                      ) : (
                        <span className="text-2xl text-bright-lake font-semibold">
                          {artist.name}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
              {legacyPersonName && (
                <p className="text-2xl text-bright-lake font-semibold">{legacyPersonName}</p>
              )}
            </div>

            {/* Date and Time Information */}
            <div className="mb-8 pb-8 border-b border-navy/20">
              {startDate && isEvent && isSameDay ? (
                /* Events on a single day: show date once with time range */
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-semibold text-navy/70 uppercase tracking-wide">
                      Date:
                    </span>
                    <span className="text-lg text-navy">
                      {formatDate(startDate)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-semibold text-navy/70 uppercase tracking-wide">
                      Time:
                    </span>
                    <span className="text-lg text-navy">
                      {formatTime(startDate)}{endDate ? ` \u2013 ${formatTime(endDate)}` : ''}
                    </span>
                  </div>
                </div>
              ) : startDate && isEvent ? (
                /* Events spanning multiple days: show full start and end */
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-semibold text-navy/70 uppercase tracking-wide">
                      Start:
                    </span>
                    <span className="text-lg text-navy">
                      {formatDate(startDate)} at {formatTime(startDate)}
                    </span>
                  </div>
                  {endDate && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-semibold text-navy/70 uppercase tracking-wide">
                        End:
                      </span>
                      <span className="text-lg text-navy">
                        {formatDate(endDate)} at {formatTime(endDate)}
                      </span>
                    </div>
                  )}
                </div>
              ) : startDate ? (
                /* Exhibitions: show date range */
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-semibold text-navy/70 uppercase tracking-wide">
                      Opens:
                    </span>
                    <span className="text-lg text-navy">
                      {formatDate(startDate)}
                    </span>
                  </div>
                  {endDate && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-semibold text-navy/70 uppercase tracking-wide">
                        Closes:
                      </span>
                      <span className="text-lg text-navy">
                        {formatDate(endDate)}
                      </span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Type / Category Tag */}
            {(typeLabel || happening.category) && (
              <div className="mb-8">
                <CategoryTag category={typeLabel || happening.category!} />
              </div>
            )}

            {/* Description */}
            {happening.description && (
              <div className="mb-6">
                <RichText data={happening.description} className="prose-p:my-2 prose-p:text-base" />
              </div>
            )}

            {/* Calendar Button */}
            {startDate && (
              <div className="mt-12 pt-8 border-t border-navy/20">
                <CalendarButton
                  happening={{
                    title: happening.title || '',
                    description: (() => {
                      if (typeof happening.description === 'string') {
                        return happening.description
                      }
                      if (
                        typeof happening.description === 'object' &&
                        happening.description?.root
                      ) {
                        const extractText = (node: { type?: string; text?: string; children?: unknown[] }): string => {
                          if (node.type === 'text') return node.text || ''
                          if (node.children) {
                            return node.children.map((child) => extractText(child as { type?: string; text?: string; children?: unknown[] })).join(' ')
                          }
                          return ''
                        }
                        return extractText(happening.description.root) || ''
                      }
                      return ''
                    })(),
                    startDate,
                    endDate: endDate || undefined,
                    url: `${getServerSideURL()}/happenings/${slug}`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const getHappening = getCachedHappeningBySlug(slug)
  const happening = await getHappening()

  if (!happening) {
    return {
      title: 'Happening not found',
    }
  }

  return generateMeta({
    doc: {
      ...happening,
      meta: {
        title: happening.title || undefined,
        description:
          typeof happening.description === 'object'
            ? JSON.stringify(happening.description)
            : happening.description || undefined,
        image:
          typeof happening.heroImage === 'object' && happening.heroImage
            ? happening.heroImage
            : undefined,
      },
    },
  })
}
