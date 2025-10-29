'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface MissionSectionProps {
  statement: string
  ctaText: string
  ctaUrl: string
}

export const MissionSection: React.FC<MissionSectionProps> = ({ statement, ctaText, ctaUrl }) => {
  return (
    <section className="py-32 bg-navy gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-5xl mx-auto"
        >
          <div className="caption text-bright-lake mb-8">Our Mission</div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl text-off-white leading-tight"
            style={{ letterSpacing: '-0.05em' }}
          >
            {statement}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              href={ctaUrl}
              className="bg-off-white text-navy hover:bg-bright-lake hover:text-off-white px-8 py-4 text-lg font-medium rounded-[3px] transition-all duration-300"
            >
              {ctaText}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
