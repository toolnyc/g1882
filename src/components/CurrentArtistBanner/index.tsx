'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LiveIndicator } from '../LiveIndicator'

interface Artist {
  id: string
  name: string
  bio: string
  image: string
  exhibitions: string[]
}

interface CurrentArtistBannerProps {
  artist: Artist
  exhibitionTitle?: string
}

export const CurrentArtistBanner: React.FC<CurrentArtistBannerProps> = ({
  artist,
  exhibitionTitle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="rounded-lg shadow-sm border border-bright-lake/10 p-6"
    >
      <div className="flex items-center gap-6">
        {/* Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden group">
            <Image
              src={artist.image}
              alt={`${artist.name}`}
              width={96}
              height={96}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <LiveIndicator size="sm" />
            <span className="caption text-lake">Currently Showing</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-1 truncate">{artist.name}</h2>
          {exhibitionTitle && (
            <p className="text-sm text-lake font-medium mb-2">{exhibitionTitle}</p>
          )}
          <p className="text-sm text-navy/80 line-clamp-2">{artist.bio}</p>
        </div>
      </div>
    </motion.div>
  )
}
