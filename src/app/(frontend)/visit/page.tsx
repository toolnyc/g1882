import type { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { formatStructuredHours } from '@/utilities/hoursHelpers'
import type { SiteSetting, Visit } from '@/payload-types'
import VisitPageClient from './VisitPage.client'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: '/visit',
    },
    title: 'Visit',
    description:
      'Plan your visit to Gallery 1882 in Chesterton, Indiana. Hours, directions, and admission information.',
  }
}

export default async function VisitPage() {
  const [visit, siteSettings] = await Promise.all([
    getCachedGlobal('visit', 1)() as Promise<Visit>,
    getCachedGlobal('site-settings', 0)() as Promise<SiteSetting>,
  ])

  const formattedHours = formatStructuredHours(siteSettings?.structuredHours)

  return (
    <VisitPageClient
      visit={visit}
      formattedHours={formattedHours}
      pageTitle={siteSettings?.pageTitles?.visit}
      galleryAddress={siteSettings?.address || null}
    />
  )
}
