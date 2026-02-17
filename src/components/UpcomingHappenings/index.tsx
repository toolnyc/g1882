'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatHappeningDate, type DateDisplayMode } from '@/utilities/dateHelpers'

interface Artist {
  id?: string
  name?: string | null
  slug?: string | null
}

interface HappeningType {
  name?: string | null
  slug?: string | null
  dateDisplayMode?: string | null
}

interface Happening {
  id?: string
  slug?: string | null
  title?: string | null
  type?: HappeningType | string | null
  artists?: (Artist | string)[] | null
  featuredPerson?: { name?: string | null } | string | null
  featuredPersonName?: string | null
  startDate?: string | Date | null
  endDate?: string | Date | null
  description?: string | { root?: { type?: string; text?: string; children?: unknown[] } } | null
  featured?: boolean
  category?: string | null
}

interface UpcomingHappeningsProps {
  happenings: Happening[]
}

const resolveType = (type: Happening['type']): HappeningType | null => {
  if (typeof type === 'object' && type !== null && 'name' in type) {
    return type as HappeningType
  }
  return null
}

export const UpcomingHappenings: React.FC<UpcomingHappeningsProps> = ({ happenings }) => {
  const formatDateDisplay = (happening: Happening) => {
    if (!happening.startDate) return ''
    const happeningType = resolveType(happening.type)
    const mode: DateDisplayMode = (happeningType?.dateDisplayMode as DateDisplayMode) || 'datetime'
    return formatHappeningDate(happening.startDate, happening.endDate, mode)
  }

  const getArtistNames = (happening: Happening): { name: string; slug?: string | null }[] => {
    if (happening.artists && happening.artists.length > 0) {
      return happening.artists
        .map((a) => {
          if (typeof a === 'object' && a?.name) return { name: a.name, slug: a.slug }
          return null
        })
        .filter(Boolean) as { name: string; slug?: string | null }[]
    }
    if (typeof happening.featuredPerson === 'object' && happening.featuredPerson?.name) {
      return [{ name: happening.featuredPerson.name }]
    }
    if (happening.featuredPersonName) {
      return [{ name: happening.featuredPersonName }]
    }
    return []
  }

  const getButtonText = (happening: Happening) => {
    const happeningType = resolveType(happening.type)
    if (happeningType?.name) return `View ${happeningType.name}`
    const category = happening.category?.toLowerCase() || ''
    if (category.includes('exhibition')) return 'View Exhibition'
    if (category.includes('event')) return 'View Event'
    return 'View Happening'
  }

  const getTypeLabel = (happening: Happening) => {
    const happeningType = resolveType(happening.type)
    if (happeningType?.name) return happeningType.name
    return 'Happening'
  }

  // Sort upcoming happenings chronologically (ascending)
  const sortedHappenings = [...happenings]
    .sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate as string).getTime() : 0
      const dateB = b.startDate ? new Date(b.startDate as string).getTime() : 0
      return dateA - dateB
    })
    .slice(0, 3)

  if (sortedHappenings.length === 0) {
    return null
  }

  return (
    <section className="py-32 bg-navy gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-20 text-center">
            <div className="caption text-bright-lake mb-6">Upcoming</div>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-off-white">
              What&apos;s Happening?
            </h2>
          </div>

          {/* Full-width List Layout */}
          <div className="w-full">
            {sortedHappenings.map((happening, index) => {
              const artists = getArtistNames(happening)

              return (
                <motion.div
                  key={happening.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="border-b border-bright-lake py-12 hover:scale-105 transition-all duration-500">
                    <div className="grid grid-cols-12 gap-8 items-start">
                      {/* Date Section - Prominent */}
                      {happening.startDate && (
                        <div className="col-span-12 lg:col-span-3">
                          <div className="text-3xl lg:text-4xl font-bold text-off-white mb-2 leading-tight">
                            {formatDateDisplay(happening)}
                          </div>
                          <div className="text-sm font-semibold text-off-white/80 tracking-wide">
                            {getTypeLabel(happening)}
                          </div>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="col-span-12 lg:col-span-9">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-off-white mb-3 leading-tight">
                              {happening.title}
                            </h3>
                            {artists.length > 0 && (
                              <div className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
                                {artists.map((artist, i) => (
                                  <React.Fragment key={artist.slug || i}>
                                    {i > 0 && (
                                      <span className="text-xl text-bright-lake">,</span>
                                    )}
                                    {artist.slug ? (
                                      <Link
                                        href={`/artists/${artist.slug}`}
                                        className="text-xl font-semibold text-bright-lake hover:text-lake transition-colors"
                                      >
                                        {artist.name}
                                      </Link>
                                    ) : (
                                      <span className="text-xl font-semibold text-bright-lake">
                                        {artist.name}
                                      </span>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Link */}
                          {happening.slug && (
                            <div className="pt-2">
                              <Link
                                href={`/happenings/${happening.slug}`}
                                className="inline-flex items-center text-lg font-semibold text-bright-lake hover:text-lake transition-colors duration-200 group/link"
                              >
                                {getButtonText(happening)}
                                <svg
                                  className="ml-2 w-5 h-5 transform group-hover/link:translate-x-1 transition-transform duration-200"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
