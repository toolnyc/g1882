import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'
import { NewsletterForm } from './NewsletterForm'
import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-lake bg-navy">
      <div className="container py-12" style={{ color: '#fffbeb' }}>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Gallery Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-off-white">Gallery 1882</h3>
            <p className="mb-4 text-sm text-off-white">
              Contemporary art in the heart of the Indiana Dunes region.
            </p>
            <p className="text-sm text-off-white">
              123 Dune Drive
              <br />
              Chesterton, IN 46304
            </p>
          </div>

          {/* CMS Navigation Links */}
          {navItems.length > 0 && (
            <div>
              <h4 className="mb-4 font-bold text-off-white">Quick Links</h4>
              <nav className="space-y-2">
                {navItems.map((item, index) => (
                  <CMSLink
                    key={index}
                    {...item}
                    className="block text-sm hover:text-lake transition-colors"
                  />
                ))}
              </nav>
            </div>
          )}

          {/* Visit Info */}
          <div>
            <h4 className="mb-4 font-bold" style={{ color: '#fffbeb' }}>
              Visit
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-off-white">Wednesday - Sunday</p>
              <p className="text-off-white">10 AM - 6 PM</p>
              <p className="mt-4 text-off-white">Free Admission</p>
            </div>
          </div>

          {/* Contact */}

          <div>
            <h4 className="mb-4 font-bold" style={{ color: '#fffbeb' }}>
              Contact
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-off-white">(219) 555-0188</p>
              <p className="text-off-white">info@gallery1882.org</p>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-bold" style={{ color: '#fffbeb' }}>
              The Journal
            </h4>
            <div className="space-y-2 text-sm">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-lake/20 text-center text-sm">
          <p className="text-off-white">&copy; 2024 Gallery 1882. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
