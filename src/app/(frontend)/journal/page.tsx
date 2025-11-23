import type { Metadata } from 'next/types'

import { DirectoryListing } from '@/components/DirectoryListing'
import { getCachedPosts } from '@/utilities/getPosts'
import { FeatureBanner } from '@/components/FeatureBanner'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Media, Post } from '@/payload-types'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const getPosts = getCachedPosts(1)
  const allPosts = await getPosts()

  // Sort posts by publishedAt date (newest first)
  const sortedPosts = [...allPosts].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt as string).getTime() : 0
    const dateB = b.publishedAt ? new Date(b.publishedAt as string).getTime() : 0
    return dateB - dateA
  })

  // Get the most recent post for the banner (published within last 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentPost = sortedPosts.find((post) => {
    if (!post.publishedAt) return false
    const publishedDate = new Date(post.publishedAt as string)
    return publishedDate >= thirtyDaysAgo
  })

  let recentBanner = null

  if (recentPost) {
    const postImage =
      typeof recentPost.heroImage === 'object' && recentPost.heroImage
        ? (recentPost.heroImage as Media)
        : null
    const imageUrl = postImage?.url
      ? getMediaUrl(postImage.url, postImage.updatedAt)
      : '/media/test-art.jpg'

    const formatDate = (dateString: string | Date) => {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }

    const publishedDate = recentPost.publishedAt
      ? formatDate(recentPost.publishedAt as string)
      : ''

    recentBanner = (
      <FeatureBanner
        image={imageUrl}
        imageAlt={recentPost.title || 'Recent Post'}
        title={recentPost.title || 'Recent Post'}
        description={publishedDate}
        label="Recently Posted"
        href={recentPost.slug ? `/journal/${recentPost.slug}` : null}
        showLiveIndicator={false}
      />
    )
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-off-white">
      <PageClient />
      <DirectoryListing
        items={sortedPosts.map((post) => {
          const publishedDate = post.publishedAt
            ? formatDate(post.publishedAt as string)
            : ''

          return {
            ...post,
            name: post.title || '',
            displayName: post.title || '',
            groupKey: post.publishedAt
              ? new Date(post.publishedAt as string).getFullYear().toString()
              : 'Unknown',
            subtitle: publishedDate,
            href: post.slug ? `/journal/${post.slug}` : null,
            publishedAt: post.publishedAt,
          }
        })}
        title="Journal"
        groupBy="chronological"
        banner={recentBanner}
      />
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Journal`,
  }
}

