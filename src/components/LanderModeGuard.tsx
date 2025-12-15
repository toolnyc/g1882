'use client'

import { useNewsletterGate } from '@/providers/NewsletterGate/context'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const LanderModeGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isInLanderMode } = useNewsletterGate()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // If in lander mode and not on homepage, redirect to homepage
    if (isInLanderMode && pathname !== '/') {
      router.push('/')
    }
  }, [isInLanderMode, pathname, router])

  return <>{children}</>
}
