'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Exhibition {
  id: string
  title: string
  artist: string
  startDate: string
  endDate: string
  description: string
  image: string
  featured: boolean
}

interface UpcomingExhibitionsProps {
  exhibitions: Exhibition[]
}

export const UpcomingExhibitions: React.FC<UpcomingExhibitionsProps> = ({ exhibitions }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatOpeningDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Show only the 3 most recent exhibitions (latest startDates)
  const sortedExhibitions = [...exhibitions]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3)

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
              Future Exhibitions
            </h2>
          </div>

          {/* Full-width List Layout */}
          <div className="w-full">
            {sortedExhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="border-b border-bright-lake py-12 hover:scale-105 transition-all duration-500">
                  <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Date Section - Prominent */}
                    <div className="col-span-12 lg:col-span-3">
                      <div className="text-3xl lg:text-4xl font-bold text-off-white mb-2 leading-tight">
                        {formatOpeningDate(exhibition.startDate)}
                      </div>
                      <div className="text-sm font-semibold text-off-white/80 uppercase tracking-wide">
                        Opening
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="col-span-12 lg:col-span-9">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-off-white mb-3 leading-tight">
                            {exhibition.title}
                          </h3>
                          <p className="text-xl font-semibold text-bright-lake mb-4">
                            {exhibition.artist}
                          </p>
                        </div>

                        <p className="text-lg leading-relaxed text-off-white/80 max-w-3xl">
                          {exhibition.description}
                        </p>

                        {/* Action Link */}
                        <div className="pt-2">
                          <Link
                            href={`/exhibitions/${exhibition.id}`}
                            className="inline-flex items-center text-lg font-semibold text-bright-lake hover:text-lake transition-colors duration-200 group/link"
                          >
                            View Exhibition
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
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <Link href="/exhibitions" className="gallery-button-primary px-8 py-4 text-lg">
              View All Exhibitions
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
