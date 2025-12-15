'use client'

import { createContext, useContext } from 'react'

interface NewsletterGateContextType {
  hasSignedUp: boolean
  markAsSignedUp: () => void
  isInLanderMode: boolean
}

export const NewsletterGateContext = createContext<NewsletterGateContextType | null>(null)

export function useNewsletterGate() {
  const context = useContext(NewsletterGateContext)
  if (!context) {
    throw new Error('useNewsletterGate must be used within NewsletterGateProvider')
  }
  return context
}
