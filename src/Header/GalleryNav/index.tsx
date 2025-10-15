'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navigationItems = [
  { label: 'Exhibitions', href: '/exhibitions' },
  { label: 'Visit', href: '/visit' },
  { label: 'Artists', href: '/artists' },
]

export const GalleryNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-lg font-medium transition-colors hover:text-lake ${
              pathname === item.href ? 'text-lake' : 'text-navy'
            }`}
          >
            {item.label}
          </Link>
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
            className="absolute top-full left-0 right-0 bg-off-white border-t border-lake md:hidden"
          >
            <nav className="container py-4 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-medium transition-colors hover:text-lake ${
                    pathname === item.href ? 'text-lake' : 'text-navy'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
