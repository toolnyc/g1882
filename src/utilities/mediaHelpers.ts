import type { Artist, Media } from '@/payload-types'

import { getMediaUrl } from './getMediaUrl'
import { isArtist, isMedia } from './typeGuards'

export const resolveMediaUrl = (
  media: string | Media | null | undefined,
  fallback = '',
  cacheTag?: string | null,
) => {
  if (!media) {
    return fallback
  }

  // If it's a string, check if it's a valid URL (not a Payload ID)
  if (typeof media === 'string') {
    // Valid URLs start with '/' or 'http://' or 'https://'
    if (media.startsWith('/') || media.startsWith('http://') || media.startsWith('https://')) {
      return media
    }
    // Otherwise it's probably a Payload ID, use fallback
    return fallback
  }

  if (!isMedia(media) || !media.url) {
    return fallback
  }

  return getMediaUrl(media.url, cacheTag ?? media.updatedAt)
}

export const resolveArtist = (artist: string | Artist | null | undefined): Artist | null => {
  if (!isArtist(artist)) {
    return null
  }

  return artist
}
