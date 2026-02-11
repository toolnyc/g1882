import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedSpace } from '@/utilities/getSpace'
import { formatStructuredHours } from '@/utilities/hoursHelpers'
import type { Visit } from '@/payload-types'
import VisitPageClient from './VisitPage.client'

export const dynamic = 'force-dynamic'

export default async function VisitPage() {
  const visit = (await getCachedGlobal('visit', 1)()) as Visit
  const space = await getCachedSpace()()

  const formattedHours = formatStructuredHours(space?.structuredHours)

  return <VisitPageClient visit={visit} formattedHours={formattedHours} />
}
