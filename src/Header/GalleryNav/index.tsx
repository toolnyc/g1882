'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useNewsletterGate } from '@/providers/NewsletterGate/context'

export const NAV_ITEMS = [
  { label: 'Happenings', url: '/happenings' },
  { label: 'Artists', url: '/artists' },
  { label: 'Our Story', url: '/our-story' },
  { label: 'Visit', url: '/visit' },
] as const

interface GalleryNavProps {
  isOpen: boolean
  onToggle: () => void
}

export const GalleryNav: React.FC<GalleryNavProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname()
  const { shouldShowFullSite } = useNewsletterGate()

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
                isActive ? 'text-navy nav-link-active' : 'text-navy/70 hover:text-navy'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
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
    </>
  )
}
