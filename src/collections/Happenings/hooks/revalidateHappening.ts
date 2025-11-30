import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Happening } from '../../../payload-types'

export const revalidateHappening: CollectionAfterChangeHook<Happening> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc.slug) {
      const path = `/happenings/${doc.slug}`

      payload.logger.info(`Revalidating happening at path: ${path}`)

      revalidatePath(path)
      revalidateTag(`happening_${doc.slug}`)
      revalidateTag('happenings')
    }

    // If the slug changed, we need to revalidate the old path
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = `/happenings/${previousDoc.slug}`

      payload.logger.info(`Revalidating old happening at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag(`happening_${previousDoc.slug}`)
    }
  }
  return doc
}

export const revalidateDeleteHappening: CollectionAfterDeleteHook<Happening> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    const path = `/happenings/${doc.slug}`

    revalidatePath(path)
    revalidateTag(`happening_${doc.slug}`)
    revalidateTag('happenings')
  }

  return doc
}

