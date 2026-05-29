import type { Happening, Post, Artist, Media } from '@/payload-types'
import { getServerSideURL } from './getURL'
import { extractPlainText } from './richTextHelpers'

/**
 * Resolve an absolute image URL from a Media object.
 * Handles both absolute (starting with http) and relative URLs.
 */
const resolveImageUrl = (media: Media | null | undefined): string | undefined => {
  if (!media?.url) return undefined

  if (media.url.startsWith('http://') || media.url.startsWith('https://')) {
    return media.url
  }

  return getServerSideURL() + media.url
}

/**
 * Returns an Organization + LocalBusiness schema for Gallery 1882.
 */
export const getOrganizationSchema = () => {
  const url = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'Gallery 1882',
    description:
      'Gallery 1882 is a contemporary art gallery in Chesterton, Indiana featuring rotating exhibitions, artist residencies, and community events.',
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chesterton',
      addressRegion: 'Indiana',
    },
  }
}

/**
 * Returns an Event schema for a happening.
 */
export const getEventSchema = (happening: Happening) => {
  const url = getServerSideURL()
  const eventUrl = `${url}/happenings/${happening.slug}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: happening.title,
    startDate: happening.startDate,
    location: {
      '@type': 'Place',
      name: 'Gallery 1882',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Chesterton',
        addressRegion: 'Indiana',
      },
    },
    url: eventUrl,
  }

  if (happening.endDate) {
    schema.endDate = happening.endDate
  }

  const description = extractPlainText(happening.description)
  if (description) {
    schema.description = description
  }

  const heroImage =
    typeof happening.heroImage === 'object' && happening.heroImage
      ? happening.heroImage
      : null

  const imageUrl = resolveImageUrl(heroImage)
  if (imageUrl) {
    schema.image = imageUrl
  }

  return schema
}

/**
 * Returns an Article schema for a news post.
 */
export const getArticleSchema = (post: Post) => {
  const url = getServerSideURL()
  const articleUrl = `${url}/news/${post.slug}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    url: articleUrl,
  }

  const description = post.meta?.description
  if (description) {
    schema.description = description
  }

  const heroImage =
    typeof post.heroImage === 'object' && post.heroImage ? post.heroImage : null

  const imageUrl = resolveImageUrl(heroImage)
  if (imageUrl) {
    schema.image = imageUrl
  }

  return schema
}

/**
 * Returns a Person schema for an artist.
 */
export const getPersonSchema = (artist: Artist) => {
  const url = getServerSideURL()
  const artistUrl = `${url}/artists/${artist.slug}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.name,
    url: artistUrl,
  }

  const description = extractPlainText(artist.bio)
  if (description) {
    schema.description = description
  }

  const artistImage =
    typeof artist.image === 'object' && artist.image ? artist.image : null

  const imageUrl = resolveImageUrl(artistImage)
  if (imageUrl) {
    schema.image = imageUrl
  }

  return schema
}
