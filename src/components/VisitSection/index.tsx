'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface VisitSectionProps {
  title: string
  description: string
  image: string
  ctaText: string
  ctaUrl: string
}

export const VisitSection: React.FC<VisitSectionProps> = ({
  title,
  description,
  ctaText,
  ctaUrl,
}) => {
  return (
    <section className="py-20 gallery-section">
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
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-navy"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-10 text-xl leading-relaxed text-navy/80"
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href={ctaUrl} className="gallery-button-primary px-8 py-4 text-lg">
              {ctaText}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
