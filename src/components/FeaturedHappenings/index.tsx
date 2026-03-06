'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LiveIndicator } from '../LiveIndicator'
import { formatHappeningDateParts, type DateDisplayMode } from '@/utilities/dateHelpers'
import { resolveHappeningType } from '@/utilities/happeningTypeHelpers'

interface Artist {
  id?: string
  name?: string | null
  slug?: string | null
}

interface Happening {
  id?: string
  slug?: string | null
  title?: string | null
  type?: { name?: string | null; slug?: string | null; dateDisplayMode?: string | null } | string | null
  artists?: (Artist | string)[] | null
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
  const getDateParts = (happening: Happening) => {
    if (!happening.startDate) return { date: '', time: null, endDate: null }
    const happeningType = resolveHappeningType(happening.type)
    const mode: DateDisplayMode = (happeningType?.dateDisplayMode as DateDisplayMode) || 'datetime'
    return formatHappeningDateParts(happening.startDate, happening.endDate, mode)
  }

  const getArtistNames = (happening: Happening): string => {
    if (happening.artists && happening.artists.length > 0) {
      return happening.artists
        .map((a) => {
          if (typeof a === 'object' && a?.name) return a.name
          return null
        })
        .filter(Boolean)
        .join(', ')
    }
    return ''
  }

  const getImageUrl = (happening: Happening) => {
    if (typeof happening.heroImage === 'object' && happening.heroImage?.url) {
      return happening.heroImage.url
    }
    if (typeof happening.heroImage === 'string' && happening.heroImage) {
      return happening.heroImage
    }
    return '/media/test-art.jpg'
  }

  const getImageAlt = (happening: Happening) => {
    if (typeof happening.heroImage === 'object' && happening.heroImage?.alt) {
      return happening.heroImage.alt
    }
    return `${happening.title || 'Happening'}${getArtistNames(happening) ? ` by ${getArtistNames(happening)}` : ''}`
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
                  {getArtistNames(happening) && (
                    <p className="text-sm text-navy/70 mb-2">
                      {getArtistNames(happening)}
                    </p>
                  )}
                  {happening.startDate && (() => {
                    const parts = getDateParts(happening)
                    return parts.date ? (
                      <div className="flex flex-col gap-0.5">
                        {parts.endDate ? (
                          <>
                            <span className="text-xs font-medium text-navy/70">{parts.date} – {parts.endDate}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-medium text-navy/70">{parts.date}</span>
                            {parts.time && (
                              <span className="text-xs text-navy/45">{parts.time}</span>
                            )}
                          </>
                        )}
                      </div>
                    ) : null
                  })()}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

