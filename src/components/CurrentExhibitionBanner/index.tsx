'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { LiveIndicator } from '../LiveIndicator'
import { CategoryTag } from '@/components/CategoryTag'

interface Exhibition {
  id: string
  title: string
  artist: string
  startDate: string
  endDate: string
  description: string
  image: string
  featured: boolean
  category?: string | null
}

interface CurrentExhibitionBannerProps {
  exhibition: Exhibition
}

export const CurrentExhibitionBanner: React.FC<CurrentExhibitionBannerProps> = ({ exhibition }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-lg shadow-sm border border-bright-lake/10 overflow-hidden flex"
    >
      {/* Image */}
      <div className="flex-shrink-0">
        <div className="w-32 h-full overflow-hidden group">
          <Image
            src={exhibition.image}
            alt={`${exhibition.title} by ${exhibition.artist}`}
            width={128}
            height={128}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-6">
        <div className="flex items-center gap-3 mb-2">
          <LiveIndicator size="sm" />
          <span className="caption text-lake">On Now</span>
          {exhibition.category && <CategoryTag category={exhibition.category} />}
        </div>
        <h2 className="text-2xl font-bold text-navy mb-1 truncate">{exhibition.title}</h2>
        <p className="text-sm text-navy/70 mb-2">by {exhibition.artist}</p>
        <p className="text-sm text-navy/80 line-clamp-2">{exhibition.description}</p>
      </div>
    </motion.div>
  )
}
