'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/RichText'

interface ArtistFeatureProps {
  id: string
  name: string
  bio: string
  image: string
  artistSlug: string
  caption?: string | null
  ctaPrefix?: string | null
  imageCaption?: Record<string, unknown> | null
}

export const ArtistFeature: React.FC<ArtistFeatureProps> = ({
  name,
  bio,
  image,
  artistSlug,
  caption,
  ctaPrefix,
  imageCaption,
}) => {
  return (
    <section className="py-32 gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8 lg:grid lg:gap-20 lg:grid-cols-12 lg:items-center"
        >
          {/* Mobile-only title — appears first on small screens */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:hidden"
          >
            <h2 className="text-6xl font-bold tracking-tight md:text-7xl">{name}</h2>
          </motion.div>

          {/* Image — mobile second, desktop right col */}
          {image && (
            <div className="order-2 lg:order-none lg:col-span-4 lg:col-start-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="gallery-card overflow-hidden group relative"
              >
                <Image
                  src={image}
                  alt={name}
                  width={800}
                  height={1000}
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 33vw, (max-width: 1376px) 33vw, 430px"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-off-white text-sm [&_p]:my-0 [&_p]:text-off-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {imageCaption ? (
                      <RichText data={imageCaption as never} enableGutter={false} />
                    ) : (
                      <p className="font-medium tracking-wider">{name}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Content — mobile third (caption + bio + button), desktop left col (full) */}
          <div className="order-3 lg:order-none lg:col-span-7 lg:row-start-1">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="caption text-lake mb-6">{caption || 'Featured Artist'}</div>
              <h2 className="hidden lg:block mb-6 text-6xl font-bold tracking-tight md:text-7xl">
                {name}
              </h2>
              {bio && <p className="mb-8 text-lg leading-relaxed text-navy/80">{bio}</p>}
              <div className="flex flex-col gap-4 sm:flex-row">
                {artistSlug && (
                  <Link
                    href={`/artists/${artistSlug}`}
                    className="gallery-button-primary px-8 py-4 text-lg"
                  >
                    {ctaPrefix || 'More About'} {name.split(' ')[0]}
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
