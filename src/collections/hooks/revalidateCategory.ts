import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import type { Category } from '../../payload-types'

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating categories`)

    revalidateTag('search-index')
  }

  return doc
}
