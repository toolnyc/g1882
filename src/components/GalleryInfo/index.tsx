'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface GalleryInfo {
  name: string
  tagline: string
  description: string
  address: string
  phone: string
  email: string
  hours: string
  admission: string
}

interface GalleryInfoProps {
  info: GalleryInfo
}

export const GalleryInfo: React.FC<GalleryInfoProps> = ({ info }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid gap-12 lg:grid-cols-2"
    >
      {/* Description */}
      <div>
        <div className="caption text-lake mb-4">About Gallery 1882</div>
        <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          Contemporary Art in the Heart of the Indiana Dunes
        </h2>
        <p className="mb-6 text-lg leading-relaxed">{info.description}</p>
        <p className="text-lg leading-relaxed">
          Located just minutes from the Indiana Dunes National Park, Gallery 1882 serves as a bridge
          between contemporary art and the natural beauty of the Great Lakes region. Our exhibitions
          feature both established and emerging artists whose work engages with themes of landscape,
          environment, and place.
        </p>
      </div>

      {/* Visit Information */}
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-2xl font-bold tracking-tight">Visit Us</h3>
          <div className="space-y-4 text-lg">
            <div>
              <p className="font-medium text-navy">Address</p>
              <p className="text-forest">{info.address}</p>
            </div>
            <div>
              <p className="font-medium text-navy">Phone</p>
              <p className="text-forest">{info.phone}</p>
            </div>
            <div>
              <p className="font-medium text-navy">Email</p>
              <p className="text-forest">{info.email}</p>
            </div>
            <div>
              <p className="font-medium text-navy">Hours</p>
              <p className="text-forest">{info.hours}</p>
            </div>
            <div>
              <p className="font-medium text-navy">Admission</p>
              <p className="text-forest">{info.admission}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a href="/visit" className="gallery-button-primary">
            Plan Your Visit
          </a>
          <a href="/contact" className="gallery-button-secondary">
            Contact Us
          </a>
        </div>
      </div>
    </motion.div>
  )
}
