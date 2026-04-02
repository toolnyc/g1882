import Image from 'next/image'
import React from 'react'

import { resolveMediaUrl } from '@/utilities/mediaHelpers'
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

export function WorksMasonryGrid({ works, fallbackAlt = '' }: Props) {
  if (works.length === 0) return null

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
      {works.map((work) => {
        const imageUrl = resolveMediaUrl(work.image)
        if (!imageUrl) return null

        const media = typeof work.image === 'object' && work.image ? work.image : null
        const width = media?.width || 800
        const height = media?.height || 600

        return (
          <div key={work.id || imageUrl} className="group mb-6 break-inside-avoid">
            <div className="relative overflow-hidden rounded-lg bg-navy/5">
              <Image
                src={imageUrl}
                alt={work.title || work.caption || fallbackAlt}
                width={width}
                height={height}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Hover overlay with caption — desktop only */}
              {(work.title || work.caption) && (
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4 pointer-events-none">
                  <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
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
