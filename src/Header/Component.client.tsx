'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { GalleryNav, NAV_ITEMS } from './GalleryNav'
import { useFocusTrap } from '@/hooks/useFocusTrap'

export const HeaderClient: React.FC = () => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const menuRef = useFocusTrap(isOpen)

  const closeMenu = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    setHeaderTheme(null)
    setIsOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeMenu])

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY])

  const isGlassy = headerTheme === 'glassy' || pathname === '/'

  // Shared classes — both navbar strip and mobile menu use identical background
  const bgClasses = isGlassy ? 'bg-white/10 backdrop-blur-md' : 'bg-off-white'
  const borderClasses = isGlassy ? 'border-white/20' : 'border-navy/10'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Navbar strip */}
      <div className={`border-b ${bgClasses} ${borderClasses}`}>
        <div className="relative z-20 px-6 md:px-8">
          <div className="py-8 flex justify-between items-center tracking-tight">
            <Link href="/">
              <img
                src="/Word-Navy.svg"
                alt="Gallery 1882"
                width={80}
                height={50}
                className={`max-w-[60px] md:max-w-[80px] h-auto ${isGlassy ? 'mix-blend-difference' : ''}`}
              />
            </Link>
            <GalleryNav isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />
          </div>
        </div>
      </div>

      {/* Mobile menu — sibling of navbar strip, same bg classes, no stacking context issue */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-t md:hidden ${bgClasses} ${borderClasses}`}
          >
            <div className="container py-4 space-y-4" role="menu">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.url
                return (
                  <div key={item.url}>
                    <Link
                      href={item.url}
                      role="menuitem"
                      onClick={closeMenu}
                      className={`nav-link block text-lg font-medium transition-all duration-300 py-1 hover:bg-white/20 hover:px-3 hover:rounded ${
                        isActive
                          ? 'text-lake font-semibold border-l-2 border-lake pl-3'
                          : 'text-navy/70 hover:text-navy'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
