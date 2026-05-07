'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { WeatherWidget } from '@/components/GalleryHero/WeatherWidget'
import { useState, useEffect } from 'react'

interface GalleryHeroProps {
  heroVideoUrl?: string | null
  heroVideoPosterUrl?: string | null
}

export const GalleryHero: React.FC<GalleryHeroProps> = ({
  heroVideoUrl,
  heroVideoPosterUrl,
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

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Hero Video */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative h-full w-full overflow-hidden">
          {/* eslint-disable jsx-a11y/no-interactive-element-to-noninteractive-role */}
          {heroVideoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroVideoPosterUrl || undefined}
              className="hero-video-iframe"
              aria-hidden="true"
              role="presentation"
            >
              <source src={heroVideoUrl} />
            </video>
          ) : heroVideoPosterUrl ? (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${heroVideoPosterUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ) : null}
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
