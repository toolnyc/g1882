'use client'

import React, { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

import { HeaderThemeProvider } from './HeaderTheme'
import { NewsletterGateProvider } from './NewsletterGate'

function ScrollAwareToaster() {
  const [position, setPosition] = useState<'top-center' | 'bottom-center'>('top-center')

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // If user is within 500px of the bottom, show toast at top
      // Otherwise show at bottom to be visible when they're in the footer
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
      
      if (distanceFromBottom < 500) {
        setPosition('top-center')
      } else {
        setPosition('bottom-center')
      }
    }

    // Set initial position
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return <Toaster position={position} richColors />
}

export const Providers: React.FC<{
  children: React.ReactNode
  isAdmin?: boolean
}> = ({ children, isAdmin = false }) => {
  return (
    <HeaderThemeProvider>
      <NewsletterGateProvider isAdmin={isAdmin}>
        {children}
        <ScrollAwareToaster />
      </NewsletterGateProvider>
    </HeaderThemeProvider>
  )
}
