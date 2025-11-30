import type { Artist, Media } from '@/payload-types'

export const isMedia = (value: unknown): value is Media => {
  return typeof value === 'object' && value !== null && 'url' in value
}

export const isArtist = (value: unknown): value is Artist => {
  return typeof value === 'object' && value !== null && 'name' in value
}

