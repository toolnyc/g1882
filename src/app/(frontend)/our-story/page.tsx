import type { Metadata } from 'next'
import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { OurStory as OurStoryType } from '@/payload-types'
import { PhotoCarousel } from './CarouselLoader'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media } from '@/payload-types'

import { draftMode } from 'next/headers'

export const revalidate = false

type PhotoItem = {
  image: Media | string
  caption?: string | null
  id?: string | null
}

export default async function OurStoryPage() {
  const { isEnabled: draft } = await draftMode()
  const ourStory = (await getCachedGlobal('our-story', 1, draft)()) as OurStoryType

  const photos = (ourStory?.photos as PhotoItem[] | undefined) ?? []
  const hasPhotos = photos.length > 0
  const hasStory = ourStory?.story && typeof ourStory.story === 'object'

  if (!hasPhotos && !hasStory) {
    return (
      <main className="min-h-screen bg-off-white">
        <div className="container pt-48 pb-32 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">Our Story</h1>
          <p className="text-navy/60 text-lg">Coming soon.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-off-white">
      {/* Header */}
      <section className="container pt-40 pb-8 md:pt-48 md:pb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy">Our Story</h1>
      </section>

      {/* Photo carousel */}
      {hasPhotos && (
        <section className="container pb-12 md:pb-16">
          <PhotoCarousel photos={photos} />
        </section>
      )}

      {/* Rich text story */}
      {hasStory && (
        <section className="container pb-24 md:pb-32">
          <div className="max-w-3xl">
            <RichText data={ourStory.story as DefaultTypedEditorState} enableGutter={false} />
          </div>
        </section>
      )}
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: '/our-story',
    },
    title: 'Our Story | Gallery 1882',
    description:
      'Learn about Gallery 1882, a contemporary art space in Chesterton, Indiana, dedicated to showcasing emerging and established artists.',
    openGraph: {
      title: 'Our Story | Gallery 1882',
      description:
        'Learn about Gallery 1882, a contemporary art space in Chesterton, Indiana.',
    },
  }
}
