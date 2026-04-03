'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { WeatherWidget } from '@/components/GalleryHero/WeatherWidget'
import { useState, useEffect } from 'react'

interface StructuredHour {
  day: string
  open: string
  close: string
}

interface GalleryHeroProps {
  heroVideoUrl?: string | null
  heroVideoPosterUrl?: string | null
  structuredHours?: StructuredHour[] | null
}

/**
 * Determine if the gallery is currently open based on structured hours.
 * Returns 'Open' or 'Closed'. Falls back to the provided statusText if no hours data.
 */
const _getGalleryStatus = (
  structuredHours: StructuredHour[] | null | undefined,
  fallbackStatus: string,
): { text: string; color: string } => {
  if (!structuredHours || structuredHours.length === 0) {
    return { text: fallbackStatus, color: fallbackStatus === 'Open' ? 'bg-bright-lake' : 'bg-lake' }
  }

  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
  )
  const currentDay = now.getDay().toString()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const todayHours = structuredHours.find((h) => h.day === currentDay)
  if (!todayHours) {
    return { text: 'Closed', color: 'bg-red-400' }
  }

  const [openH, openM] = todayHours.open.split(':').map(Number)
  const [closeH, closeM] = todayHours.close.split(':').map(Number)
  const openMinutes = openH * 60 + (openM || 0)
  const closeMinutes = closeH * 60 + (closeM || 0)

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return { text: 'Open', color: 'bg-bright-lake' }
  }

  return { text: 'Closed', color: 'bg-red-400' }
}

export const GalleryHero: React.FC<GalleryHeroProps> = ({
  heroVideoUrl,
  heroVideoPosterUrl,
  structuredHours: _structuredHours,
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
          {heroVideoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroVideoPosterUrl || undefined}
              className="hero-video-iframe"
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
