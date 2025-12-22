'use client'

import { useNewsletterGate } from '@/providers/NewsletterGate/context'

interface FooterClientWrapperProps {
  children: React.ReactNode
}

export const FooterClientWrapper: React.FC<FooterClientWrapperProps> = ({ children }) => {
  const { shouldShowFullSite } = useNewsletterGate()

  // Hide footer when gate is active and user shouldn't see full site
  if (!shouldShowFullSite) {
    return null
  }

  return <>{children}</>
}
