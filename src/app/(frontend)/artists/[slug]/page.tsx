import type { Metadata } from 'next'
import Image from 'next/image'
import React, { Suspense } from 'react'
import { getCachedArtistBySlug } from '@/utilities/getArtistBySlug'
import { generateMeta } from '@/utilities/generateMeta'
import { RelatedHappenings } from './RelatedHappenings'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'

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

  const artistImage = typeof artist.image === 'object' && artist.image ? artist.image : null
  const works = artist.works || []
  const socialLinks = artist.socialLinks || []

  return (
    <main className="min-h-screen bg-off-white">
      <article className="pt-48 pb-24">
        {/* Hero Image — optional, graceful layout without */}
        {artistImage && typeof artistImage === 'object' && artistImage.url && (
          <div className="relative w-full h-[60vh] min-h-[400px] mb-16">
            <Image
              src={artistImage.url}
              alt={artistImage.alt || artist.name || ''}
              fill
              className="object-contain"
              priority
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
                <p className="text-base leading-relaxed text-navy/80 whitespace-pre-line">
                  {artist.bio}
                </p>
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

            {/* Works Gallery */}
            {works.length > 0 && (
              <div className="mt-12 pt-8 border-t border-navy/20">
                <h2 className="text-2xl font-bold text-navy mb-6">Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {works.map((work) => {
                    const imageUrl = resolveMediaUrl(work.image)
                    if (!imageUrl) return null

                    return (
                      <div key={work.id} className="group">
                        <div className="aspect-square relative overflow-hidden rounded-lg bg-navy/5">
                          <Image
                            src={imageUrl}
                            alt={work.title || work.caption || artist.name || ''}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Hover overlay with caption reveal */}
                          {(work.title || work.caption) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                              <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                                {work.title && (
                                  <p className="text-off-white text-sm font-semibold">{work.title}</p>
                                )}
                                {work.caption && (
                                  <p className="text-off-white/80 text-xs mt-0.5">{work.caption}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {(work.title || work.caption) && (
                          <div className="mt-3">
                            {work.title && (
                              <p className="font-semibold text-navy text-sm">{work.title}</p>
                            )}
                            {work.caption && (
                              <p className="text-navy/60 text-sm">{work.caption}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Related Happenings */}
            <Suspense
              fallback={
                <div className="mt-12 pt-8 border-t border-navy/20">
                  <div className="h-8 bg-navy/20 animate-pulse rounded w-48 mb-6" />
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="p-4 border border-navy/20 rounded-lg bg-navy/5 animate-pulse"
                      >
                        <div className="h-6 bg-navy/20 animate-pulse rounded w-3/4 mb-2" />
                        <div className="h-4 bg-navy/10 animate-pulse rounded w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <RelatedHappenings artistId={artist.id} artistName={artist.name} />
            </Suspense>
          </div>
        </div>
      </article>
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
    doc: {
      ...artist,
      meta: {
        title: artist.name || undefined,
        description: artist.bio || undefined,
        image: typeof artist.image === 'object' && artist.image ? artist.image : undefined,
      },
    },
  })
}
