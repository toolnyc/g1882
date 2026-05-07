import { describe, it, expect } from 'vitest'
import {
  getOrganizationSchema,
  getEventSchema,
  getArticleSchema,
  getPersonSchema,
} from '@/utilities/jsonLd'
import type { Happening, Post, Artist } from '@/payload-types'

describe('getOrganizationSchema', () => {
  it('returns Organization + LocalBusiness schema with correct context', () => {
    const schema = getOrganizationSchema()
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toEqual(['Organization', 'LocalBusiness'])
  })

  it('includes gallery name', () => {
    const schema = getOrganizationSchema()
    expect(schema.name).toBe('Gallery 1882')
  })

  it('includes description', () => {
    const schema = getOrganizationSchema()
    expect(schema.description).toContain('Gallery 1882')
    expect(schema.description).toContain('Chesterton')
  })

  it('includes URL using getServerSideURL', () => {
    const schema = getOrganizationSchema()
    expect(schema.url).toBeTruthy()
    expect(typeof schema.url).toBe('string')
    // Should be an absolute URL or http://localhost:3000
    expect(schema.url).toMatch(/^https?:\/\//)
  })

  it('includes address with Chesterton, Indiana', () => {
    const schema = getOrganizationSchema()
    expect(schema.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Chesterton',
      addressRegion: 'Indiana',
    })
  })
})

describe('getEventSchema', () => {
  const baseHappening: Happening = {
    id: 'event-1',
    title: 'Spring Exhibition 2026',
    slug: 'spring-exhibition-2026',
    startDate: '2026-03-16T10:00:00Z',
    endDate: '2026-06-20T18:00:00Z',
    type: 'happening-type-1',
    updatedAt: '2026-01-01T00:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
  }

  it('returns Event schema with correct type', () => {
    const schema = getEventSchema(baseHappening)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Event')
  })

  it('maps title to name', () => {
    const schema = getEventSchema(baseHappening)
    expect(schema.name).toBe('Spring Exhibition 2026')
  })

  it('includes startDate', () => {
    const schema = getEventSchema(baseHappening)
    expect(schema.startDate).toBe('2026-03-16T10:00:00Z')
  })

  it('includes endDate when provided', () => {
    const schema = getEventSchema(baseHappening)
    expect(schema.endDate).toBe('2026-06-20T18:00:00Z')
  })

  it('omits endDate when not provided', () => {
    const noEndDate = { ...baseHappening, endDate: null }
    const schema = getEventSchema(noEndDate)
    expect(schema.endDate).toBeUndefined()
  })

  it('includes Gallery 1882 as location', () => {
    const schema = getEventSchema(baseHappening)
    expect(schema.location).toEqual({
      '@type': 'Place',
      name: 'Gallery 1882',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Chesterton',
        addressRegion: 'Indiana',
      },
    })
  })

  it('includes event URL with slug', () => {
    const schema = getEventSchema(baseHappening)
    expect(schema.url).toContain('/happenings/spring-exhibition-2026')
  })

  it('extracts description from rich text', () => {
    const withDescription: Happening = {
      ...baseHappening,
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                { type: 'text', text: 'A spring exhibition featuring local artists.', version: 1 },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }
    const schema = getEventSchema(withDescription)
    expect(schema.description).toBe('A spring exhibition featuring local artists.')
  })

  it('omits description when empty', () => {
    const schema = getEventSchema(baseHappening)
    expect(schema.description).toBeUndefined()
  })

  it('includes image from heroImage media', () => {
    const withImage: Happening = {
      ...baseHappening,
      heroImage: {
        id: 'media-1',
        alt: 'Exhibition photo',
        url: 'https://example.com/hero.jpg',
        updatedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
      },
    } satisfies Happening
    const schema = getEventSchema(withImage)
    expect(schema.image).toBe('https://example.com/hero.jpg')
  })

  it('prefixes relative image URLs with server URL', () => {
    const withRelativeImage: Happening = {
      ...baseHappening,
      heroImage: {
        id: 'media-2',
        alt: 'Exhibition photo',
        url: '/uploads/hero.jpg',
        updatedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
      },
    } satisfies Happening
    const schema = getEventSchema(withRelativeImage)
    expect(schema.image).toMatch(/^https?:\/\/.+\/uploads\/hero\.jpg$/)
  })

  it('omits image when heroImage is a string ID', () => {
    const withStringImage: Happening = {
      ...baseHappening,
      heroImage: 'media-string-id',
    } satisfies Happening
    const schema = getEventSchema(withStringImage)
    expect(schema.image).toBeUndefined()
  })
})

