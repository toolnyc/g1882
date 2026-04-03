'use client'

import React, { useEffect } from 'react'

/**
 * Top-level error boundary for the entire Payload admin route group.
 * Catches errors that escape the segments-level error boundary.
 */
export default function PayloadError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[g1882-admin-diagnostics] Payload route group error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest,
    })
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
        Payload Admin Error
      </h2>
      <pre
        style={{
          background: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '13px',
          color: '#1f2937',
          marginBottom: '16px',
        }}
      >
        <strong>{error.name}:</strong> {error.message}
        {error.digest && `\nDigest: ${error.digest}`}
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
        }}
      >
        Try Again
      </button>
    </div>
  )
}
