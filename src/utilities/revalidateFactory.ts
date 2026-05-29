import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { logger } from '@/lib/logger'

type DocLike = { slug?: string | null; id?: string | number; _status?: string }

interface RevalidateConfig {
  collection: string
  getPaths?: (doc: DocLike) => string[]
  getTags: (doc: DocLike) => string[]
  isDraftAware?: boolean
}

function runRevalidate(
  doc: DocLike,
  config: RevalidateConfig,
  payloadLogger: { info: (msg: string) => void },
  note?: string,
) {
  const paths = config.getPaths?.(doc) ?? []
  const tags = config.getTags(doc)

  payloadLogger.info(`Revalidating ${config.collection}${note ? ` (${note})` : ''}`)

  for (const path of paths) revalidatePath(path)
  for (const tag of tags) revalidateTag(tag)

  logger.info('revalidation_triggered', {
    collection: config.collection,
    ...(note && { note }),
    paths,
    tags,
  })
}

export function createRevalidateHook(config: RevalidateConfig): {
  afterChange: CollectionAfterChangeHook & GlobalAfterChangeHook
  afterDelete: CollectionAfterDeleteHook
} {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterChange = (({ doc, previousDoc, req: { payload, context } }: any) => {
    if (!context.disableRevalidate) {
      if (config.isDraftAware) {
        if (doc._status === 'published') {
          runRevalidate(doc as DocLike, config, payload.logger)
        } else if ((previousDoc as DocLike)?._status === 'published') {
          runRevalidate(previousDoc as DocLike, config, payload.logger, 'unpublish')
        }
      } else {
        runRevalidate(doc as DocLike, config, payload.logger)

        if (
          (previousDoc as DocLike)?.slug &&
          (previousDoc as DocLike).slug !== (doc as DocLike).slug
        ) {
          runRevalidate(
            previousDoc as DocLike,
            config,
            payload.logger,
            `old slug: ${(previousDoc as DocLike).slug}`,
          )
        }
      }
    }
    return doc
  }) as CollectionAfterChangeHook & GlobalAfterChangeHook

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterDelete = (({ doc, req: { context } }: any) => {
    if (!context.disableRevalidate) {
      const paths = config.getPaths?.(doc as DocLike) ?? []
      const tags = config.getTags(doc as DocLike)

      for (const path of paths) revalidatePath(path)
      for (const tag of tags) revalidateTag(tag)
    }
    return doc
  }) as CollectionAfterDeleteHook

  return { afterChange, afterDelete }
}
