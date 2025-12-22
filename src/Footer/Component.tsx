import { getCachedSpace } from '@/utilities/getSpace'
import Link from 'next/link'
import React from 'react'

import { NewsletterForm } from './NewsletterForm'
import { FooterClientWrapper } from './Component.client'

// Static sitemap links
const SITEMAP_LINKS = [
  { label: 'Home', url: '/' },
  { label: 'Happenings', url: '/happenings' },
  { label: 'Artists', url: '/artists' },
  { label: 'Visit', url: '/visit' },
  { label: 'Journal', url: '/journal' },
] as const

export async function Footer() {
  const space = await getCachedSpace()()

  return (
    <FooterClientWrapper>
      <footer className="relative z-40 mt-auto border-t border-lake bg-navy min-h-0">
        <div className="container py-12 text-off-white">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Gallery Info */}
            <div>
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
            <div>
              <h4 className="mb-4 font-bold text-off-white">Sitemap</h4>
              <nav className="space-y-2">
                {SITEMAP_LINKS.map((item) => (
                  <Link
                    key={item.url}
                    href={item.url}
                    className="block text-sm hover:text-lake text-off-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Visit Info */}
            <div>
              <h4 className="mb-4 font-bold text-off-white">Visit</h4>
              <div className="space-y-2 text-sm">
                {space?.hours ? (
                  space.hours.split(',').map((line: string, i: number) => (
                    <p key={i} className="text-off-white">
                      {line.trim()}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="text-off-white">Wednesday - Sunday</p>
                    <p className="text-off-white">10 AM - 6 PM</p>
                  </>
                )}
                {space?.admission && <p className="mt-4 text-off-white">{space.admission}</p>}
              </div>
            </div>

            {/* Contact */}
            <div>
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
            <div>
              <h4 className="mb-4 font-bold text-off-white">The Journal</h4>
              <div className="space-y-2 text-sm">
                <NewsletterForm />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-lake/20 text-center text-sm">
            <p className="text-off-white">
              &copy; {new Date().getFullYear()} Gallery 1882. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </FooterClientWrapper>
  )
}
