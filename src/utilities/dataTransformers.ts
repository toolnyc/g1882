import type { Home, Media, Space } from '@/payload-types'

import { resolveArtist, resolveMediaUrl } from './mediaHelpers'
import { resolveOptimizedUrl } from './resolveOptimizedUrl'
import { extractPlainText } from './richTextHelpers'

export interface FeaturedArtistData {
  id: string
  name: string
  bio: string
  image: string
  artistSlug: string
}

export interface VisitSectionData {
  title: string
  description: string
  image: string
  ctaText: string
  ctaUrl: string
}

const getArtistImage = (image: string | Media | null | undefined, override?: string | Media | null) =>
  resolveMediaUrl(override) || resolveMediaUrl(image)

/**
 * Resolves featured artist data from the Home global.
 * Caption label comes from SiteSettings.labels.featuredArtist (passed separately by HomePageClient).
 */
export const transformFeaturedArtist = (
  homeData: Home | null,
): FeaturedArtistData | null => {
  const homeArtist = resolveArtist(homeData?.featuredArtist)
  if (!homeArtist) return null

  return {
    id: homeArtist.id,
    name: homeArtist.name,
    bio: (homeData?.featuredArtistDescription as string) || extractPlainText(homeArtist.bio) || '',
    image: getArtistImage(homeArtist.image, homeData?.featuredArtistImage),
    artistSlug: homeArtist.slug,
  }
}

/**
 * Builds the homepage "Plan Your Visit" promo card.
 *
 * Data flow:
 * - If Home.visitTitle is set → use all Home visit fields (custom promo)
 * - Otherwise → fallback to Space.name + Space.description (venue facts)
 *
 * Visibility is controlled by Home.visitSectionEnabled in HomePageClient.
 */
export const transformVisitSection = (
  homeData: Home | null,
  space: Space | null,
): VisitSectionData | null => {
  if (homeData?.visitTitle) {
    return {
      title: homeData.visitTitle,
      description: homeData.visitDescription || '',
      image: resolveOptimizedUrl(homeData.visitImage as Media, 1920) || resolveMediaUrl(homeData.visitImage),
      ctaText: homeData.visitCtaText || 'Plan Your Visit',
      ctaUrl: homeData.visitCtaUrl || '/visit',
    }
  }

  if (!space) {
    return null
  }

  return {
    title: space.name || 'Gallery 1882',
    description: space.description || '',
    image: '',
    ctaText: 'Plan Your Visit',
    ctaUrl: '/visit',
  }
}
