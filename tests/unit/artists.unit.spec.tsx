import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import ArtistPage from '@/app/(frontend)/artists/[slug]/page'
import type { Artist, Media } from '@/payload-types'

// Mock Next.js Image and Link components
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} data-testid="next-image" />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock Suspense
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    Suspense: ({ children, fallback }: any) => children || fallback,
  }
})

// Mock data fetching utilities
vi.mock('@/utilities/getArtistBySlug', () => ({
  getCachedArtistBySlug: vi.fn(() => async () => null),
}))

// Mock RelatedHappenings component
vi.mock('@/app/(frontend)/artists/[slug]/RelatedHappenings', () => ({
  RelatedHappenings: ({ artistName }: any) => (
    <div data-testid="related-happenings">Related to {artistName}</div>
  ),
}))

// Mock generateMeta utility
vi.mock('@/utilities/generateMeta', () => ({
  generateMeta: vi.fn(() => ({
    title: 'Test Artist',
    description: 'Test description',
  })),
}))

describe('ArtistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders without errors when artist exists', async () => {
    const { getCachedArtistBySlug } = await import('@/utilities/getArtistBySlug')

    const mockArtist: Partial<Artist> = {
      id: '1',
      name: 'Test Artist',
      slug: 'test-artist',
      bio: 'Test bio',
      image: {
        id: '1',
        url: '/media/test-artist.jpg',
        alt: 'Test Artist',
      } as Media,
    }

    vi.mocked(getCachedArtistBySlug).mockReturnValue(async () => mockArtist as Artist)

    const component = await ArtistPage({
      params: Promise.resolve({ slug: 'test-artist' }),
    })
    const { container, getByText } = render(component)

    expect(container).toBeDefined()
    expect(getByText('Test Artist')).toBeDefined()
    expect(getByText('Test bio')).toBeDefined()
  })

  it('renders not found message when artist does not exist', async () => {
    const { getCachedArtistBySlug } = await import('@/utilities/getArtistBySlug')

    vi.mocked(getCachedArtistBySlug).mockReturnValue(async () => null as unknown as Artist)

    const component = await ArtistPage({
      params: Promise.resolve({ slug: 'non-existent' }),
    })
    const { container, getByText } = render(component)

    expect(container).toBeDefined()
    expect(getByText('Artist not found')).toBeDefined()
  })

  it('handles missing image gracefully', async () => {
    const { getCachedArtistBySlug } = await import('@/utilities/getArtistBySlug')

    const mockArtist: Partial<Artist> = {
      id: '1',
      name: 'Test Artist',
      slug: 'test-artist',
      bio: 'Test bio',
      image: null,
    }

    vi.mocked(getCachedArtistBySlug).mockReturnValue(async () => mockArtist as Artist)

    const component = await ArtistPage({
      params: Promise.resolve({ slug: 'test-artist' }),
    })
    const { container, getByRole } = render(component)

    expect(container).toBeDefined()
    expect(getByRole('heading', { name: 'Test Artist' })).toBeDefined()
    // Should not have image
    expect(container.querySelector('[data-testid="next-image"]')).toBeNull()
  })

  it('handles missing bio gracefully', async () => {
    const { getCachedArtistBySlug } = await import('@/utilities/getArtistBySlug')

    const mockArtist: Partial<Artist> = {
      id: '1',
      name: 'Test Artist',
      slug: 'test-artist',
      bio: null,
      image: null,
    }

    vi.mocked(getCachedArtistBySlug).mockReturnValue(async () => mockArtist as Artist)

    const component = await ArtistPage({
      params: Promise.resolve({ slug: 'test-artist' }),
    })
    const { container, getByRole } = render(component)

    expect(container).toBeDefined()
    expect(getByRole('heading', { name: 'Test Artist' })).toBeDefined()
  })
})

