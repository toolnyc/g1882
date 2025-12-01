'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LiveIndicator } from '../LiveIndicator'
import { fadeUp, scaleIn, slideIn } from '@/utilities/animations'

interface Happening {
  id?: string
  slug?: string | null
  title?: string | null
  featuredPerson?: { name?: string | null } | string | null
  featuredPersonName?: string | null
  startDate?: string | Date | null
  endDate?: string | Date | null
  description?: string | { root?: { type?: string; text?: string; children?: unknown[] } } | null
  heroImage?: { url?: string; alt?: string } | string | null
  featured?: boolean
  isActive?: boolean
  category?: string | null
}

interface CurrentExhibitionProps {
  happening: Happening
}

export const CurrentExhibition: React.FC<CurrentExhibitionProps> = ({ happening }) => {
  const getFeaturedPersonName = () => {
    if (typeof happening.featuredPerson === 'object' && happening.featuredPerson?.name) {
      return happening.featuredPerson.name
    }
    return happening.featuredPersonName || ''
  }

  const getButtonText = () => {
    const category = happening.category?.toLowerCase() || ''
    if (category.includes('exhibition')) {
      return 'View Exhibition'
    }
    if (category.includes('event')) {
      return 'View Event'
    }
    return 'View Happening'
  }

  const getImageUrl = () => {
    if (typeof happening.heroImage === 'object' && happening.heroImage?.url) {
      return happening.heroImage.url
    }
    if (typeof happening.heroImage === 'string') {
      return happening.heroImage
    }
    return '/media/test-art.jpg'
  }

  const getImageAlt = () => {
    if (typeof happening.heroImage === 'object' && happening.heroImage?.alt) {
      return happening.heroImage.alt
    }
    return `${happening.title || 'Happening'}${getFeaturedPersonName() ? ` by ${getFeaturedPersonName()}` : ''}`
  }

  const getDescription = () => {
    if (typeof happening.description === 'string') {
      return happening.description
    }
    // For rich text, extract text content (simplified)
    if (typeof happening.description === 'object' && happening.description?.root) {
      const extractText = (node: { type?: string; text?: string; children?: unknown[] }): string => {
        if (node.type === 'text') return node.text || ''
        if (node.children) {
          return node.children.map((child) => extractText(child as { type?: string; text?: string; children?: unknown[] })).join(' ')
        }
        return ''
      }
      return extractText(happening.description.root) || 'View details for more information.'
    }
    return 'View details for more information.'
  }

  return (
    <section className="py-32 gallery-section">
      <div className="container">
        <motion.div
          {...fadeUp()}
          className="grid gap-20 lg:grid-cols-12 lg:items-center"
        >
          {/* Image - Asymmetrical Layout */}
          <div className="lg:col-span-6">
            <motion.div
              {...scaleIn({ delay: 0.2, start: 0.95 })}
              className="gallery-card overflow-hidden group"
            >
              <Image
                src={getImageUrl()}
                alt={getImageAlt()}
                width={800}
                height={1000}
                quality={90}
                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, (max-width: 1376px) 50vw, 656px"
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>

          {/* Content - Asymmetrical Layout */}
          <div className="lg:col-span-5 lg:col-start-8">
            <motion.div {...slideIn({ delay: 0.3 })}>
              <div className="flex items-center gap-4 mb-6">
                <LiveIndicator size="sm" />
                <div className="caption text-lake flex items-center">On Now</div>
              </div>
              <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
                {happening.title}
              </h2>
              {getFeaturedPersonName() && (
                <p className="mb-4 text-xl font-semibold text-bright-lake">
                  {getFeaturedPersonName()}
                </p>
              )}
              <p className="mb-8 text-lg leading-relaxed text-navy/80">{getDescription()}</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                {happening.slug && (
                  <Link
                    href={`/happenings/${happening.slug}`}
                    className="gallery-button-primary px-8 py-4 text-lg"
                  >
                    {getButtonText()}
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
