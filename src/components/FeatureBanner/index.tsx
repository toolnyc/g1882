'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LiveIndicator } from '../LiveIndicator'

export interface FeatureBannerProps {
  image: string
  imageAlt?: string
  title: string
  subtitle?: string
  description?: string
  label?: string
  href?: string | null
  showLiveIndicator?: boolean
}

export const FeatureBanner: React.FC<FeatureBannerProps> = ({
  image,
  imageAlt,
  title,
  subtitle,
  description,
  label = 'Currently Showing',
  href,
  showLiveIndicator = true,
}) => {
  const content = (
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
              src={image}
              alt={imageAlt || title}
              width={96}
              height={96}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {showLiveIndicator && <LiveIndicator size="sm" />}
            <span className="caption text-lake">{label}</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-1 truncate">{title}</h2>
          {subtitle && (
            <p className="text-sm text-lake font-medium mb-2">{subtitle}</p>
          )}
          {description && (
            <p className="text-sm text-navy/80 line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}

