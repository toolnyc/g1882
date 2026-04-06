'use client'

import Image from 'next/image'
import React, { useCallback, useState } from 'react'

import { resolveMediaUrl } from '@/utilities/mediaHelpers'
import { resolveOptimizedUrl } from '@/utilities/resolveOptimizedUrl'
import type { Media } from '@/payload-types'

export type WorkItem = {
  id?: string | null
  image: string | Media
  title?: string | null
  caption?: string | null
}

type Props = {
  works: WorkItem[]
  /** Fallback alt text when a work has no title/caption */
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
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
      {works.map((work, index) => {
        const media = typeof work.image === 'object' && work.image ? work.image : null
        // Use optimized WebP size (medium=900px) for masonry grid items
        const imageUrl = media ? resolveOptimizedUrl(media, 900) : resolveMediaUrl(work.image)
        if (!imageUrl) return null
        const width = media?.width || 800
        const height = media?.height || 600
        const workId = work.id || imageUrl
        const isRevealed = tappedId === workId
        const hasCaption = !!(work.title || work.caption)

        return (
          <div
            key={workId}
            className="group mb-6 break-inside-avoid"
            role={hasCaption ? 'button' : undefined}
            tabIndex={hasCaption ? 0 : undefined}
            onClick={hasCaption ? () => handleTap(workId) : undefined}
            onKeyDown={
              hasCaption
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
                alt={work.title || work.caption || fallbackAlt}
                width={width}
                height={height}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={index < EAGER_LOAD_COUNT ? 'eager' : 'lazy'}
              />
              {/* Hover overlay (desktop) + tap-to-reveal (touch) */}
              {hasCaption && (
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent transition-opacity duration-400 flex items-end p-4 ${
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
                      <p className="text-off-white text-sm font-semibold">{work.title}</p>
                    )}
                    {work.caption && (
                      <p className="text-off-white/80 text-xs mt-0.5">{work.caption}</p>
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
