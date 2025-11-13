import type { Payload, PayloadRequest } from 'payload'
import type { Artist, Happening, Media, Post } from '@/payload-types'

// Convert text to Lexical format
function textToLexical(text: string) {
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
              text: text,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

export async function seedPosts(
  payload: Payload,
  req: PayloadRequest,
  artistMap: Map<string, Artist>,
  happeningMap: Map<string, Happening>,
  mediaMap: Map<string, Media>,
): Promise<Post[]> {
  const posts: Post[] = []

  // Sample journal posts that link to artists and happenings
  const samplePosts = [
    {
      title: 'Exploring the Dunes: A Conversation with Sarah Chen',
      content:
        'In this exclusive interview, we sit down with landscape photographer Sarah Chen to discuss her latest exhibition "Shoreline Reflections" and her deep connection to the Indiana Dunes region.',
      slug: 'exploring-the-dunes-conversation-sarah-chen',
      artistNames: ['Sarah Chen'],
      happeningTitles: ['Shoreline Reflections'],
      heroImage: 'test-art.jpg',
      publishedAt: new Date('2024-03-20'),
    },
    {
      title: 'Industrial Echoes: Marcus Rodriguez on Art and Environment',
      content:
        'Marcus Rodriguez discusses his mixed media works and how they examine the relationship between industry and nature in the Great Lakes region.',
      slug: 'industrial-echoes-marcus-rodriguez',
      artistNames: ['Marcus Rodriguez'],
      happeningTitles: ['Industrial Echoes'],
      heroImage: 'test-art.jpg',
      publishedAt: new Date('2024-06-10'),
    },
    {
      title: 'Gallery 1882 Opens with Stunning Dune-Inspired Exhibition',
      content:
        'Gallery 1882 celebrates its opening with "Shoreline Reflections," featuring the work of Sarah Chen and exploring themes of light, water, and the natural beauty of the Indiana Dunes.',
      slug: 'gallery-1882-opens-dune-inspired-exhibition',
      artistNames: ['Sarah Chen'],
      happeningTitles: ['Shoreline Reflections'],
      heroImage: 'test-space.jpg',
      publishedAt: new Date('2024-03-15'),
    },
  ]

  for (const postData of samplePosts) {
    // Find linked artists
    const linkedArtists = postData.artistNames
      .map((name) => artistMap.get(name))
      .filter((artist): artist is Artist => artist !== undefined)
      .map((artist) => artist.id)

    // Find linked happenings
    const linkedHappenings = postData.happeningTitles
      .map((title) => happeningMap.get(title))
      .filter((happening): happening is Happening => happening !== undefined)
      .map((happening) => happening.id)

    // Find hero image
    const heroImage = mediaMap.get(postData.heroImage)

    const post = await payload.create({
      collection: 'posts',
      data: {
        title: postData.title,
        slug: postData.slug,
        content: textToLexical(postData.content),
        heroImage: heroImage?.id || undefined,
        artists: linkedArtists.length > 0 ? linkedArtists : undefined,
        happenings: linkedHappenings.length > 0 ? linkedHappenings : undefined,
        publishedAt: postData.publishedAt.toISOString(),
        _status: 'published',
      },
      req,
      context: {
        disableRevalidate: true,
      },
    })

    posts.push(post)
  }

  return posts
}

