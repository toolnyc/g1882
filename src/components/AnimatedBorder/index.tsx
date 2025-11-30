'use client'
import React from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface AnimatedBorderProps {
  delay?: number
  duration?: number
  className?: string
  mode?: 'onLoad' | 'onScroll'
  scrollRange?: [number, number]
  width?: MotionValue<string>
}

export const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  delay = 0.2,
  duration = 0.8,
  className = '',
  mode = 'onLoad',
  scrollRange = [0, 0.2],
  width: customWidth,
}) => {
  const { scrollYProgress } = useScroll()
  const scrollWidth = useTransform(scrollYProgress, scrollRange, ['0%', '100%'])

  if (mode === 'onScroll') {
    return (
      <motion.div
        className={`h-[2px] bg-bright-lake ${className}`}
        style={{ width: customWidth || scrollWidth }}
      />
    )
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      className={`h-[2px] bg-bright-lake ${className}`}
    />
  )
}
