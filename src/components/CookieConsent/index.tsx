'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

function getCookieConsent(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/)
  return match ? match[1] : null
}

function setCookieConsent(value: 'accepted' | 'declined') {
  const oneYear = new Date()
  oneYear.setFullYear(oneYear.getFullYear() + 1)
  document.cookie = `cookie_consent=${value}; expires=${oneYear.toUTCString()}; path=/; SameSite=Lax; Secure`
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show if no choice has been made
    if (!getCookieConsent()) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const handleAccept = () => {
    setCookieConsent('accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    setCookieConsent('declined')
    setVisible(false)
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-navy text-off-white p-4 sm:p-6 shadow-lg"
    >
      <div className="container flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="flex-1 text-sm">
          We use cookies to improve your experience. See our{' '}
          <Link href="/privacy" className="text-lake underline hover:text-bright-lake">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/cookies" className="text-lake underline hover:text-bright-lake">
            Cookie Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium border border-off-white/30 rounded-[3px] hover:bg-off-white/10 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium bg-lake text-off-white rounded-[3px] hover:bg-bright-lake transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
