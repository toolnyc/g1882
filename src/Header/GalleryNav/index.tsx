'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Static navigation items - always show these three
const NAV_ITEMS = [
  { label: 'Happenings', url: '/happenings' },
  { label: 'Artists', url: '/artists' },
  { label: 'Visit', url: '/visit' },
] as const

export const GalleryNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const gateEnabled = process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER_GATE === 'true'

  // Hide navigation when gate is active
  if (gateEnabled) {
    return null
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.url
          return (
            <Link
              key={item.url}
              href={item.url}
              className={`nav-link text-lg font-medium transition-all duration-300 hover:bg-white/20 hover:px-3 hover:py-1 hover:rounded ${
                isActive ? 'text-lake font-semibold' : 'text-navy font-medium'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
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
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.url
                return (
                  <div key={item.url} onClick={() => setIsOpen(false)}>
                    <Link
                      href={item.url}
                      className={`nav-link block text-lg font-medium transition-all duration-300 hover:bg-white/20 hover:px-3 hover:py-1 hover:rounded ${
                        isActive ? 'text-lake' : 'text-navy'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </div>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
