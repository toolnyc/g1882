'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface ArtistFeatureProps {
  id: string
  name: string
  title: string
  bio: string
  image: string
  artistSlug: string
}

export const ArtistFeature: React.FC<ArtistFeatureProps> = ({
  name,
  title,
  bio,
  image,
  artistSlug,
}) => {
  return (
    <section className="py-32 gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid gap-20 lg:grid-cols-12 lg:items-center"
        >
          {/* Content - Asymmetrical Layout (Left Side) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="caption text-lake mb-6">Featured Artist</div>
              <h2 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">{name}</h2>
              <p className="mb-8 text-xl font-medium text-lake">{title}</p>
              {bio && <p className="mb-8 text-lg leading-relaxed text-navy/80">{bio}</p>}
              <div className="flex flex-col gap-4 sm:flex-row">
                {artistSlug && (
                  <Link
                    href={`/artists/${artistSlug}`}
                    className="gallery-button-primary px-8 py-4 text-lg"
                  >
                    More About {name.split(' ')[0]}
                  </Link>
                )}
              </div>
            </motion.div>
          </div>

          {/* Image - Asymmetrical Layout (Right Side) */}
          {image && (
            <div className="lg:col-span-4 lg:col-start-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="gallery-card overflow-hidden group relative"
              >
                <Image
                  src={image}
                  alt={`${name} - ${title}`}
                  width={800}
                  height={1000}
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 33vw, (max-width: 1376px) 33vw, 430px"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover overlay with gradient and caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-off-white text-sm font-medium uppercase tracking-wider">{name}</p>
                    {title && <p className="text-off-white/80 text-xs mt-1">{title}</p>}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
