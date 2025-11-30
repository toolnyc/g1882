import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Artist } from '../../../payload-types'

export const revalidateArtist: CollectionAfterChangeHook<Artist> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc.slug) {
      const path = `/artists/${doc.slug}`

      payload.logger.info(`Revalidating artist at path: ${path}`)

      revalidatePath(path)
      revalidateTag(`artist_${doc.slug}`)
      revalidateTag('artists')
    }

    // If the slug changed, we need to revalidate the old path
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = `/artists/${previousDoc.slug}`

      payload.logger.info(`Revalidating old artist at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag(`artist_${previousDoc.slug}`)
    }
  }
  return doc
}

export const revalidateDeleteArtist: CollectionAfterDeleteHook<Artist> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    const path = `/artists/${doc.slug}`

    revalidatePath(path)
    revalidateTag(`artist_${doc.slug}`)
    revalidateTag('artists')
  }

  return doc
}

