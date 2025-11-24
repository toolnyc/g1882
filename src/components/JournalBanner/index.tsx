'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your backend
      setIsSubscribed(true)
      setEmail('')
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
            {!isSubscribed ? (
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
                  className="flex-1 w-full px-4 py-3 text-navy placeholder-navy/60 bg-off-white rounded-[3px] border-0 focus:outline-none focus:ring-2 focus:ring-off-white/50"
                />
                <button
                  type="submit"
                  className="bg-navy text-off-white px-6 py-3 text-lg font-medium rounded-[3px] hover:bg-off-white hover:text-navy hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="text-off-white text-lg font-medium">Thank you for subscribing!</div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
