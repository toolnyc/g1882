import { getCachedSpace } from '@/utilities/getSpace'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import type { Visit } from '@/payload-types'

import { NewsletterForm } from './NewsletterForm'
import { FooterClientWrapper } from './Component.client'

// Static sitemap links
const SITEMAP_LINKS = [
  { label: 'Home', url: '/' },
  { label: 'Happenings', url: '/happenings' },
  { label: 'Artists', url: '/artists' },
  { label: 'Visit', url: '/visit' },
  { label: 'News', url: '/journal' },
  { label: 'Gallery Space', url: '/space' },
] as const

export async function Footer() {
  const space = await getCachedSpace()()
  const visit = (await getCachedGlobal('visit', 1)()) as Visit

  // Pull hours from Visit global's regularHours, fall back to Space global
  const regularHours = visit?.hours?.regularHours && visit.hours.regularHours.length > 0
    ? visit.hours.regularHours
    : null

  return (
    <FooterClientWrapper>
      <footer className="relative z-40 mt-auto bg-navy min-h-0">
        {/* Decorative top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-warm-accent to-transparent" />
        <div className="container py-12 text-off-white">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-off-white/10">
            {/* Gallery Info */}
            <div className="lg:pr-6">
              <h3 className="mb-4 text-xl font-bold text-off-white">
                {space?.name || 'Gallery 1882'}
              </h3>
              <p className="mb-4 text-sm text-off-white">
                {space?.tagline || 'Contemporary art in the heart of the Indiana Dunes region.'}
              </p>
              {space?.address && (
                <p className="text-sm text-off-white">
                  {space.address.split(',').map((line: string, i: number, arr: string[]) => (
                    <React.Fragment key={i}>
                      {line.trim()}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              )}
            </div>

            {/* Sitemap Links */}
            <div className="lg:px-6">
              <h4 className="mb-4 font-bold text-off-white">Sitemap</h4>
              <nav className="space-y-2">
                {SITEMAP_LINKS.map((item) => (
                  <Link
                    key={item.url}
                    href={item.url}
                    className="block text-sm hover:text-warm-accent-light text-off-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Hours */}
            <div className="lg:px-6">
              <h4 className="mb-4 font-bold text-off-white">Our Hours</h4>
              <div className="space-y-2 text-sm">
                {regularHours ? (
                  regularHours.map((item, i: number) => (
                    <p key={i} className="text-off-white">
                      {item.day}: {item.hours}
                    </p>
                  ))
                ) : space?.hours ? (
                  space.hours.split(',').map((line: string, i: number) => (
                    <p key={i} className="text-off-white">
                      {line.trim()}
                    </p>
                  ))
                ) : null}
                {space?.admission && <p className="mt-4 text-off-white">{space.admission}</p>}
              </div>
            </div>

            {/* Contact */}
            <div className="lg:px-6">
              <h4 className="mb-4 font-bold text-off-white">Contact</h4>
              <div className="space-y-2 text-sm">
                {space?.phone && (
                  <p className="text-off-white">
                    <a href={`tel:${space.phone}`} className="hover:text-lake transition-colors">
                      {space.phone}
                    </a>
                  </p>
                )}
                {space?.email && (
                  <p className="text-off-white">
                    <a href={`mailto:${space.email}`} className="hover:text-lake transition-colors">
                      {space.email}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:pl-6">
              <h4 className="mb-4 font-bold text-off-white">News</h4>
              <div className="space-y-2 text-sm">
                <NewsletterForm />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-off-white/10 text-center text-sm">
            <p className="text-off-white">
              &copy; {new Date().getFullYear()} {space?.name || 'Gallery 1882'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </FooterClientWrapper>
  )
}
