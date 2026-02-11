'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(false)
    const timer = setTimeout(() => setIsReady(true), 50)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

