'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'

/**
 * Client-side diagnostics for admin page rendering.
 * Monitors for blank page conditions and logs to console.
 * Add this to the admin layout to detect rendering failures.
 */
export default function AdminDiagnostics() {
  const pathname = usePathname()

  useEffect(() => {
    console.log(`[g1882-admin-diagnostics] Client hydrated: ${pathname}`)

    // Check for blank page after a short delay
    const timer = setTimeout(() => {
      const mainContent = document.querySelector('[class*="collection"]') ||
        document.querySelector('[class*="edit-view"]') ||
        document.querySelector('[class*="form"]') ||
        document.querySelector('form')

      if (!mainContent) {
        const bodyChildCount = document.body.children.length
        const documentTitle = document.title
        console.warn(`[g1882-admin-diagnostics] BLANK PAGE DETECTED at ${pathname}`, {
          bodyChildCount,
          bodyInnerHTML: document.body.innerHTML.substring(0, 500),
          documentTitle,
        })
        Sentry.captureMessage('Admin blank page detected', {
          level: 'warning',
          extra: { pathname, bodyChildCount, documentTitle },
        })

        // Check for React error overlay
        const errorOverlay = document.querySelector('[data-nextjs-dialog]') ||
          document.querySelector('#__next-build-error') ||
          document.querySelector('[class*="error"]')
        if (errorOverlay) {
          console.warn('[g1882-admin-diagnostics] Error overlay detected:', errorOverlay.textContent?.substring(0, 300))
          Sentry.captureMessage('Admin error overlay detected', {
            level: 'error',
            extra: { pathname, content: errorOverlay.textContent?.substring(0, 300) },
          })
        }
      } else {
        console.log(`[g1882-admin-diagnostics] Page rendered OK: ${pathname}`)
      }
    }, 3000)

    // Capture unhandled errors during this page
    const errorHandler = (event: ErrorEvent) => {
      console.error('[g1882-admin-diagnostics] Unhandled error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      })
      Sentry.captureException(event.error || new Error(event.message), {
        extra: { filename: event.filename, lineno: event.lineno, colno: event.colno },
      })
    }

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('[g1882-admin-diagnostics] Unhandled promise rejection:', {
        reason: event.reason,
        message: event.reason?.message,
        stack: event.reason?.stack,
      })
      Sentry.captureException(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      )
    }

    window.addEventListener('error', errorHandler)
    window.addEventListener('unhandledrejection', rejectionHandler)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('error', errorHandler)
      window.removeEventListener('unhandledrejection', rejectionHandler)
    }
  }, [pathname])

  return null
}
