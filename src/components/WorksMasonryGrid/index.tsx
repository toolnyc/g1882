'use client'

import Image from 'next/image'
import React, { useCallback, useState } from 'react'

import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { resolveOptimizedUrl } from '@/utilities/resolveOptimizedUrl'
import RichText from '@/components/RichText'
import type { Media } from '@/payload-types'

export type WorkItem = {
  id?: string | null
  image: string | Media
  title?: string | null
}

type Props = {
  works: WorkItem[]
  /** Fallback alt text when a work has no title */
  fallbackAlt?: string
}

const EAGER_LOAD_COUNT = 20

export function WorksMasonryGrid({ works, fallbackAlt = '' }: Props) {
  const [tappedId, setTappedId] = useState<string | null>(null)

  const handleTap = useCallback((id: string) => {
    setTappedId((prev) => (prev === id ? null : id))
  }, [])

  if (works.length === 0) return null

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {works.map((work, index) => {
        const media = typeof work.image === 'object' && work.image ? work.image : null
        // Use optimized WebP size (medium=900px) for masonry grid items
        const imageUrl = media ? resolveOptimizedUrl(media, 900) : resolveMediaUrl(work.image)
        if (!imageUrl) return null
        const width = media?.width || 800
        const height = media?.height || 600
        const workId = work.id || imageUrl
        const isRevealed = tappedId === workId
        // Caption comes from the Media document (canonical source for photo credit)
        const mediaCaption = media?.caption
        const hasOverlay = !!(work.title || mediaCaption)

        return (
          <div
            key={workId}
            className="group mb-6 break-inside-avoid"
            role={hasOverlay ? 'button' : undefined}
            tabIndex={hasOverlay ? 0 : undefined}
            onClick={hasOverlay ? () => handleTap(workId) : undefined}
            onKeyDown={
              hasOverlay
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleTap(workId)
                    }
                  }
                : undefined
            }
          >
            <div className="relative overflow-hidden rounded-lg bg-navy/5">
              <Image
                src={imageUrl}
                alt={work.title || fallbackAlt}
                width={width}
                height={height}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={index < EAGER_LOAD_COUNT ? 'eager' : 'lazy'}
              />
              {/* Hover overlay (desktop) + tap-to-reveal (touch) */}
              {hasOverlay && (
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-400 flex items-end p-4 ${
                    isRevealed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div
                    className={`transition-transform duration-400 ${
                      isRevealed
                        ? 'translate-y-0'
                        : 'translate-y-3 group-hover:translate-y-0'
                    }`}
                  >
                    {work.title && (
                      <p className="text-white text-sm font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{work.title}</p>
                    )}
                    {mediaCaption && (
                      <div className="text-white/90 text-xs mt-0.5 [&_p]:my-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        <RichText data={mediaCaption} enableGutter={false} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
