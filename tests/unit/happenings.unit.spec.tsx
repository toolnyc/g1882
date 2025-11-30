import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import HappeningPage from '@/app/(frontend)/happenings/[slug]/page'
import type { Happening, Artist, Media } from '@/payload-types'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} data-testid="next-image" />
  ),
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
vi.mock('@/utilities/getHappeningBySlug', () => ({
  getCachedHappeningBySlug: vi.fn(() => async () => null),
}))

// Mock components
vi.mock('@/components/RichText', () => ({
  default: ({ data, className }: any) => (
    <div data-testid="rich-text" className={className}>
      {typeof data === 'string' ? data : 'Rich text content'}
    </div>
  ),
}))

vi.mock('@/app/(frontend)/happenings/[slug]/CalendarButton', () => ({
  CalendarButton: ({ happening }: any) => (
    <button data-testid="calendar-button">{happening?.title}</button>
  ),
}))

// Mock utilities
vi.mock('@/utilities/getCategoryTagClasses', () => ({
  getCategoryTagClasses: vi.fn(() => ({
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-800',
  })),
}))

vi.mock('@/utilities/generateMeta', () => ({
  generateMeta: vi.fn(() => ({
    title: 'Test Happening',
    description: 'Test description',
  })),
}))

vi.mock('@/utilities/getURL', () => ({
  getServerSideURL: vi.fn(() => 'http://localhost:3000'),
}))

describe('HappeningPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders without errors when happening exists', async () => {
    const { getCachedHappeningBySlug } = await import('@/utilities/getHappeningBySlug')

    const mockHappening: Partial<Happening> = {
      id: '1',
      title: 'Test Happening',
      slug: 'test-happening',
      description: 'Test description',
      startDate: '2024-01-01T10:00:00Z',
      endDate: '2024-01-31T18:00:00Z',
      category: 'exhibition',
      heroImage: {
        id: '1',
        url: '/media/test-space.jpg',
        alt: 'Test Happening',
      } as Media,
    }

    vi.mocked(getCachedHappeningBySlug).mockReturnValue(
      async () => mockHappening as Happening,
    )

    const component = await HappeningPage({
      params: Promise.resolve({ slug: 'test-happening' }),
    })
    const { container, getByRole } = render(component)

    expect(container).toBeDefined()
    expect(getByRole('heading', { name: 'Test Happening' })).toBeDefined()
  })

  it('renders not found message when happening does not exist', async () => {
    const { getCachedHappeningBySlug } = await import('@/utilities/getHappeningBySlug')

    vi.mocked(getCachedHappeningBySlug).mockReturnValue(async () => null)

    const component = await HappeningPage({
      params: Promise.resolve({ slug: 'non-existent' }),
    })
    const { container, getByText } = render(component)

    expect(container).toBeDefined()
    expect(getByText('Happening not found')).toBeDefined()
  })

  it('handles missing hero image gracefully', async () => {
    const { getCachedHappeningBySlug } = await import('@/utilities/getHappeningBySlug')

    const mockHappening: Partial<Happening> = {
      id: '1',
      title: 'Test Happening',
      slug: 'test-happening',
      description: 'Test description',
      startDate: '2024-01-01T10:00:00Z',
      heroImage: null,
    }

    vi.mocked(getCachedHappeningBySlug).mockReturnValue(
      async () => mockHappening as Happening,
    )

    const component = await HappeningPage({
      params: Promise.resolve({ slug: 'test-happening' }),
    })
    const { container, getByRole } = render(component)

    expect(container).toBeDefined()
    expect(getByRole('heading', { name: 'Test Happening' })).toBeDefined()
    // Should not have hero image
    expect(container.querySelector('[data-testid="next-image"]')).toBeNull()
  })

  it('handles missing description gracefully', async () => {
    const { getCachedHappeningBySlug } = await import('@/utilities/getHappeningBySlug')

    const mockHappening: Partial<Happening> = {
      id: '1',
      title: 'Test Happening',
      slug: 'test-happening',
      description: null,
      startDate: '2024-01-01T10:00:00Z',
    }

    vi.mocked(getCachedHappeningBySlug).mockReturnValue(
      async () => mockHappening as Happening,
    )

    const component = await HappeningPage({
      params: Promise.resolve({ slug: 'test-happening' }),
    })
    const { container, getByRole } = render(component)

    expect(container).toBeDefined()
    expect(getByRole('heading', { name: 'Test Happening' })).toBeDefined()
  })

  it('displays featured person name when available', async () => {
    const { getCachedHappeningBySlug } = await import('@/utilities/getHappeningBySlug')

    const mockArtist: Partial<Artist> = {
      id: '1',
      name: 'Test Artist',
      slug: 'test-artist',
    }

    const mockHappening: Partial<Happening> = {
      id: '1',
      title: 'Test Happening',
      slug: 'test-happening',
      featuredPerson: mockArtist as Artist,
      startDate: '2024-01-01T10:00:00Z',
    }

    vi.mocked(getCachedHappeningBySlug).mockReturnValue(
      async () => mockHappening as Happening,
    )

    const component = await HappeningPage({
      params: Promise.resolve({ slug: 'test-happening' }),
    })
    const { container, getByText } = render(component)

    expect(container).toBeDefined()
    expect(getByText('Test Artist')).toBeDefined()
  })

  it('displays calendar button when start date exists', async () => {
    const { getCachedHappeningBySlug } = await import('@/utilities/getHappeningBySlug')

    const mockHappening: Partial<Happening> = {
      id: '1',
      title: 'Test Happening',
      slug: 'test-happening',
      startDate: '2024-01-01T10:00:00Z',
    }

    vi.mocked(getCachedHappeningBySlug).mockReturnValue(
      async () => mockHappening as Happening,
    )

    const component = await HappeningPage({
      params: Promise.resolve({ slug: 'test-happening' }),
    })
    const { container } = render(component)

    expect(container).toBeDefined()
    expect(container.querySelector('[data-testid="calendar-button"]')).toBeDefined()
  })
})

