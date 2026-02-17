import type { Home, Media, Space } from '@/payload-types'

import { resolveArtist, resolveMediaUrl } from './mediaHelpers'
import { extractPlainText } from './richTextHelpers'

export interface FeaturedArtistData {
  id: string
  name: string
  title: string
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

export const transformFeaturedArtist = (
  homeData: Home | null,
): FeaturedArtistData | null => {
  const homeArtist = resolveArtist(homeData?.featuredArtist)
  if (!homeArtist) return null

  return {
    id: homeArtist.id,
    name: homeArtist.name,
    title: homeArtist.name,
    bio: (homeData?.featuredArtistDescription as string) || extractPlainText(homeArtist.bio) || '',
    image: getArtistImage(homeArtist.image, homeData?.featuredArtistImage),
    artistSlug: homeArtist.slug,
  }
}

export const transformVisitSection = (
  homeData: Home | null,
  space: Space | null,
): VisitSectionData | null => {
  if (homeData?.visitTitle) {
    return {
      title: homeData.visitTitle,
      description: homeData.visitDescription || '',
      image: resolveMediaUrl(homeData.visitImage),
      ctaText: homeData.visitCtaText || 'Plan Your Visit',
      ctaUrl: homeData.visitCtaUrl || '/visit',
    }
  }

  if (!space) {
    return null
  }

  return {
    title: 'Escape to the Duneland',
    description:
      space.description ||
      'Located under an hours drive from Chicago, Gallery 1882, in the heart of Chesterton, Indiana is the gateway to the Indiana Dunes National Park. Always open, always free, always inspiring.',
    image: '',
    ctaText: 'Plan Your Visit',
    ctaUrl: '/visit',
  }
}
