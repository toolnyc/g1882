'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WeatherData {
  temperature: number
  condition: string
}

// WMO Weather interpretation codes to human-readable conditions
const weatherCodeToCondition = (code: number): string => {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly Cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 57) return 'Drizzle'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Showers'
  if (code <= 86) return 'Snow Showers'
  if (code <= 99) return 'Thunderstorm'
  return 'Unknown'
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=41.6109&longitude=-87.0642&current=temperature_2m,weather_code&temperature_unit=fahrenheit',
        )
        if (!res.ok) throw new Error('Weather fetch failed')
        const data = await res.json()
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          condition: weatherCodeToCondition(data.current.weather_code),
        })
      } catch {
        // Silently fail — widget just won't show
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000)
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
