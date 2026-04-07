import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedSpace } from '@/utilities/getSpace'
import { formatStructuredHours } from '@/utilities/hoursHelpers'
import type { Visit } from '@/payload-types'
import VisitPageClient from './VisitPage.client'

export const dynamic = 'force-dynamic'

export default async function VisitPage() {
  const [visit, space] = await Promise.all([
    getCachedGlobal('visit', 1)() as Promise<Visit>,
    getCachedSpace()(),
  ])

  const formattedHours = formatStructuredHours(space?.structuredHours)

  return <VisitPageClient visit={visit} formattedHours={formattedHours} />
}
