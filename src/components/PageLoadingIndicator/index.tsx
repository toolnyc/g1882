'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, Suspense } from 'react'

const PageLoadingIndicatorInner = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const loadingStartTime = useRef<number | null>(null)

  useEffect(() => {
    // Reset loading state when route changes, but ensure minimum display time
    if (isLoading && loadingStartTime.current) {
      const elapsed = Date.now() - loadingStartTime.current
      const remaining = Math.max(0, 400 - elapsed) // Minimum 400ms display time

      const timer = setTimeout(() => {
        setIsLoading(false)
        loadingStartTime.current = null
      }, remaining)

      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Listen for clicks on links to show loading state
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (
        link &&
        link.href &&
        !link.href.startsWith('#') &&
        link.href.startsWith(window.location.origin)
      ) {
        // Only show loading for internal navigation
        const href = link.getAttribute('href')
        if (href && !href.startsWith('#') && href !== pathname) {
          setIsLoading(true)
          loadingStartTime.current = Date.now()
        }
      }
    }

    document.addEventListener('click', handleLinkClick, true)
    return () => document.removeEventListener('click', handleLinkClick, true)
  }, [pathname])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2px]"
        >
          <motion.div
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{
              scaleX: [0, 0.4, 0.7, 0.85],
            }}
            transition={{
              duration: 3,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.3, 0.6, 1],
            }}
            className="h-full w-full bg-gradient-to-r from-lake to-bright-lake"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const PageLoadingIndicator = () => {
  return (
    <Suspense fallback={null}>
      <PageLoadingIndicatorInner />
    </Suspense>
  )
}
