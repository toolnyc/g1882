import { describe, it, expect, vi } from 'vitest'
import { resolveOptimizedUrl } from '@/utilities/resolveOptimizedUrl'
import type { Media } from '@/payload-types'

vi.mock('@/utilities/getMediaUrl', () => ({
  getMediaUrl: vi.fn((url: string, cacheTag?: string) =>
    cacheTag ? `${url}?v=${encodeURIComponent(cacheTag)}` : url,
  ),
}))

function createMedia(overrides: Record<string, any> = {}): Media {
  return {
    id: '1',
    url: '/api/media/file/test.jpg',
    updatedAt: '2026-01-01T00:00:00.000Z',
    alt: 'Test image',
    ...overrides,
  } as unknown as Media
}

describe('resolveOptimizedUrl', () => {
  describe('handles null/undefined input', () => {
    it('returns empty string for null', () => {
      expect(resolveOptimizedUrl(null)).toBe('')
    })

    it('returns empty string for undefined', () => {
      expect(resolveOptimizedUrl(undefined)).toBe('')
    })

    it('returns empty string for non-object input', () => {
      expect(resolveOptimizedUrl('string' as any)).toBe('')
    })
  })

  describe('falls back to original url when no sizes', () => {
    it('returns original url with cache tag', () => {
      const media = createMedia()
      const result = resolveOptimizedUrl(media, 800)
      expect(result).toBe('/api/media/file/test.jpg?v=2026-01-01T00%3A00%3A00.000Z')
    })
  })

  describe('size selection', () => {
    const media = createMedia({
      sizes: {
        square: { url: 'https://blob.store/square.webp', width: 500, height: 500 },
        small: { url: 'https://blob.store/small.webp', width: 600, height: 400 },
        medium: { url: 'https://blob.store/medium.webp', width: 900, height: 600 },
        large: { url: 'https://blob.store/large.webp', width: 1400, height: 933 },
        xlarge: { url: 'https://blob.store/xlarge.webp', width: 1920, height: 1280 },
      },
    })

    it('picks square for width <= 500', () => {
      const result = resolveOptimizedUrl(media, 400)
      expect(result).toContain('square.webp')
    })

    it('picks small for width <= 600', () => {
      const result = resolveOptimizedUrl(media, 550)
      expect(result).toContain('small.webp')
    })

    it('picks medium for width <= 900', () => {
      const result = resolveOptimizedUrl(media, 800)
      expect(result).toContain('medium.webp')
    })

    it('picks large for width <= 1400', () => {
      const result = resolveOptimizedUrl(media, 1200)
      expect(result).toContain('large.webp')
    })

    it('picks xlarge for width <= 1920', () => {
      const result = resolveOptimizedUrl(media, 1600)
      expect(result).toContain('xlarge.webp')
    })

    it('falls back to largest available when target exceeds all sizes', () => {
      const result = resolveOptimizedUrl(media, 2500)
      expect(result).toContain('xlarge.webp')
    })
  })

  describe('skips missing sizes', () => {
    it('skips over missing size entries', () => {
      const media = createMedia({
        sizes: {
          // square and small are missing
          medium: { url: 'https://blob.store/medium.webp', width: 900, height: 600 },
        },
      })
      const result = resolveOptimizedUrl(media, 400)
      expect(result).toContain('medium.webp')
    })
  })

  describe('cache tag', () => {
    it('uses updatedAt as cache tag', () => {
      const media = createMedia({
        sizes: {
          medium: { url: 'https://blob.store/medium.webp', width: 900, height: 600 },
        },
      })
      const result = resolveOptimizedUrl(media, 800)
      expect(result).toContain('v=')
    })
  })
})
