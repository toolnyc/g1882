'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
    <section className="py-32 bg-off-white gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid gap-20 lg:grid-cols-12"
        >
          {/* Description - Asymmetrical Layout */}
          <div className="lg:col-span-7">
            <div className="caption text-lake mb-6">About Gallery 1882</div>
            <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
              Contemporary Art in the Heart of the Indiana Dunes
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-navy/80">
              <p>{info.description}</p>
              <p>
                Located just minutes from the Indiana Dunes National Park, Gallery 1882 serves as a
                bridge between contemporary art and the natural beauty of the Great Lakes region.
                Our exhibitions feature both established and emerging artists whose work engages
                with themes of landscape, environment, and place.
              </p>
            </div>
          </div>

          {/* Visit Information - Asymmetrical Layout */}
          <div className="lg:col-span-5 lg:col-start-8 space-y-6">
            <div>
              <h3 className="mb-8 text-2xl font-bold tracking-tight">Visit Us</h3>
              <div className="space-y-6 text-lg">
                <div>
                  <p className="font-bold text-navy mb-2">Address</p>
                  <p>{info.address}</p>
                </div>
                <div>
                  <p className="font-bold text-navy mb-2">Phone</p>
                  <p>{info.phone}</p>
                </div>
                <div>
                  <p className="font-bold text-navy mb-2">Email</p>
                  <p>{info.email}</p>
                </div>
                <div>
                  <p className="font-bold text-navy mb-2">Hours</p>
                  <p>{info.hours}</p>
                </div>
                <div>
                  <p className="font-bold text-navy mb-2">Admission</p>
                  <p>{info.admission}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/visit" className="gallery-button-primary px-8 py-4 text-lg">
                Plan Your Visit
              </Link>
              <Link href="/contact" className="gallery-button-secondary px-8 py-4 text-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
