'use client'

import React from 'react'
import { Toaster } from 'sonner'

import { HeaderThemeProvider } from './HeaderTheme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <HeaderThemeProvider>
      {children}
      <Toaster position="top-center" richColors />
    </HeaderThemeProvider>
  )
}
