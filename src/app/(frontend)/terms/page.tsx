import type { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Policy } from '@/payload-types'
import RichText from '@/components/RichText'

import { draftMode } from 'next/headers'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: '/terms',
    },
    title: 'Terms & Conditions | Gallery 1882',
    description: 'Terms and conditions for Gallery 1882 website.',
  }
}

export default async function TermsPage() {
  const { isEnabled: draft } = await draftMode()
  const policies = (await getCachedGlobal('policies', 1, draft)()) as Policy

  const hasContent = policies?.termsContent?.root?.children?.length

  return (
    <main className="container pt-48 pb-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Terms &amp; Conditions</h1>

      {hasContent ? (
        <>
          {policies.termsLastUpdated && (
            <p className="text-navy/70 mb-8 text-sm">
              Last updated:{' '}
              {new Date(policies.termsLastUpdated).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          <div className="prose prose-navy max-w-none">
            <RichText data={policies.termsContent!} enableGutter={false} />
          </div>
        </>
      ) : (
        <div className="prose prose-navy max-w-none">
          <p className="text-navy/70">
            Terms and conditions content has not been configured yet. Please check back later.
          </p>
        </div>
      )}
    </main>
  )
}
