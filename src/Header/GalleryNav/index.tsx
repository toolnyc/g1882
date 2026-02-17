'use client'
import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useNewsletterGate } from '@/providers/NewsletterGate/context'
import { useFocusTrap } from '@/hooks/useFocusTrap'

// Static navigation items - always show these three
const NAV_ITEMS = [
  { label: 'Happenings', url: '/happenings' },
  { label: 'Artists', url: '/artists' },
  { label: 'Visit', url: '/visit' },
] as const

export const GalleryNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { shouldShowFullSite } = useNewsletterGate()
  const menuRef = useFocusTrap(isOpen)

  const closeMenu = useCallback(() => setIsOpen(false), [])

  // Close menu on Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeMenu])

  // Hide navigation when gate is active and user shouldn't see full site
  if (!shouldShowFullSite) {
    return null
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.url || pathname.startsWith(item.url + '/')
          return (
            <Link
              key={item.url}
              href={item.url}
              className={`nav-link text-lg font-medium transition-all duration-300 relative ${
                isActive ? 'text-navy font-semibold' : 'text-navy/70 font-medium hover:text-navy'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-lake rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
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
            ref={menuRef}
            role="dialog"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white/20 backdrop-blur-md border-t border-white/30 md:hidden"
          >
            <nav className="container py-4 space-y-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.url
                return (
                  <div key={item.url} onClick={closeMenu}>
                    <Link
                      href={item.url}
                      className={`nav-link block text-lg font-medium transition-all duration-300 py-1 hover:bg-white/20 hover:px-3 hover:rounded ${
                        isActive ? 'text-lake font-semibold border-l-2 border-lake pl-3' : 'text-navy/70 hover:text-navy'
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
