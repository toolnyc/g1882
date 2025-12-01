import type { Happening, Home, Media, Space } from '@/payload-types'

import { resolveArtist, resolveMediaUrl } from './mediaHelpers'

export interface FeaturedArtistData {
  id: string
  name: string
  title: string
  bio: string
  image: string
  exhibitionId: string
  artistSlug: string
}

export interface VisitSectionData {
  title: string
  description: string
  image: string
  ctaText: string
  ctaUrl: string
}

const defaultArtistImage = '/media/test-artist.jpg'
const defaultVisitImage = '/media/test-space.jpg'

const getArtistImage = (image: string | Media | null | undefined) =>
  resolveMediaUrl(image, defaultArtistImage)

export const transformFeaturedArtist = (
  homeData: Home | null,
  featuredHappening?: Happening | null,
): FeaturedArtistData | null => {
  const homeArtist = resolveArtist(homeData?.featuredArtist)
  if (homeArtist) {
    return {
      id: homeArtist.id,
      name: homeArtist.name,
      title: homeArtist.name,
      bio: homeArtist.bio || '',
      image: getArtistImage(homeArtist.image),
      exhibitionId: '',
      artistSlug: homeArtist.slug,
    }
  }

  if (!featuredHappening) {
    return null
  }

  const happeningArtist = resolveArtist(featuredHappening.featuredPerson)
  if (happeningArtist) {
    return {
      id: happeningArtist.id,
      name: happeningArtist.name,
      title: featuredHappening.title || happeningArtist.name,
      bio: happeningArtist.bio || '',
      image: getArtistImage(happeningArtist.image),
      exhibitionId: featuredHappening.id,
      artistSlug: happeningArtist.slug,
    }
  }

  if (featuredHappening.featuredPersonName) {
    return {
      id: featuredHappening.id,
      name: featuredHappening.featuredPersonName,
      title: featuredHappening.title || featuredHappening.featuredPersonName,
      bio: '',
      image: defaultArtistImage,
      exhibitionId: featuredHappening.id,
      artistSlug: '',
    }
  }

  return null
}

export const transformVisitSection = (
  homeData: Home | null,
  space: Space | null,
): VisitSectionData | null => {
  if (homeData?.visitTitle) {
    return {
      title: homeData.visitTitle,
      description: homeData.visitDescription || '',
      image: resolveMediaUrl(homeData.visitImage, defaultVisitImage),
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
    image: defaultVisitImage,
    ctaText: 'Plan Your Visit',
    ctaUrl: '/visit',
  }
}

