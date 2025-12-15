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

  // Don't render modal on admin routes or before hydration
  if (isAdminRoute || !isReady) {
    return <>{children}</>
  }

  const showModal =
    !hasSignedUp &&
    process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER_GATE === 'true'

  return (
    <NewsletterGateContext.Provider value={{ hasSignedUp, markAsSignedUp }}>
      {children}
      {showModal && <NewsletterGateModal />}
    </NewsletterGateContext.Provider>
  )
}
