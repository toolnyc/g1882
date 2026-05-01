'use client'

import React, { useRef, useCallback, useEffect, useState } from 'react'
import NextImage from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { resolveOptimizedUrl } from '@/utilities/resolveOptimizedUrl'
import type { Media } from '@/payload-types'

type Photo = {
  image: Media | string
  caption?: string | null
  id?: string | null
}

type Props = {
  photos: Photo[]
}

export const PhotoCarousel: React.FC<Props> = ({ photos }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const photoCount = photos.length

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollRef.current
      if (!container) return
      const child = container.children[index] as HTMLElement | undefined
      if (child) {
        child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    },
    [],
  )

  const handlePrev = useCallback(() => {
    const next = activeIndex > 0 ? activeIndex - 1 : photoCount - 1
    setActiveIndex(next)
    scrollToIndex(next)
  }, [activeIndex, photoCount, scrollToIndex])

  const handleNext = useCallback(() => {
    const next = activeIndex < photoCount - 1 ? activeIndex + 1 : 0
    setActiveIndex(next)
    scrollToIndex(next)
  }, [activeIndex, photoCount, scrollToIndex])

  // Keyboard navigation
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext])

  // Track active index from scroll position
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const childWidth = container.children[0]?.clientWidth || 1
      const index = Math.round(scrollLeft / childWidth)
      setActiveIndex(Math.min(index, photoCount - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [photoCount])

  if (!photos || photos.length === 0) return null

  return (
    <div className="relative w-full" role="region" aria-label="Photo gallery" aria-roledescription="carousel">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        tabIndex={0}
        role="toolbar"
        aria-label="Gallery photos"
      >
        {photos.map((photo, index) => {
          const media = typeof photo.image === 'object' ? photo.image : null
          if (!media) return null

          const src = resolveOptimizedUrl(media, 900) || getMediaUrl(media.url, media.updatedAt)
          if (!src) return null

          return (
            <div
              key={photo.id || index}
              className="flex-shrink-0 snap-center w-[85vw] md:w-[60vw] lg:w-[50vw] max-w-3xl"
              role="group"
              aria-roledescription="slide"
              aria-label={`Photo ${index + 1} of ${photoCount}${photo.caption ? `: ${photo.caption}` : ''}`}
            >
              <div className="relative max-h-[70vh] overflow-hidden rounded-sm flex items-center justify-center">
                <NextImage
                  src={src}
                  alt={media.alt || photo.caption || `Gallery photo ${index + 1}`}
                  width={media.width || 1200}
                  height={media.height || 800}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  sizes="(max-width: 768px) 85vw, (max-width: 1024px) 60vw, 50vw"
                  priority={index === 0}
                  quality={85}
                />
              </div>
              {photo.caption && (
                <p className="mt-2 text-sm text-navy/60 italic">{photo.caption}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation arrows */}
      {photoCount > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-navy/70 hover:text-navy hover:bg-white transition-all shadow-sm"
            aria-label="Previous photo"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-navy/70 hover:text-navy hover:bg-white transition-all shadow-sm"
            aria-label="Next photo"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {photoCount > 1 && (
        <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Gallery navigation">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index)
                scrollToIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-navy w-6' : 'bg-navy/20 hover:bg-navy/40'
              }`}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
