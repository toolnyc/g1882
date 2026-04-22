import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedSpace } from '@/utilities/getSpace'
import { formatStructuredHours } from '@/utilities/hoursHelpers'
import type { SiteSetting, Visit } from '@/payload-types'
import VisitPageClient from './VisitPage.client'

export const dynamic = 'force-dynamic'

export default async function VisitPage() {
  const [visit, space, siteSettings] = await Promise.all([
    getCachedGlobal('visit', 1)() as Promise<Visit>,
    getCachedSpace()(),
    getCachedGlobal('site-settings', 0)() as Promise<SiteSetting>,
  ])

  const formattedHours = formatStructuredHours(space?.structuredHours)

  return (
    <VisitPageClient
      visit={visit}
      formattedHours={formattedHours}
      pageTitle={siteSettings?.pageTitles?.visit}
    />
  )
}
