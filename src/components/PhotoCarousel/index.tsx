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
  fullWidth?: boolean
}

export const PhotoCarousel: React.FC<Props> = ({ photos, fullWidth = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [peekIndex, setPeekIndex] = useState<number | null>(0)
  const peekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const photoCount = photos.length

  const triggerPeek = useCallback((index: number) => {
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current)
    setPeekIndex(index)
    peekTimerRef.current = setTimeout(() => setPeekIndex(null), 2000)
  }, [])

  useEffect(() => {
    triggerPeek(0)
    return () => {
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    triggerPeek(next)
  }, [activeIndex, photoCount, scrollToIndex, triggerPeek])

  const handleNext = useCallback(() => {
    const next = activeIndex < photoCount - 1 ? activeIndex + 1 : 0
    setActiveIndex(next)
    scrollToIndex(next)
    triggerPeek(next)
  }, [activeIndex, photoCount, scrollToIndex, triggerPeek])

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
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        tabIndex={0}
        role="toolbar"
        aria-label="Gallery photos"
      >
        {photos.map((photo, index) => {
          const media = typeof photo.image === 'object' ? photo.image : null
          if (!media) return null

          const src = resolveOptimizedUrl(media, fullWidth ? 1920 : 900) || getMediaUrl(media.url, media.updatedAt)
          if (!src) return null

          return (
            <div
              key={photo.id || index}
              className="flex-shrink-0 snap-center w-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`Photo ${index + 1} of ${photoCount}${photo.caption ? `: ${photo.caption}` : ''}`}
            >
              {fullWidth ? (
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <NextImage
                    src={src}
                    alt={media.alt || photo.caption || `Gallery photo ${index + 1}`}
                    width={media.width || 1920}
                    height={media.height || 1080}
                    className="absolute inset-0 w-full h-full object-contain"
                    sizes="100vw"
                    priority={index === 0}
                    quality={85}
                  />
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <div className="relative overflow-hidden group">
                    <NextImage
                      src={src}
                      alt={media.alt || photo.caption || `Gallery photo ${index + 1}`}
                      width={media.width || 1920}
                      height={media.height || 1080}
                      className="h-[70vh] w-auto transition-transform duration-700 group-hover:scale-105"
                      sizes="100vw"
                      priority={index === 0}
                      quality={85}
                    />
                    {photo.caption && (
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6"
                        style={peekIndex === index ? { opacity: 1 } : undefined}
                      >
                        <div
                          className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-off-white text-sm [&_p]:my-0 [&_p]:text-off-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                          style={peekIndex === index ? { transform: 'translateY(0)' } : undefined}
                        >
                          <p>{photo.caption}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                triggerPeek(index)
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
