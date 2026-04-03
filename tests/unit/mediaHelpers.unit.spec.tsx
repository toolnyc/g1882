import { describe, it, expect, vi } from 'vitest'
import { resolveMediaUrl, resolveArtist } from '@/utilities/mediaHelpers'
import type { Artist, Media } from '@/payload-types'

// Mock getMediaUrl
vi.mock('@/utilities/getMediaUrl', () => ({
  getMediaUrl: vi.fn((url: string, cacheTag?: string) =>
    cacheTag ? `${url}?v=${cacheTag}` : url,
  ),
}))

// Mock typeGuards
vi.mock('@/utilities/typeGuards', () => ({
  isMedia: (val: any) => typeof val === 'object' && val !== null && 'url' in val,
  isArtist: (val: any) => typeof val === 'object' && val !== null && 'name' in val && 'slug' in val,
}))

describe('resolveMediaUrl', () => {
  it('returns fallback for null media', () => {
    expect(resolveMediaUrl(null)).toBe('')
  })

  it('returns fallback for undefined media', () => {
    expect(resolveMediaUrl(undefined)).toBe('')
  })

  it('returns custom fallback when provided', () => {
    expect(resolveMediaUrl(null, '/placeholder.jpg')).toBe('/placeholder.jpg')
  })

  it('returns URL string starting with /', () => {
    expect(resolveMediaUrl('/media/test.jpg')).toBe('/media/test.jpg')
  })

  it('returns URL string starting with http', () => {
    expect(resolveMediaUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
  })

  it('returns fallback for string that looks like a Payload ID', () => {
    expect(resolveMediaUrl('507f1f77bcf86cd799439011')).toBe('')
  })

  it('resolves media object with url', () => {
    const media = { url: '/media/test.jpg', updatedAt: '2026-01-01' } as unknown as Media
    const result = resolveMediaUrl(media)
    expect(result).toContain('/media/test.jpg')
  })

  it('returns fallback for media object without url', () => {
    const media = { id: '1' } as unknown as Media
    expect(resolveMediaUrl(media, '/fallback.jpg')).toBe('/fallback.jpg')
  })
})

describe('resolveArtist', () => {
  it('returns null for null input', () => {
    expect(resolveArtist(null)).toBeNull()
  })

  it('returns null for undefined input', () => {
    expect(resolveArtist(undefined)).toBeNull()
  })

  it('returns null for string ID', () => {
    expect(resolveArtist('507f1f77bcf86cd799439011')).toBeNull()
  })

  it('returns artist object when populated', () => {
    const artist = { id: '1', name: 'Test Artist', slug: 'test-artist' } as Artist
    expect(resolveArtist(artist)).toEqual(artist)
  })
})
