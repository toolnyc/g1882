import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Happening } from '../../../payload-types'

export const revalidateHappening: CollectionAfterChangeHook<Happening> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    // Always revalidate the happenings list tag
    revalidateTag('happenings')

    if (doc.slug) {
      const path = `/happenings/${doc.slug}`

      payload.logger.info(`Revalidating happening at path: ${path}`)

      revalidatePath(path)
      revalidateTag(`happening_${doc.slug}`)
    }

    // Also revalidate the ID-based path (fallback for happenings without slugs)
    const idPath = `/happenings/${doc.id}`
    revalidatePath(idPath)
    revalidateTag(`happening_${doc.id}`)

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
  if (!context.disableRevalidate) {
    revalidateTag('happenings')

    if (doc?.slug) {
      const path = `/happenings/${doc.slug}`

      revalidatePath(path)
      revalidateTag(`happening_${doc.slug}`)
    }

    if (doc?.id) {
      revalidatePath(`/happenings/${doc.id}`)
      revalidateTag(`happening_${doc.id}`)
    }
  }

  return doc
}






