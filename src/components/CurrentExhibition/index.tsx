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

interface CurrentExhibitionProps {
  exhibition: Exhibition
}

export const CurrentExhibition: React.FC<CurrentExhibitionProps> = ({ exhibition }) => {
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
      className="grid gap-12 lg:grid-cols-2 lg:items-center"
    >
      {/* Image */}
      <div className="order-2 lg:order-1">
        <div className="gallery-card overflow-hidden">
          <Image
            src={exhibition.image}
            alt={`${exhibition.title} by ${exhibition.artist}`}
            width={400}
            height={500}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>

      {/* Content */}
      <div className="order-1 lg:order-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="caption text-lake mb-4">Current Exhibition</div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{exhibition.title}</h2>
          <p className="mb-6 text-xl font-medium text-lake">{exhibition.artist}</p>
          <p className="mb-6 text-lg leading-relaxed">{exhibition.description}</p>
          <div className="mb-8 text-sm text-forest">
            <p>
              {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href={`/exhibitions/${exhibition.id}`} className="gallery-button-primary">
              View Exhibition
            </a>
            <a href="/visit" className="gallery-button-secondary">
              Plan Your Visit
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
