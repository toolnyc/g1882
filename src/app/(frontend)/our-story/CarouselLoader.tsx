'use client'

import dynamic from 'next/dynamic'

const PhotoCarousel = dynamic(
  () => import('@/components/PhotoCarousel').then((mod) => mod.PhotoCarousel),
  {
    loading: () => (
      <div className="w-full aspect-[16/9] bg-navy/5 animate-pulse rounded-lg" />
    ),
  },
)

export { PhotoCarousel }
