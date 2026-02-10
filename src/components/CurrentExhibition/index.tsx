'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LiveIndicator } from '../LiveIndicator'
import { fadeUp, scaleIn, slideIn } from '@/utilities/animations'
import RichText from '@/components/RichText'

interface Artist {
  id?: string
  name?: string | null
  slug?: string | null
}

interface Happening {
  id?: string
  slug?: string | null
  title?: string | null
  type?: 'exhibition' | 'event' | null
  artists?: (Artist | string)[] | null
  featuredPerson?: { name?: string | null } | string | null
  featuredPersonName?: string | null
  startDate?: string | Date | null
  endDate?: string | Date | null
  description?: Record<string, unknown> | null
  heroImage?: { url?: string; alt?: string } | string | null
  featured?: boolean
  isActive?: boolean
  category?: string | null
}

interface CurrentExhibitionProps {
  happening: Happening
  isUpNext?: boolean
}

export const CurrentExhibition: React.FC<CurrentExhibitionProps> = ({
  happening,
  isUpNext = false,
}) => {
  const getArtistNames = (): { name: string; slug?: string | null }[] => {
    if (happening.artists && happening.artists.length > 0) {
      return happening.artists
        .map((a) => {
          if (typeof a === 'object' && a?.name) return { name: a.name, slug: a.slug }
          return null
        })
        .filter(Boolean) as { name: string; slug?: string | null }[]
    }
    // Fall back to legacy fields
    if (typeof happening.featuredPerson === 'object' && happening.featuredPerson?.name) {
      return [{ name: happening.featuredPerson.name }]
    }
    if (happening.featuredPersonName) {
      return [{ name: happening.featuredPersonName }]
    }
    return []
  }

  const getButtonText = () => {
    const type = happening.type
    if (type === 'exhibition') return 'View Exhibition'
    if (type === 'event') return 'View Event'
    // Fall back to category
    const category = happening.category?.toLowerCase() || ''
    if (category.includes('exhibition')) return 'View Exhibition'
    if (category.includes('event')) return 'View Event'
    return 'View Happening'
  }

  const getImageUrl = () => {
    if (typeof happening.heroImage === 'object' && happening.heroImage?.url) {
      return happening.heroImage.url
    }
    if (typeof happening.heroImage === 'string') {
      return happening.heroImage
    }
    return ''
  }

  const getImageAlt = () => {
    if (typeof happening.heroImage === 'object' && happening.heroImage?.alt) {
      return happening.heroImage.alt
    }
    const artists = getArtistNames()
    const artistStr = artists.length > 0 ? ` featuring ${artists.map((a) => a.name).join(', ')}` : ''
    return `${happening.title || 'Happening'}${artistStr}`
  }

  const imageUrl = getImageUrl()
  const artists = getArtistNames()
  const label = isUpNext ? 'Up Next' : 'On Now'

  return (
    <section className="py-32 gallery-section">
      <div className="container">
        <motion.div
          {...fadeUp()}
          className="grid gap-20 lg:grid-cols-12 lg:items-center"
        >
          {/* Image - Asymmetrical Layout */}
          {imageUrl && (
            <div className="lg:col-span-6">
              <motion.div
                {...scaleIn({ delay: 0.2, start: 0.95 })}
                className="gallery-card overflow-hidden group"
              >
                <Image
                  src={imageUrl}
                  alt={getImageAlt()}
                  width={800}
                  height={1000}
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, (max-width: 1376px) 50vw, 656px"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            </div>
          )}

          {/* Content - Asymmetrical Layout */}
          <div className={imageUrl ? 'lg:col-span-5 lg:col-start-8' : 'lg:col-span-8 lg:col-start-3'}>
            <motion.div {...slideIn({ delay: 0.3 })}>
              <div className="flex items-center gap-4 mb-6">
                {!isUpNext && <LiveIndicator size="sm" />}
                <div className="caption text-lake flex items-center">{label}</div>
              </div>
              <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
                {happening.title}
              </h2>
              {artists.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-x-2 gap-y-1">
                  {artists.map((artist, i) => (
                    <React.Fragment key={artist.slug || i}>
                      {i > 0 && <span className="text-xl text-bright-lake">,</span>}
                      {artist.slug ? (
                        <Link
                          href={`/artists/${artist.slug}`}
                          className="text-xl font-semibold text-bright-lake hover:text-lake transition-colors"
                        >
                          {artist.name}
                        </Link>
                      ) : (
                        <span className="text-xl font-semibold text-bright-lake">
                          {artist.name}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
              {happening.description && typeof happening.description === 'object' && happening.description.root ? (
                <div className="mb-8 text-lg leading-relaxed text-navy/80">
                  <RichText data={happening.description as never} className="prose-p:my-2 prose-p:text-base" />
                </div>
              ) : null}
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
