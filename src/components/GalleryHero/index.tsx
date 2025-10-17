'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { WeatherWidget } from '@/components/GalleryHero/WeatherWidget'

export const GalleryHero: React.FC = () => {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Cloudflare Stream Video */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full overflow-hidden">
          <iframe
            src="https://customer-dz4f40f4nnmmdd6e.cloudflarestream.com/8aa90e2afac27de9b53b72d6feda8fc5/iframe?muted=true&preload=true&loop=true&autoplay=true&controls=false&poster=https%3A%2F%2Fcustomer-dz4f40f4nnmmdd6e.cloudflarestream.com%2F8aa90e2afac27de9b53b72d6feda8fc5%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
            loading="lazy"
            className="hero-video-iframe"
            allow="accelerometer; gyroscope; autoplay; encrypted-media;"
            allowFullScreen={true}
          />
        </div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/5 via-transparent to-navy/20" />
      </div>

      {/* Minimal Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          >
            <img src="Word-Sand.svg" alt="Gallery 1882" className="max-w-xs mx-auto p-4" />
            {/* <h1 className="text-off-white mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Gallery 1882
            </h1> */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-md text-off-white pl-4"
            >
              Contemporary Art in the Indiana Dunes
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Weather Widget */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute top-8 right-8"
      >
        <WeatherWidget />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="caption text-off-white/60">Scroll</span>
          <div className="h-12 w-px bg-white/40" />
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-3 w-3 rounded-full bg-bright-lake"
          />
        </div>
      </motion.div>
    </section>
  )
}
