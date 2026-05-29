import { describe, it, expect } from 'vitest'
import { getMediaUrl } from '@/utilities/getMediaUrl'

describe('getMediaUrl', () => {
  describe('empty or null input', () => {
    it('returns empty string for null', () => {
      expect(getMediaUrl(null)).toBe('')
    })

    it('returns empty string for undefined', () => {
      expect(getMediaUrl(undefined)).toBe('')
    })

    it('returns empty string for empty string', () => {
      expect(getMediaUrl('')).toBe('')
    })
  })

  describe('relative URLs', () => {
    it('keeps root-relative URLs as-is', () => {
      expect(getMediaUrl('/api/media/file/test.jpg')).toBe('/api/media/file/test.jpg')
    })

    it('prepends slash to non-slash-prefixed paths', () => {
      expect(getMediaUrl('api/media/file/test.jpg')).toBe('/api/media/file/test.jpg')
    })

    it('keeps relative URLs relative (no origin prepended)', () => {
      const result = getMediaUrl('/api/media/file/image.png')
      expect(result).not.toContain('http')
      expect(result).not.toContain('localhost')
      expect(result).not.toContain('://')
      expect(result).toBe('/api/media/file/image.png')
    })
  })

  describe('absolute URLs', () => {
    it('passes through absolute https URLs unchanged', () => {
      const url = 'https://example.blob.vercel-storage.com/image.webp'
      expect(getMediaUrl(url)).toBe(url)
    })

    it('passes through absolute http URLs unchanged', () => {
      const url = 'http://cdn.example.com/image.jpg'
      expect(getMediaUrl(url)).toBe(url)
    })
  })

  describe('cache tag', () => {
    it('appends cache tag as query parameter', () => {
      expect(getMediaUrl('/image.jpg', '2026-01-01T00:00:00.000Z')).toBe(
        '/image.jpg?2026-01-01T00%3A00%3A00.000Z',
      )
    })

    it('appends cache tag to absolute URLs', () => {
      const url = 'https://cdn.example.com/image.jpg'
      expect(getMediaUrl(url, 'tag1')).toBe('https://cdn.example.com/image.jpg?tag1')
    })

    it('ignores null cache tag', () => {
      expect(getMediaUrl('/image.jpg', null)).toBe('/image.jpg')
    })

    it('ignores empty cache tag', () => {
      expect(getMediaUrl('/image.jpg', '')).toBe('/image.jpg')
    })
  })
})
