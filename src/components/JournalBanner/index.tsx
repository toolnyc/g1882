'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'

interface JournalBannerProps {
  headline: string
  subheadline: string
  ctaText: string
  ctaUrl: string
}

export const JournalBanner: React.FC<JournalBannerProps> = ({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
}) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('You\'ve been added to the newsletter list!')
        setEmail('')
      } else {
        toast.error(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-24 bg-lake gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-off-white"
          >
            {headline}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-10 text-xl leading-relaxed text-off-white/90"
          >
            {subheadline}
          </motion.p>

          {/* Email Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="flex-1 w-full px-4 py-3 text-navy placeholder-navy/60 bg-off-white rounded-[3px] border-0 focus:outline-none focus:ring-2 focus:ring-off-white/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-navy text-off-white px-6 py-3 text-lg font-medium rounded-[3px] hover:bg-off-white hover:text-navy hover:scale-105 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
