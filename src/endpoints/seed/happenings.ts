import type { Artist, Happening, Media } from '@/payload-types'
import type { Payload, PayloadRequest } from 'payload'
import { mockHappenings } from './mockData'
import { toKebabCase } from '@/utilities/toKebabCase'

export type HappeningSeedArgs = {
  artistMap: Map<string, Artist>
  mediaMap: Map<string, Media>
}

// Convert description string to Lexical format
function descriptionToLexical(description: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: description,
              version: 1,
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// seedArtists moved to artists.ts

export async function seedHappenings(
  payload: Payload,
  req: PayloadRequest,
  artistMap: Map<string, Artist>,
  mediaMap: Map<string, Media>,
): Promise<Map<string, Happening>> {
  const happeningMap = new Map<string, Happening>()

  for (const mockHappening of mockHappenings) {
    const slug = toKebabCase(mockHappening.title)

    // Find artist if featuredPersonName matches
    let featuredPerson: Artist | undefined
    if (mockHappening.featuredPersonName) {
      featuredPerson = artistMap.get(mockHappening.featuredPersonName)
    }

    // Find media for hero image
    let heroImage: Media | null = null
    if (mockHappening.heroImage) {
      const imageFilename = mockHappening.heroImage.split('/').pop() || 'test-art.jpg'
      heroImage = mediaMap.get(imageFilename) || null
    }

    const happening = await payload.create({
      collection: 'happenings',
      data: {
        title: mockHappening.title,
        slug,
        startDate: mockHappening.startDate,
        endDate: mockHappening.endDate || undefined,
        description: descriptionToLexical(mockHappening.description),
        category: mockHappening.category || '',
        featuredPerson: featuredPerson?.id || undefined,
        featuredPersonName: mockHappening.featuredPersonName || '',
        heroImage: heroImage?.id || undefined,
        featured: mockHappening.featured || false,
        isActive: mockHappening.isActive || false,
        isActiveOverride: false,
      },
      req,
      context: {
        disableRevalidate: true,
      },
    })

    happeningMap.set(mockHappening.title, happening)
  }

  return happeningMap
}

