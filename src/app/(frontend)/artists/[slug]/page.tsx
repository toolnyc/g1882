import type { Metadata } from 'next'
import Image from 'next/image'
import React, { Suspense } from 'react'
import { getCachedArtistBySlug } from '@/utilities/getArtistBySlug'
import { generateMeta } from '@/utilities/generateMeta'
import { getPersonSchema } from '@/utilities/jsonLd'
import { resolveOptimizedUrl } from '@/utilities/resolveOptimizedUrl'
import { RelatedHappenings } from './RelatedHappenings'
import { WorksMasonryGrid } from '@/components/WorksMasonryGrid'
import RichText from '@/components/RichText'
import { extractPlainText } from '@/utilities/richTextHelpers'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug: string
  }>
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'Twitter / X',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  other: 'Link',
}

export default async function ArtistPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const getArtist = getCachedArtistBySlug(slug)
  const artist = await getArtist()

  if (!artist) {
    return (
      <main className="min-h-screen bg-off-white">
        <div className="container py-32">
          <h1 className="text-4xl font-bold">Artist not found</h1>
        </div>
      </main>
    )
  }

  const artistImageObj = typeof artist.image === 'object' && artist.image ? artist.image : null
  const artistImage = resolveOptimizedUrl(artistImageObj, 1400)
  const works = artist.works || []
  const socialLinks = artist.socialLinks || []

  return (
    <main className="min-h-screen bg-off-white">
      <article className="pt-48 pb-24">
        {/* Hero Image — optional, graceful layout without */}
        {artistImage && (
          <div className="w-full max-h-[80vh] overflow-hidden flex items-center mb-16">
            <Image
              src={artistImage}
              alt={artistImageObj?.alt || artist.name || ''}
              width={artistImageObj?.width || 1400}
              height={artistImageObj?.height || 900}
              className="w-full h-auto max-h-[80vh] object-contain"
              priority
              sizes="100vw"
            />
          </div>
        )}

        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Name */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-navy mb-4">
                {artist.name}
              </h1>
            </div>

            {/* Bio */}
            {artist.bio && (
              <div className="mb-6">
                <RichText data={artist.bio} enableGutter={false} className="text-base leading-relaxed text-navy/80" />
              </div>
            )}

            {/* Website & Social Links */}
            {(artist.website || socialLinks.length > 0) && (
              <div className="mb-8 flex flex-wrap gap-4">
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-bright-lake hover:text-lake transition-colors font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Website
                  </a>
                )}
                {socialLinks.map((link) => (
                  <a
                    key={link.id || link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-bright-lake hover:text-lake transition-colors font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {PLATFORM_LABELS[link.platform] || link.platform}
                  </a>
                ))}
              </div>
            )}

            {/* Works Gallery — masonry layout with natural aspect ratios */}
            {works.length > 0 && (
              <div className="mt-12 pt-8 border-t border-navy/20">
                <h2 className="text-2xl font-bold text-navy mb-6">Works</h2>
                <WorksMasonryGrid works={works} fallbackAlt={artist.name || ''} />
              </div>
            )}

            {/* Related Happenings */}
            <Suspense
              fallback={
                <div className="mt-12 pt-8 border-t border-navy/10 animate-skeleton-in">
                  <div className="h-8 bg-navy/10 animate-pulse rounded w-48 mb-6" />
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="p-4 border border-navy/10 rounded-lg bg-navy/[0.03] animate-pulse"
                      >
                        <div className="h-6 bg-navy/10 animate-pulse rounded w-3/4 mb-2" />
                        <div className="h-4 bg-navy/5 animate-pulse rounded w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <RelatedHappenings artistId={artist.id} />
            </Suspense>
          </div>
        </div>
      </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getPersonSchema(artist)),
          }}
        />
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const getArtist = getCachedArtistBySlug(slug)
  const artist = await getArtist()

  if (!artist) {
    return {
      title: 'Artist not found',
    }
  }

  return generateMeta({
    collection: 'artists',
    doc: {
      ...artist,
      meta: {
        title: artist.name || undefined,
        description: extractPlainText(artist.bio) || undefined,
        image: typeof artist.image === 'object' && artist.image ? artist.image : undefined,
      },
    },
  })
}
