'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Happening {
  id?: string
  slug?: string | null
  title?: string | null
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

export const UpcomingHappenings: React.FC<UpcomingHappeningsProps> = ({ happenings }) => {
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

  const getButtonText = (happening: Happening) => {
    const category = happening.category?.toLowerCase() || ''
    if (category.includes('exhibition')) {
      return 'View Exhibition'
    }
    if (category.includes('event')) {
      return 'View Event'
    }
    return 'View Happening'
  }

  // Show only the 3 most upcoming happenings
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
            {sortedHappenings.map((happening, index) => (
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
                          {formatDate(happening.startDate)}
                        </div>
                        <div className="text-sm font-semibold text-off-white/80 uppercase tracking-wide">
                          {happening.endDate ? 'Event' : 'Opening'}
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
                          {getFeaturedPersonName(happening) && (
                            <p className="text-xl font-semibold text-bright-lake mb-4">
                              {getFeaturedPersonName(happening)}
                            </p>
                          )}
                        </div>

                        {happening.description && (
                          <p className="text-lg leading-relaxed text-off-white/80 max-w-3xl">
                            {typeof happening.description === 'string'
                              ? happening.description
                              : 'View details for more information.'}
                          </p>
                        )}

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
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
