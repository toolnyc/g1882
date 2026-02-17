import type { Payload, PayloadRequest } from 'payload'
import type { Artist, Media } from '@/payload-types'
import { mockArtists } from './mockData'
import { toKebabCase } from '@/utilities/toKebabCase'

function textToLexical(text: string) {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'paragraph' as const,
          children: [{ type: 'text' as const, text, version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
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

export async function seedArtists(
  payload: Payload,
  req: PayloadRequest,
  mediaMap: Map<string, Media>,
): Promise<Map<string, Artist>> {
  const artistMap = new Map<string, Artist>()

  for (const mockArtist of mockArtists) {
    const slug = toKebabCase(mockArtist.name)

    // Find media for artist image
    let artistImage: Media | null = null
    if (mockArtist.image) {
      const imageFilename = mockArtist.image.split('/').pop() || 'test-artist.jpg'
      artistImage = mediaMap.get(imageFilename) || null
    }

    const artist = await payload.create({
      collection: 'artists',
      data: {
        name: mockArtist.name,
        slug,
        bio: mockArtist.bio ? textToLexical(mockArtist.bio) : undefined,
        image: artistImage?.id || undefined,
      },
      req,
      context: {
        disableRevalidate: true,
      },
    })

    artistMap.set(mockArtist.name, artist)
  }

  return artistMap
}
