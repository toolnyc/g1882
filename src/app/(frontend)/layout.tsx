import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBarIsland } from '@/components/AdminBarIsland'
import { CustomCursor } from '@/components/CustomCursor'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { CookieConsent } from '@/components/CookieConsent'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { LayoutClient } from '@/components/LayoutClient'
import { LanderModeGuard } from '@/components/LanderModeGuard'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getOrganizationSchema } from '@/utilities/jsonLd'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const homeData = await getCachedGlobal('home', 0)()

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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-navy focus:text-off-white focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-lake"
        >
          Skip to main content
        </a>
        <Providers
          popupHeadline={homeData?.popupHeadline}
          popupDescription={homeData?.popupDescription}
          popupButtonText={homeData?.popupButtonText}
          popupSuccessMessage={homeData?.popupSuccessMessage}
        >
          <LanderModeGuard>
            <CustomCursor />
            <React.Suspense fallback={null}>
              <AdminBarIsland />
            </React.Suspense>
            <LayoutClient>
              <div id="main-content" className="flex flex-1 flex-col">
                <Header />
                {children}
                <Footer />
              </div>
            </LayoutClient>
          </LanderModeGuard>
          <CookieConsent />
          <AccessibilityWidget />
        </Providers>
        <Analytics />
        <SpeedInsights />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }} />
</body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  title: {
    template: '%s | Gallery 1882',
    default: 'Gallery 1882 — Contemporary Art in Chesterton, IN',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@gallery1882',
  },
}
