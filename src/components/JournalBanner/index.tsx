'use client'
import React from 'react'
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
  return (
    <section className="py-24 bg-bright-lake gallery-section">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              href={ctaUrl}
              className="bg-off-white text-bright-lake px-8 py-4 text-lg font-medium rounded-[3px] hover:bg-navy hover:text-off-white transition-all duration-300"
            >
              {ctaText}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
