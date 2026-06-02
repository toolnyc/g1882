import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'A contemporary art gallery in the Indiana dunes.',
  images: [
    {
      url: `${getServerSideURL()}/og-default.png`,
    },
  ],
  siteName: 'Gallery 1882',
  title: 'Gallery 1882',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
