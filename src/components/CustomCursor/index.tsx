'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, [data-clickable]'

    let frameId: number | null = null

    const updateMousePosition = (event: PointerEvent) => {
      if (frameId) window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
        setMousePosition({ x: event.clientX, y: event.clientY })
      })
    }

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (target?.closest(interactiveSelector)) {
        setIsHovering(true)
      }
    }

    const handlePointerOut = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (target?.closest(interactiveSelector)) {
        setIsHovering(false)
      }
    }

    const resetHoverState = () => setIsHovering(false)

    window.addEventListener('pointermove', updateMousePosition, { passive: true })
    document.addEventListener('pointerover', handlePointerOver, true)
    document.addEventListener('pointerout', handlePointerOut, true)
    document.addEventListener('visibilitychange', resetHoverState)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', updateMousePosition)
      document.removeEventListener('pointerover', handlePointerOver, true)
      document.removeEventListener('pointerout', handlePointerOut, true)
      document.removeEventListener('visibilitychange', resetHoverState)
    }
  }, [])

  return (
    <motion.div
      className="fixed pointer-events-none z-[99999]"
      style={{ willChange: 'transform' }}
      animate={{
        x: mousePosition.x - (isHovering ? 8 : 6),
        y: mousePosition.y - (isHovering ? 8 : 6),
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 25,
        mass: 0.5,
      }}
    >
      <motion.div
        className={`rounded-full bg-bright-lake w-6 h-6`}
        animate={{
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      />
    </motion.div>
  )
}
