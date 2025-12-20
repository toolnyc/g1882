import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Visit } from '@/payload-types'
import VisitPageClient from './VisitPage.client'

export const dynamic = 'force-dynamic'

export default async function VisitPage() {
  const visit = (await getCachedGlobal('visit', 1)()) as Visit

  return <VisitPageClient visit={visit} />
}
