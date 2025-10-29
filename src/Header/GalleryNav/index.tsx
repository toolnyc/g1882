'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export const GalleryNav: React.FC<{ data: Header }> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Add this debug logging
  console.log('GalleryNav received data:', JSON.stringify(data, null, 2))
  console.log('navItems:', data?.navItems)

  // Use Payload navigation data, fallback to default if none
  const navigationItems = [
    { link: { label: 'Exhibitions', url: '/exhibitions' } },
    { link: { label: 'Visit', url: '/visit' } },
    { link: { label: 'Artists', url: '/artists' } },
  ]

  console.log('Final navigationItems:', navigationItems)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navigationItems.map((item, index) => (
          <CMSLink
            key={index}
            {...item.link}
            className={`nav-link text-lg font-medium transition-all duration-300 hover:bg-white/20 hover:px-3 hover:py-1 hover:rounded ${
              pathname === item.link?.url ? 'text-lake font-semibold' : 'text-navy font-medium'
            }`}
          />
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
        aria-label="Toggle menu"
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
          className="w-6 h-0.5 bg-navy"
        />
        <motion.span animate={{ opacity: isOpen ? 0 : 1 }} className="w-6 h-0.5 bg-navy" />
        <motion.span
          animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
          className="w-6 h-0.5 bg-navy"
        />
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white/20 backdrop-blur-md border-t border-white/30 md:hidden"
          >
            <nav className="container py-4 space-y-4">
              {navigationItems.map((item, index) => (
                <div key={index} onClick={() => setIsOpen(false)}>
                  <CMSLink
                    {...item.link}
                    className={`nav-link block text-lg font-medium transition-all duration-300 hover:bg-white/20 hover:px-3 hover:py-1 hover:rounded ${
                      pathname === item.link?.url ? 'text-lake' : 'text-navy'
                    }`}
                  />
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
