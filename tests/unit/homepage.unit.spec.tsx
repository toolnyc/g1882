import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import HomePage from '@/app/(frontend)/page'
import type { Happening, Artist, Media } from '@/payload-types'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} data-testid="next-image" />
  ),
}))

// Mock data fetching utilities
vi.mock('@/utilities/getHappenings', () => ({
  getCachedHappenings: vi.fn(() => async () => []),
}))

vi.mock('@/utilities/getSpace', () => ({
  getCachedSpace: vi.fn(() => async () => null),
}))

vi.mock('@/utilities/getMediaUrl', () => ({
  getMediaUrl: vi.fn((url: string) => url),
}))

// Mock components to avoid complex dependencies
vi.mock('@/components/GalleryHero', () => ({
  GalleryHero: () => <div data-testid="gallery-hero">Gallery Hero</div>,
}))

vi.mock('@/components/CurrentExhibition', () => ({
  CurrentExhibition: ({ happening }: any) => (
    <div data-testid="current-exhibition">{happening?.title || 'No Exhibition'}</div>
  ),
}))

vi.mock('@/components/VisitSection', () => ({
  VisitSection: ({ title }: any) => <div data-testid="visit-section">{title}</div>,
}))

vi.mock('@/components/ArtistFeature', () => ({
  ArtistFeature: ({ name }: any) => <div data-testid="artist-feature">{name}</div>,
}))

vi.mock('@/components/UpcomingHappenings', () => ({
  UpcomingHappenings: ({ happenings }: any) => (
    <div data-testid="upcoming-happenings">
      {happenings?.length || 0} upcoming
    </div>
  ),
}))

vi.mock('@/components/MissionSection', () => ({
  MissionSection: () => <div data-testid="mission-section">Mission Section</div>,
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders without errors', async () => {
    const { getCachedHappenings } = await import('@/utilities/getHappenings')
    const { getCachedSpace } = await import('@/utilities/getSpace')

    // Mock empty data
    vi.mocked(getCachedHappenings).mockReturnValue(async () => [])
    vi.mocked(getCachedSpace).mockReturnValue(async () => null)

    const component = await HomePage()
    const { container } = render(component)

    expect(container).toBeDefined()
    expect(container.querySelector('[data-testid="gallery-hero"]')).toBeDefined()
    expect(container.querySelector('[data-testid="mission-section"]')).toBeDefined()
  })

  it('renders with happenings data', async () => {
    const { getCachedHappenings } = await import('@/utilities/getHappenings')
    const { getCachedSpace } = await import('@/utilities/getSpace')

    const mockHappening: Partial<Happening> = {
      id: '1',
      title: 'Test Exhibition',
      featured: true,
      isActive: true,
      slug: 'test-exhibition',
    }

    vi.mocked(getCachedHappenings).mockReturnValue(async () => [mockHappening] as Happening[])
    vi.mocked(getCachedSpace).mockReturnValue(async () => ({
      id: '1',
      description: 'Test space description',
    }))

    const component = await HomePage()
    const { container } = render(component)

    expect(container).toBeDefined()
    expect(container.querySelector('[data-testid="current-exhibition"]')).toBeDefined()
  })

  it('handles missing data gracefully', async () => {
    const { getCachedHappenings } = await import('@/utilities/getHappenings')
    const { getCachedSpace } = await import('@/utilities/getSpace')

    vi.mocked(getCachedHappenings).mockReturnValue(async () => [])
    vi.mocked(getCachedSpace).mockReturnValue(async () => null)

    const component = await HomePage()
    const { container } = render(component)

    // Should still render without crashing
    expect(container).toBeDefined()
    expect(container.querySelector('main')).toBeDefined()
  })
})

