'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const HappeningDetailSkeleton: React.FC = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-off-white"
    >
      <article className="pb-24">
        {/* Hero Image Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative w-full h-[60vh] min-h-[400px] mb-16 bg-navy/5 animate-pulse"
        />

        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Title and Artist Skeleton */}
            <div className="mb-8">
              <div className="h-16 bg-navy/10 animate-pulse rounded w-4/5 mb-4" />
              <div className="h-8 bg-lake/10 animate-pulse rounded w-2/5" />
            </div>

            {/* Date Skeleton */}
            <div className="mb-8 pb-8 border-b border-navy/10">
              <div className="h-5 bg-navy/8 animate-pulse rounded w-48" />
            </div>

            {/* Category Skeleton */}
            <div className="mb-8">
              <div className="h-6 bg-navy/8 animate-pulse rounded-tag w-24" />
            </div>

            {/* Description Skeleton */}
            <div className="mb-6 space-y-3">
              <div className="h-4 bg-navy/5 animate-pulse rounded w-full" />
              <div className="h-4 bg-navy/5 animate-pulse rounded w-full" />
              <div className="h-4 bg-navy/5 animate-pulse rounded w-5/6" />
              <div className="h-4 bg-navy/5 animate-pulse rounded w-4/5" />
            </div>

            {/* Calendar Button Skeleton */}
            <div className="mt-12 pt-8 border-t border-navy/10">
              <div className="h-12 bg-navy/8 animate-pulse rounded w-48" />
            </div>
          </motion.div>
        </div>
      </article>
    </motion.main>
  )
}
