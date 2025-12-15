'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NewsletterGateContext } from './context'
import { NewsletterGateModal } from '@/components/NewsletterGateModal'
import { checkNewsletterSignupStatus, setNewsletterSignupStatus } from '@/utilities/newsletterGate'

export function NewsletterGateProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [hasSignedUp, setHasSignedUp] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Check if on admin route
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/api')

  // Check signup status on mount (hydration-safe)
  useEffect(() => {
    const status = checkNewsletterSignupStatus()
    setHasSignedUp(status)
    setIsReady(true)
  }, [])

  const markAsSignedUp = () => {
    setNewsletterSignupStatus()
    setHasSignedUp(true)
  }

  const gateEnabled = process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER_GATE === 'true'

  // Don't show gate features on admin routes or before hydration
  const shouldBypassGate = isAdminRoute || !isReady
  const isInLanderMode = !shouldBypassGate && hasSignedUp && gateEnabled
  const showModal = !shouldBypassGate && !hasSignedUp && gateEnabled

  return (
    <NewsletterGateContext.Provider value={{ hasSignedUp, markAsSignedUp, isInLanderMode }}>
      {children}
      {showModal && <NewsletterGateModal />}
    </NewsletterGateContext.Provider>
  )
}
