'use client'
import React from 'react'
import { motion } from 'framer-motion'

export interface LiveIndicatorProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  colorClassName?: string // e.g. 'bg-forest'
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  size = 'sm',
  className = '',
  colorClassName = 'bg-forest',
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  return (
    <motion.div
      className={`inline-block rounded-full ${colorClassName} ${sizeClasses[size]} ${className}`}
      aria-label="Live indicator"
      role="status"
      animate={{
        scale: [1, 1.4, 1],
        opacity: [1, 0.6, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
