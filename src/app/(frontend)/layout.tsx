import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { CustomCursor } from '@/components/CustomCursor'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { LayoutClient } from '@/components/LayoutClient'
import { LanderModeGuard } from '@/components/LanderModeGuard'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getAuthStatus } from '@/utilities/getAuthStatus'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const { isAuthenticated } = await getAuthStatus()

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
      data-theme="light"
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://customer-dz4f40f4nnmmdd6e.cloudflarestream.com" />
        <link rel="preconnect" href="https://iframe.cloudflarestream.com" />
      </head>
      <body>
        <Providers isAdmin={isAuthenticated}>
          <LanderModeGuard>
            <CustomCursor />
            {(isEnabled || isAuthenticated) && (
              <div className="fixed top-0 left-0 right-0 z-[100]">
                <AdminBar
                  adminBarProps={{
                    preview: isEnabled,
                  }}
                />
              </div>
            )}
            <LayoutClient>
              <div>
                <Header />
                {children}
                <Footer />
              </div>
            </LayoutClient>
          </LanderModeGuard>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
