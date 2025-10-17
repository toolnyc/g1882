'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <section className="py-32 bg-white gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-20 text-center">
            <div className="caption text-lake mb-6">Upcoming</div>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Future Exhibitions</h2>
          </div>

          {/* Asymmetrical Grid Layout */}
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
            {exhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="gallery-card mb-8 overflow-hidden">
                  <Image
                    src={exhibition.image}
                    alt={`${exhibition.title} by ${exhibition.artist}`}
                    width={400}
                    height={500}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight">{exhibition.title}</h3>
                  <p className="text-xl font-medium text-lake">{exhibition.artist}</p>
                  <p className="text-sm text-forest font-medium">
                    {formatDate(exhibition.startDate)} — {formatDate(exhibition.endDate)}
                  </p>
                  <p className="text-sm leading-relaxed text-navy/70">{exhibition.description}</p>
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
            <a href="/exhibitions" className="gallery-button-primary px-8 py-4 text-lg">
              View All Exhibitions
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
