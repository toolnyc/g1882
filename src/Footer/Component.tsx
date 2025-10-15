import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-lake bg-navy text-off-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Gallery Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Gallery 1882</h3>
            <p className="mb-4 text-sm leading-relaxed">
              Contemporary art in the heart of the Indiana Dunes region.
            </p>
            <p className="text-sm">
              123 Dune Drive
              <br />
              Chesterton, IN 46304
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-bold">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/exhibitions" className="block text-sm hover:text-lake transition-colors">
                Exhibitions
              </Link>
              <Link href="/artists" className="block text-sm hover:text-lake transition-colors">
                Artists
              </Link>
              <Link href="/visit" className="block text-sm hover:text-lake transition-colors">
                Visit
              </Link>
              <Link href="/press" className="block text-sm hover:text-lake transition-colors">
                Press
              </Link>
            </nav>
          </div>

          {/* Visit Info */}
          <div>
            <h4 className="mb-4 font-bold">Visit</h4>
            <div className="space-y-2 text-sm">
              <p>Wednesday - Sunday</p>
              <p>10 AM - 6 PM</p>
              <p className="mt-4">Free Admission</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-bold">Contact</h4>
            <div className="space-y-2 text-sm">
              <p>(219) 555-0188</p>
              <p>info@gallery1882.org</p>
              <div className="mt-4">
                <ThemeSelector />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-lake/20 text-center text-sm">
          <p>&copy; 2024 Gallery 1882. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