describe('getArticleSchema', () => {
  const basePost: Post = {
    id: 'post-1',
    title: 'Gallery 1882 Announces Summer Residency Program',
    slug: 'summer-residency-2026',
    content: {
      root: {
        type: 'root',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
    updatedAt: '2026-04-01T12:00:00Z',
    createdAt: '2026-03-15T10:00:00Z',
  }

  it('returns Article schema with correct type', () => {
    const schema = getArticleSchema(basePost)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Article')
  })

  it('maps title to headline', () => {
    const schema = getArticleSchema(basePost)
    expect(schema.headline).toBe('Gallery 1882 Announces Summer Residency Program')
  })

  it('maps createdAt to datePublished', () => {
    const schema = getArticleSchema(basePost)
    expect(schema.datePublished).toBe('2026-03-15T10:00:00Z')
  })

  it('maps updatedAt to dateModified', () => {
    const schema = getArticleSchema(basePost)
    expect(schema.dateModified).toBe('2026-04-01T12:00:00Z')
  })

  it('includes article URL with slug', () => {
    const schema = getArticleSchema(basePost)
    expect(schema.url).toContain('/news/summer-residency-2026')
  })

  it('includes description from meta.description', () => {
    const withDescription: Post = {
      ...basePost,
      meta: {
        description: 'Gallery 1882 announces its 2026 summer residency program.',
      },
    }
    const schema = getArticleSchema(withDescription)
    expect(schema.description).toBe('Gallery 1882 announces its 2026 summer residency program.')
  })

  it('omits description when meta.description is missing', () => {
    const schema = getArticleSchema(basePost)
    expect(schema.description).toBeUndefined()
  })

  it('includes image from heroImage media', () => {
    const withImage: Post = {
      ...basePost,
      heroImage: {
        id: 'media-3',
        alt: 'Residency photo',
        url: 'https://example.com/residency.jpg',
        updatedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
      },
    } satisfies Post
    const schema = getArticleSchema(withImage)
    expect(schema.image).toBe('https://example.com/residency.jpg')
  })
})

describe('getPersonSchema', () => {
  const baseArtist: Artist = {
    id: 'artist-1',
    name: 'Jane Doe',
    slug: 'jane-doe',
    updatedAt: '2026-01-01T00:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
  }

  it('returns Person schema with correct type', () => {
    const schema = getPersonSchema(baseArtist)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Person')
  })

  it('maps name to name', () => {
    const schema = getPersonSchema(baseArtist)
    expect(schema.name).toBe('Jane Doe')
  })

  it('includes artist URL with slug', () => {
    const schema = getPersonSchema(baseArtist)
    expect(schema.url).toContain('/artists/jane-doe')
  })

  it('extracts description from bio rich text', () => {
    const withBio: Artist = {
      ...baseArtist,
      bio: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                { type: 'text', text: 'Jane Doe is a contemporary painter based in Indiana.', version: 1 },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }
    const schema = getPersonSchema(withBio)
    expect(schema.description).toBe('Jane Doe is a contemporary painter based in Indiana.')
  })

  it('omits description when bio is empty', () => {
    const schema = getPersonSchema(baseArtist)
    expect(schema.description).toBeUndefined()
  })

  it('includes image from artist image media', () => {
    const withImage: Artist = {
      ...baseArtist,
      image: {
        id: 'media-4',
        alt: 'Jane Doe portrait',
        url: 'https://example.com/portrait.jpg',
        updatedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
      },
    } satisfies Artist
    const schema = getPersonSchema(withImage)
    expect(schema.image).toBe('https://example.com/portrait.jpg')
  })

  it('omits image when image is a string ID', () => {
    const withStringImage: Artist = {
      ...baseArtist,
      image: 'media-string-id',
    } satisfies Artist
    const schema = getPersonSchema(withStringImage)
    expect(schema.image).toBeUndefined()
  })
})
