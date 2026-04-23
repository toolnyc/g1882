import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site-settings`)

    revalidatePath('/')
    revalidatePath('/artists')
    revalidatePath('/happenings')
    revalidatePath('/news')
    revalidatePath('/visit')
    revalidatePath('/space')
    revalidateTag('global_site-settings')
  }

  return doc
}
