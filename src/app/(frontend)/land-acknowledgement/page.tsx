import type { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Policy } from '@/payload-types'
import RichText from '@/components/RichText'

import { draftMode } from 'next/headers'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: '/land-acknowledgement',
    },
    title: 'Land Acknowledgement | Gallery 1882',
    description: 'Land acknowledgement statement for Gallery 1882.',
  }
}

export default async function LandAcknowledgementPage() {
  const { isEnabled: draft } = await draftMode()
  const policies = (await getCachedGlobal('policies', 1, draft)()) as Policy

  const hasContent = policies?.landAcknowledgementContent?.root?.children?.length

  return (
    <main className="container pt-48 pb-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Land Acknowledgement</h1>

      {hasContent ? (
        <div className="prose prose-navy max-w-none">
          <RichText data={policies.landAcknowledgementContent!} enableGutter={false} />
        </div>
      ) : (
        <div className="prose prose-navy max-w-none">
          <p className="text-navy/70">
            Land acknowledgement content has not been configured yet. Please check back later.
          </p>
        </div>
      )}
    </main>
  )
}
