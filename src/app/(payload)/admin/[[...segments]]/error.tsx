'use client'

import React, { useEffect } from 'react'

/**
 * Error boundary for Payload admin pages.
 * Catches client-side rendering errors that would otherwise produce a blank page.
 * This is a diagnostic tool — check browser console for detailed error output.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log full error details to browser console
    console.error('[g1882-admin-diagnostics] Admin page error caught:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest,
    })
    import('@sentry/nextjs').then(Sentry => Sentry.captureException(error))
  }, [error])

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>
        Admin Page Error
      </h2>
      <p style={{ color: '#374151', marginBottom: '8px' }}>
        The admin page failed to render. Error details have been logged to the browser console.
      </p>
      <pre
        style={{
          background: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#1f2937',
          marginBottom: '16px',
        }}
      >
        <strong>{error.name}:</strong> {error.message}
        {error.digest && (
          <>
            {'\n'}
            <strong>Digest:</strong> {error.digest}
          </>
        )}
      </pre>
      <button
        onClick={reset}
        style={{
          background: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Try Again
      </button>
    </div>
  )
}
