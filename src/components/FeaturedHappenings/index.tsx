'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LiveIndicator } from '../LiveIndicator'

interface Happening {
  id?: string
  slug?: string | null
  title?: string | null
  featuredPerson?: { name?: string | null } | string | null
  featuredPersonName?: string | null
  startDate?: string | Date | null
  endDate?: string | Date | null
  description?: string | { root?: { type?: string; text?: string; children?: unknown[] } } | null
  heroImage?: { url?: string; alt?: string } | string | null
  featured?: boolean
  isActive?: boolean
}

interface FeaturedHappeningsProps {
  happenings: Happening[]
}

export const FeaturedHappenings: React.FC<FeaturedHappeningsProps> = ({ happenings }) => {
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getFeaturedPersonName = (happening: Happening) => {
    if (typeof happening.featuredPerson === 'object' && happening.featuredPerson?.name) {
      return happening.featuredPerson.name
    }
    return happening.featuredPersonName || ''
  }

  const getImageUrl = (happening: Happening) => {
    if (typeof happening.heroImage === 'object' && happening.heroImage?.url) {
      return happening.heroImage.url
    }
    if (typeof happening.heroImage === 'string') {
      return happening.heroImage
    }
    return '/media/test-art.jpg'
  }

  const getImageAlt = (happening: Happening) => {
    if (typeof happening.heroImage === 'object' && happening.heroImage?.alt) {
      return happening.heroImage.alt
    }
    return `${happening.title || 'Happening'}${getFeaturedPersonName(happening) ? ` by ${getFeaturedPersonName(happening)}` : ''}`
  }

  if (happenings.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="mb-12">
        <div className="caption text-bright-lake mb-4">Featured</div>
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-navy">
          Happening Now
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {happenings.map((happening, index) => (
          <motion.div
            key={happening.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <Link
              href={happening.slug ? `/happenings/${happening.slug}` : '#'}
              className="block rounded-lg shadow-sm border border-bright-lake/10 p-6 hover:border-bright-lake/30 transition-all duration-300"
            >
              <div className="flex items-center gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={getImageUrl(happening)}
                      alt={getImageAlt(happening)}
                      width={96}
                      height={96}
                      sizes="(max-width: 640px) 80px, 96px"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <LiveIndicator size="sm" />
                    <span className="caption text-lake">Featured</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-1 truncate group-hover:text-bright-lake transition-colors">
                    {happening.title}
                  </h3>
                  {getFeaturedPersonName(happening) && (
                    <p className="text-sm text-navy/70 mb-2">
                      {getFeaturedPersonName(happening)}
                    </p>
                  )}
                  {happening.startDate && (
                    <p className="text-xs text-navy/60">
                      {formatDate(happening.startDate)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

