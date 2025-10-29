'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
  image,
  ctaText,
  ctaUrl,
}) => {
  return (
    <section className="py-32 bg-off-white gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid gap-20 lg:grid-cols-12 lg:items-center"
        >
          {/* Image - Asymmetrical Layout */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="gallery-card overflow-hidden group"
            >
              <Image
                src={image}
                alt={title}
                width={800}
                height={1000}
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>

          {/* Content - Asymmetrical Layout */}
          <div className="lg:col-span-5 lg:col-start-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="caption text-lake mb-6">Visit</div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">{title}</h2>
              <p className="mb-8 text-lg leading-relaxed text-navy/80">{description}</p>
              <Link href={ctaUrl} className="gallery-button-primary px-8 py-4 text-lg">
                {ctaText}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
