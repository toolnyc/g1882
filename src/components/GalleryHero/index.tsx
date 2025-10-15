'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { mockGalleryInfo } from '@/data/mockData'

export const GalleryHero: React.FC = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background with Fallback */}
      <div className="absolute inset-0">
        <video className="h-full w-full object-cover" autoPlay muted loop playsInline>
          <source src="/api/placeholder/1920/1080" type="video/mp4" />
        </video>
        {/* Fallback Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/api/placeholder/1920/1080)',
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-navy/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
              {mockGalleryInfo.name}
            </h1>
            <p className="mb-8 text-xl font-medium md:text-2xl">{mockGalleryInfo.tagline}</p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <a href="/exhibitions" className="gallery-button-cta">
                View Exhibitions
              </a>
              <a
                href="/visit"
                className="gallery-button-secondary border-white text-white hover:bg-white hover:text-navy"
              >
                Visit Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-8 w-px bg-white/60" />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-2 h-2 w-2 rounded-full bg-white"
        />
      </motion.div>
    </section>
  )
}
