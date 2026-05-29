import type { Metadata } from 'next/types'

import { DirectoryListing } from '@/components/DirectoryListing'
import { getCachedPosts } from '@/utilities/getPosts'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { FeatureBanner } from '@/components/FeatureBanner'
import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { formatDate } from '@/utilities/dateHelpers'
import React from 'react'
import PageClient from './page.client'
import type { SiteSetting } from '@/payload-types'
import { draftMode } from 'next/headers'

export const revalidate = false

export default async function Page() {
  const { isEnabled: draft } = await draftMode()
  const [allPosts, siteSettings] = await Promise.all([
    getCachedPosts(1, draft)(),
    getCachedGlobal('site-settings', 0, draft)() as Promise<SiteSetting>,
  ])

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
    const imageUrl = resolveMediaUrl(recentPost.heroImage, '/media/test-art.jpg')
    const publishedDate = formatDate(recentPost.publishedAt, 'short')

    recentBanner = (
      <FeatureBanner
        image={imageUrl}
        imageAlt={recentPost.title || 'Recent Post'}
        title={recentPost.title || 'Recent Post'}
        description={publishedDate}
        label={siteSettings?.labels?.recentlyPosted || 'Recently Posted'}
        href={recentPost.slug ? `/news/${recentPost.slug}` : null}
        showLiveIndicator={false}
      />
    )
  }

  return (
    <main className="min-h-screen bg-off-white">
      <PageClient />
      <DirectoryListing
        items={sortedPosts.map((post) => {
          const publishedDate = formatDate(post.publishedAt, 'short')

          return {
            ...post,
            name: post.title || '',
            displayName: post.title || '',
            groupKey: post.publishedAt
              ? new Date(post.publishedAt as string).getFullYear().toString()
              : 'Unknown',
            subtitle: publishedDate,
            href: post.slug ? `/news/${post.slug}` : null,
            publishedAt: post.publishedAt,
          }
        })}
        title={siteSettings?.pageTitles?.news || 'News'}
        groupBy="chronological"
        banner={recentBanner}
      />
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: '/news',
    },
    title: 'News',
    description:
      'Latest news, journal entries, and updates from Gallery 1882.',
  }
}

