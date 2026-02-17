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
import { formatHappeningDate } from '@/utilities/dateHelpers'
import { resolveHappeningType } from '@/utilities/happeningTypeHelpers'
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

  const happeningType = resolveHappeningType(happening.type)
  const typeLabel = happeningType?.name || null
  const dateDisplayMode = happeningType?.dateDisplayMode || 'datetime'

  const hasHeroImage = heroImage && typeof heroImage === 'object' && heroImage.url

  const dateDisplay = formatHappeningDate(
    happening.startDate,
    happening.endDate,
    dateDisplayMode,
  )

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

            {/* Date Display */}
            {dateDisplay && (
              <div className="mb-8 pb-8 border-b border-navy/20">
                <span className="text-lg text-navy">{dateDisplay}</span>
              </div>
            )}

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
            {happening.startDate && (
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
                    startDate: new Date(happening.startDate as string),
                    endDate: happening.endDate ? new Date(happening.endDate as string) : undefined,
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
