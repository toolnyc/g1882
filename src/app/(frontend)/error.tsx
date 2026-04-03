'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
      <h1 className="mb-4 font-sans text-2xl font-light text-navy">Something went wrong</h1>
      <p className="mb-8 max-w-md font-sans text-sm text-navy/60">
        We encountered an unexpected error. Our team has been notified and is looking into it.
      </p>
      <button
        onClick={reset}
        className="rounded-gallery border border-navy bg-navy px-6 py-3 font-sans text-sm text-off-white transition-colors hover:bg-navy/90"
      >
        Try again
      </button>
    </div>
  )
}
