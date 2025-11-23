import type { Metadata } from 'next'
import Image from 'next/image'
import React from 'react'
import { getCachedArtistBySlug } from '@/utilities/getArtistBySlug'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { generateMeta } from '@/utilities/generateMeta'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

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

  // Get happenings featuring this artist
  const getHappenings = getCachedHappenings({})
  const allHappenings = await getHappenings()
  const relatedHappenings = allHappenings.filter((happening) => {
    const featuredPerson =
      typeof happening.featuredPerson === 'object' && happening.featuredPerson
        ? happening.featuredPerson
        : null
    return featuredPerson?.id === artist.id || happening.featuredPersonName === artist.name
  })

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
              <div className="mb-12">
                <p className="text-lg leading-relaxed text-navy/80 whitespace-pre-line">
                  {artist.bio}
                </p>
              </div>
            )}

            {/* Related Happenings */}
            {relatedHappenings.length > 0 && (
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
            )}
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
