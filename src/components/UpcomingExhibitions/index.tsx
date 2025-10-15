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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="mb-12 text-center">
        <div className="caption text-lake mb-4">Upcoming</div>
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Future Exhibitions</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {exhibitions.map((exhibition, index) => (
          <motion.div
            key={exhibition.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="gallery-card mb-4 overflow-hidden">
              <Image
                src={exhibition.image}
                alt={`${exhibition.title} by ${exhibition.artist}`}
                width={400}
                height={500}
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">{exhibition.title}</h3>
              <p className="font-medium text-lake">{exhibition.artist}</p>
              <p className="text-sm text-forest">
                {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
              </p>
              <p className="text-sm leading-relaxed">{exhibition.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <a href="/exhibitions" className="gallery-button-primary">
          View All Exhibitions
        </a>
      </motion.div>
    </motion.div>
  )
}
