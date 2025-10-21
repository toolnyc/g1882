'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { WeatherWidget } from '@/components/GalleryHero/WeatherWidget'

export const GalleryHero: React.FC = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
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

      {/* Weather Widget with Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 right-8 z-[2] opacity-60"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 py-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-lg text-off-white/80 tracking-tight pl-4"
          >
            Contemporary Art in the Indiana Dunes
          </motion.p>
          <WeatherWidget />
        </div>
      </motion.div>
    </section>
  )
}
