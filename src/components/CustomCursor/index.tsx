'use client'
import React, { useEffect, useRef, useState } from 'react'

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, [data-clickable]'

    let frameId: number | null = null

    const updateCursorPosition = (event: PointerEvent) => {
      if (frameId) window.cancelAnimationFrame(frameId)

      frameId = window.requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${event.clientX - 12}px, ${
            event.clientY - 12
          }px)`
        }
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

    window.addEventListener('pointermove', updateCursorPosition, { passive: true })
    document.addEventListener('pointerover', handlePointerOver, true)
    document.addEventListener('pointerout', handlePointerOut, true)
    document.addEventListener('visibilitychange', resetHoverState)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', updateCursorPosition)
      document.removeEventListener('pointerover', handlePointerOver, true)
      document.removeEventListener('pointerout', handlePointerOut, true)
      document.removeEventListener('visibilitychange', resetHoverState)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[99999] transition-transform duration-150 ease-out"
      style={{ willChange: 'transform', transform: 'translate(-9999px, -9999px)' }}
    >
      <div
        className={`rounded-full bg-bright-lake w-6 h-6 transition-transform duration-150 ease-out ${
          isHovering ? 'scale-125' : 'scale-100'
        }`}
      />
    </div>
  )
}
