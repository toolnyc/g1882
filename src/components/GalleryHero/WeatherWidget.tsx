'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WeatherData {
  temperature: number
  condition: string
  location: string
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock weather data for now - replace with real API call
    const mockWeather: WeatherData = {
      temperature: 72,
      condition: 'Partly Cloudy',
      location: 'Chesterton, IN',
    }

    setTimeout(() => {
      setWeather(mockWeather)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="px-4 py-3">
        <div className="animate-pulse">
          <div className="h-4 bg-bright-lake/30 rounded w-16 mb-1"></div>
          <div className="h-3 bg-bright-lake/20 rounded w-12"></div>
        </div>
      </div>
    )
  }

  if (!weather) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="px-4 py-3 text-white"
    >
      <div className="text-md font-medium text-bright-lake">{weather.temperature}°F</div>
      <div className="text-sm text-white/70">{weather.condition}</div>
      <div className="text-sm text-white/60">{weather.location}</div>
    </motion.div>
  )
}
