'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LiveIndicator } from '../LiveIndicator'

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
    <section className="py-32 gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid gap-20 lg:grid-cols-12 lg:items-center"
        >
          {/* Image - Asymmetrical Layout */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="gallery-card overflow-hidden group"
            >
              <Image
                src={exhibition.image}
                alt={`${exhibition.title} by ${exhibition.artist}`}
                width={400}
                height={500}
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>

          {/* Content - Asymmetrical Layout */}
          <div className="lg:col-span-5 lg:col-start-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <LiveIndicator size="sm" />
                <div className="caption text-lake flex items-center">On Now</div>
              </div>
              <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
                {exhibition.title}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-navy/80">{exhibition.description}</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={`/exhibitions/${exhibition.id}`}
                  className="gallery-button-primary px-8 py-4 text-lg"
                >
                  View Exhibition
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
