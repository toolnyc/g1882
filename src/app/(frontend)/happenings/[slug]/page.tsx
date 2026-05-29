import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getCachedHappeningBySlug } from '@/utilities/getHappeningBySlug'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { resolveOptimizedUrl } from '@/utilities/resolveOptimizedUrl'
import { CategoryTag } from '@/components/CategoryTag'
import { formatHappeningDateParts } from '@/utilities/dateHelpers'
import { resolveHappeningType } from '@/utilities/happeningTypeHelpers'
import { getEventSchema } from '@/utilities/jsonLd'
import { extractPlainText } from '@/utilities/richTextHelpers'
import type { Artist } from '@/payload-types'
import { WorksMasonryGrid } from '@/components/WorksMasonryGrid'
import type { WorkItem } from '@/components/WorksMasonryGrid'

import { draftMode } from 'next/headers'

export const revalidate = false

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function HappeningPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const { isEnabled: draft } = await draftMode()
  const happening = await getCachedHappeningBySlug(slug, draft)()

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

  // Resolve all artists from the artists array field
  const artists: Artist[] = (happening.artists || [])
    .map((a) => (typeof a === 'object' && a ? (a as Artist) : null))
    .filter(Boolean) as Artist[]

  // Collect works from all artists that are tagged with this happening
  const exhibitionWorks: WorkItem[] = artists.flatMap((artist) => {
    const works = artist.works || []
    return works.filter((work) => {
      const taggedHappenings = work.happenings || []
      return taggedHappenings.some((h) => {
        const happeningId = typeof h === 'object' && h ? h.id : h
        return happeningId === happening.id
      })
    })
  })

  const happeningType = resolveHappeningType(happening.type)
  const typeLabel = happeningType?.name || null
  const dateDisplayMode = happeningType?.dateDisplayMode || 'datetime'

  const heroUrl = resolveOptimizedUrl(heroImage, 1400)
  const hasHeroImage = heroImage && heroUrl

  const dateParts = formatHappeningDateParts(
    happening.startDate,
    happening.endDate,
    dateDisplayMode,
  )

  return (
    <main className="min-h-screen bg-off-white">
      <article className={`pb-24${hasHeroImage ? ' pt-40' : ' pt-48'}`}>
        {/* Hero Image - full aspect ratio */}
        {hasHeroImage && (
          <div className="mb-16">
            <div className="w-full overflow-hidden flex items-center justify-center">
              <div className="relative overflow-hidden group">
                <Image
                  src={heroUrl}
                  alt={heroImage.alt || happening.title || ''}
                  width={heroImage.width || 1920}
                  height={heroImage.height || 1080}
                  className="h-auto max-h-[80vh] w-auto max-w-full"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1400px"
                />
                {heroImage.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-off-white text-sm [&_p]:my-0 [&_p]:text-off-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      <RichText data={heroImage.caption} enableGutter={false} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Title and Artists */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-navy mb-4">
                {happening.title}
              </h1>
              {happening.subcaption && (
                <p className="text-xl text-navy/70 mb-4">{happening.subcaption}</p>
              )}
              {artists.length > 0 && (
                <p className="text-lg text-bright-lake leading-relaxed">
                  {artists.map((artist, i) => (
                    <React.Fragment key={artist.id}>
                      {i > 0 && ', '}
                      {artist.slug ? (
                        <Link
                          href={`/artists/${artist.slug}`}
                          className="font-semibold hover:text-lake transition-colors"
                        >
                          {artist.name}
                        </Link>
                      ) : (
                        <span className="font-semibold">
                          {artist.name}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              )}
            </div>

            {/* Date Display */}
            {dateParts.date && (
              <div className="mb-8 pb-8 border-b border-navy/20">
                <span className="text-lg text-navy">{dateParts.date}</span>
                {dateParts.endDate && (
                  <span className="text-lg text-navy">{` \u2013 ${dateParts.endDate}`}</span>
                )}
                {dateParts.time && (
                  <span className="text-base text-navy/60 ml-2">{dateParts.time}</span>
                )}
              </div>
            )}

            {/* Type Tag */}
            {typeLabel && (
              <div className="mb-8">
                <CategoryTag category={typeLabel} />
              </div>
            )}

            {/* Description */}
            {happening.description && (
              <div className="mb-6">
                <RichText data={happening.description} enableGutter={false} className="prose-p:my-2 prose-p:text-base" />
              </div>
            )}

            {/* Exhibition Works */}
            {exhibitionWorks.length > 0 && (
              <div className="mt-12 pt-8 border-t border-navy/20">
                <h2 className="text-2xl font-bold text-navy mb-6">Works</h2>
                <WorksMasonryGrid
                  works={exhibitionWorks}
                  fallbackAlt={happening.title || ''}
                />
              </div>
            )}

            {/* Contact Info */}
            {happening.contactInfo && (
              <div className="mt-12 pt-8 border-t border-navy/20">
                <RichText data={happening.contactInfo} enableGutter={false} className="prose-p:my-2 prose-p:text-base" />
              </div>
            )}


          </div>
        </div>
      </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getEventSchema(happening)),
          }}
        />
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const happening = await getCachedHappeningBySlug(slug)()

  if (!happening) {
    return {
      title: 'Happening not found',
    }
  }

  return generateMeta({
    collection: 'happenings',
    doc: {
      ...happening,
      meta: {
        title: happening.title || undefined,
        description: extractPlainText(happening.description) || undefined,
        image:
          typeof happening.heroImage === 'object' && happening.heroImage
            ? happening.heroImage
            : undefined,
      },
    },
  })
}
