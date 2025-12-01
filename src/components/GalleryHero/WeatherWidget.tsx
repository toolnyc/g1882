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
  const [_currentTime, setCurrentTime] = useState<string>('')

  // Format time in Central Time (Chicago)
  const formatCentralTime = (): string => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    return `${formatter.format(new Date())} Central Time`
  }

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

    // Set initial time
    setCurrentTime(formatCentralTime())

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(formatCentralTime())
    }, 60000) // 60 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval)
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
      className="text-white flex gap-2"
    >
      <div className="text-xs text-bright-lake">{weather.temperature}°F</div>
      <div className="text-xs text-off-white">{weather.condition}</div>
    </motion.div>
  )
}
