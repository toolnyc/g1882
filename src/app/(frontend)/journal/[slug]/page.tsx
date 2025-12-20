import type { Metadata } from 'next'
import Image from 'next/image'
import React from 'react'
import { getCachedPostBySlug } from '@/utilities/getPostBySlug'
import { generateMeta } from '@/utilities/generateMeta'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import RichText from '@/components/RichText'

// Force dynamic rendering since layout reads headers (draftMode, auth)
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const getPost = getCachedPostBySlug(slug)
  const post = await getPost()

  if (!post) {
    return (
      <main className="min-h-screen bg-off-white">
        <div className="container py-32">
          <h1 className="text-4xl font-bold">Post not found</h1>
        </div>
      </main>
    )
  }

  const postImage = typeof post.heroImage === 'object' && post.heroImage ? post.heroImage : null

  return (
    <main className="min-h-screen bg-off-white">
      <article className="pt-48 pb-24">
        {/* Hero Image */}
        {postImage && typeof postImage === 'object' && postImage.url && (
          <div className="relative w-full h-[60vh] min-h-[400px] mb-16">
            <Image
              src={postImage.url}
              alt={postImage.alt || post.title || ''}
              fill
              className="object-fit-contain"
              objectFit="contain"
              priority
            />
          </div>
        )}

        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-navy mb-4">
                {post.title}
              </h1>
            </div>

            {/* Content */}
            {post.content && (
              <div className="mb-12">
                <RichText data={post.content} enableGutter={false} />
              </div>
            )}

            {/* Related Posts */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-navy/20">
                <h2 className="text-2xl font-bold text-navy mb-6">Related Posts</h2>
                <RelatedPosts
                  docs={post.relatedPosts.filter((post) => typeof post === 'object')}
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
  const getPost = getCachedPostBySlug(slug)
  const post = await getPost()

  if (!post) {
    return {
      title: 'Post not found',
    }
  }

  return generateMeta({
    doc: {
      ...post,
      meta: {
        title: post.title || undefined,
        description: post.meta?.description || undefined,
        image: typeof post.heroImage === 'object' && post.heroImage ? post.heroImage : undefined,
      },
    },
  })
}

