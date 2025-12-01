'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export const PageLoadingIndicator = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const loadingStartTime = useRef<number | null>(null)

  useEffect(() => {
    // Reset loading state when route changes, but ensure minimum display time
    if (isLoading && loadingStartTime.current) {
      const elapsed = Date.now() - loadingStartTime.current
      const remaining = Math.max(0, 500 - elapsed) // Minimum 500ms display time

      setTimeout(() => {
        setIsLoading(false)
        loadingStartTime.current = null
      }, remaining)
    } else {
      setIsLoading(false)
    }
  }, [pathname, searchParams])

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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-off-white/10 backdrop-blur-sm" />

          {/* Centered pulse animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.1, 1],
                opacity: [0, 1, 1],
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Pulsing glow */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full bg-bright-lake blur-xl"
                style={{ width: '75px', height: '75px', left: '-5px', top: '-5px' }}
              />

              {/* Center circle - simple blue */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-[50px] h-[50px] rounded-full bg-bright-lake flex items-center justify-center shadow-lg"
              >
                <motion.div
                  animate={{
                    scale: [1, 0.9, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-[25px] h-[25px] rounded-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
