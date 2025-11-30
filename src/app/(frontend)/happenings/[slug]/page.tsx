import type { Metadata } from 'next'
import Image from 'next/image'
import React, { Suspense } from 'react'
import { getCachedHappeningBySlug } from '@/utilities/getHappeningBySlug'
import RichText from '@/components/RichText'
import { getServerSideURL } from '@/utilities/getURL'
import { generateMeta } from '@/utilities/generateMeta'
import { CalendarButton } from './CalendarButton'
import { CategoryTag } from '@/components/CategoryTag'
import { HappeningDetailSkeleton } from '@/components/SkeletonLoaders'

// Revalidate every 60 seconds
export const revalidate = 60

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const { getHappenings } = await import('@/utilities/getHappenings')
  const happenings = await getHappenings()

  return happenings.map((happening) => ({
    slug: happening.slug || '',
  }))
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

  const featuredPerson =
    typeof happening.featuredPerson === 'object' && happening.featuredPerson
      ? happening.featuredPerson
      : null

  const featuredPersonName = featuredPerson?.name || happening.featuredPersonName || ''

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

  return (
    <main className="min-h-screen bg-off-white">
      <article className="pb-24">
        {/* Hero Image */}
        {heroImage && typeof heroImage === 'object' && heroImage.url && (
          <div className="relative w-full h-[60vh] min-h-[400px] mb-16">
            <Image
              src={heroImage.url}
              alt={heroImage.alt || happening.title || ''}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Title and Featured Person */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-navy mb-4">
                {happening.title}
              </h1>
              {featuredPersonName && (
                <p className="text-2xl text-bright-lake font-semibold">{featuredPersonName}</p>
              )}
            </div>

            {/* Date and Time Information */}
            <div className="mb-8 pb-8 border-b border-navy/20">
              {startDate && (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm font-semibold text-navy/70 uppercase tracking-wide">
                      Start:
                    </span>
                    <span className="text-lg text-navy">
                      {formatDate(startDate)}
                      {startDate && ` at ${formatTime(startDate)}`}
                    </span>
                  </div>
                  {endDate && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-semibold text-navy/70 uppercase tracking-wide">
                        End:
                      </span>
                      <span className="text-lg text-navy">
                        {formatDate(endDate)}
                        {endDate && ` at ${formatTime(endDate)}`}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category */}
            {happening.category && (
              <div className="mb-8">
                <CategoryTag category={happening.category} />
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
                        const extractText = (node: any): string => {
                          if (node.type === 'text') return node.text || ''
                          if (node.children) {
                            return node.children.map(extractText).join(' ')
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
