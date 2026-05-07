import type { Metadata } from 'next'

import type { Post, Config } from '../payload-types'
import type { MediaWithSizes } from '@/types/media-sizes'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: MediaWithSizes | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  const makeAbsolute = (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    return serverUrl + path
  }

  let url = serverUrl + '/og-default.png'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = (image as MediaWithSizes).sizes?.og?.url

    const imageUrl = (ogUrl || image.url) ?? undefined
    url = imageUrl ? makeAbsolute(imageUrl) : url
  }

  return url
}

export const generateMeta = async (args: {
  collection?: string
  doc: Partial<Post> | { meta?: { title?: string | null; description?: string | null; image?: MediaWithSizes | string | null } } | null
}): Promise<Metadata> => {
  const { collection, doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title
    : ''

  // Type guard to check if doc has slug property
  const docSlug = doc && 'slug' in doc ? doc.slug : undefined
  
  return {
    ...(collection
      ? {
          alternates: {
            canonical: `/${collection}/${docSlug || ''}`,
          },
        }
      : {}),
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(docSlug) ? docSlug.join('/') : '/',
    }),
    title,
  }
}
