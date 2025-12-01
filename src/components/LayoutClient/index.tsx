'use client'

import React from 'react'
import { PageTransition } from '@/components/PageTransition'
import { PageLoadingIndicator } from '@/components/PageLoadingIndicator'

interface LayoutClientProps {
  children: React.ReactNode
}

export const LayoutClient: React.FC<LayoutClientProps> = ({ children }) => {
  return (
    <>
      <PageLoadingIndicator />
      <PageTransition>{children}</PageTransition>
    </>
  )
}

