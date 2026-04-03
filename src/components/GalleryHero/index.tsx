'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { WeatherWidget } from '@/components/GalleryHero/WeatherWidget'
import { useState, useEffect } from 'react'

const DEFAULT_VIDEO_URL =
  'https://customer-dz4f40f4nnmmdd6e.cloudflarestream.com/8aa90e2afac27de9b53b72d6feda8fc5/iframe?muted=true&preload=true&loop=true&autoplay=true&controls=false&poster=https%3A%2F%2Fcustomer-dz4f40f4nnmmdd6e.cloudflarestream.com%2F8aa90e2afac27de9b53b72d6feda8fc5%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600'

const POSTER_IMAGE_URL =
  'https://customer-dz4f40f4nnmmdd6e.cloudflarestream.com/8aa90e2afac27de9b53b72d6feda8fc5/thumbnails/thumbnail.jpg?time=&height=600'

interface GalleryHeroProps {
  heroVideoUrl?: string | null
}

export const GalleryHero: React.FC<GalleryHeroProps> = ({
  heroVideoUrl,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('')

  const formatCentralTime = (): string => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    return `${formatter.format(new Date())} CST`
  }

  useEffect(() => {
    setCurrentTime(formatCentralTime())

    const interval = setInterval(() => {
      setCurrentTime(formatCentralTime())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const videoUrl = heroVideoUrl?.trim() || DEFAULT_VIDEO_URL

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Cloudflare Stream Video */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="relative h-full w-full overflow-hidden"
          style={{ backgroundImage: `url(${POSTER_IMAGE_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <iframe
            src={videoUrl}
            title="Gallery 1882 hero video"
            loading="lazy"
            className="hero-video-iframe"
            allow="accelerometer; gyroscope; autoplay; encrypted-media;"
            allowFullScreen={true}
            sandbox="allow-scripts allow-same-origin"
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
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 pt-4   ">
          <span className="text-xs text-off-white">{currentTime}</span>
          <WeatherWidget />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-3 flex gap-2"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  )
}
