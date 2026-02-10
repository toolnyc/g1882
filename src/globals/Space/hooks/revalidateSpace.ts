import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSpace: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating space`)

    revalidatePath('/space')
    revalidatePath('/visit')
    revalidateTag('global_space')
  }

  return doc
}
