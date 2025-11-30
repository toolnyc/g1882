import type { Metadata } from 'next'
import Image from 'next/image'
import React, { Suspense } from 'react'
import { getCachedArtistBySlug } from '@/utilities/getArtistBySlug'
import { generateMeta } from '@/utilities/generateMeta'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ArtistDetailSkeleton } from '@/components/SkeletonLoaders'
import { RelatedHappenings } from './RelatedHappenings'

// Revalidate every 60 seconds
export const revalidate = 60

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'artists',
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return result.docs.map((artist) => ({
    slug: artist.slug || '',
  }))
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

  return (
    <main className="min-h-screen bg-off-white">
      <article className="pt-48 pb-24">
        {/* Hero Image */}
        {artistImage && typeof artistImage === 'object' && artistImage.url && (
          <div className="relative w-full h-[60vh] min-h-[400px] mb-16">
            <Image
              src={artistImage.url}
              alt={artistImage.alt || artist.name || ''}
              fill
              className="object-fit-contain"
              objectFit="contain"
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
