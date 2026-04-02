'use client'

import { useEffect } from 'react'

/**
 * Third-party accessibility widget loader.
 * Loads UserWay (or similar) asynchronously when NEXT_PUBLIC_ACCESSIBILITY_WIDGET_ID is set.
 * Renders nothing if no widget ID is configured.
 *
 * TODO: Run full Lighthouse + axe-core WCAG AA audit on all public pages before launch.
 */
export function AccessibilityWidget() {
  const widgetId = process.env.NEXT_PUBLIC_ACCESSIBILITY_WIDGET_ID

  useEffect(() => {
    if (!widgetId) return

    // Avoid loading the script twice
    if (document.getElementById('accessibility-widget-script')) return

    const script = document.createElement('script')
    script.id = 'accessibility-widget-script'
    script.src = `https://cdn.userway.org/widget.js`
    script.async = true
    script.dataset.account = widgetId
    document.body.appendChild(script)

    return () => {
      const existing = document.getElementById('accessibility-widget-script')
      if (existing) existing.remove()
    }
  }, [widgetId])

  if (!widgetId) return null

  return null
}
