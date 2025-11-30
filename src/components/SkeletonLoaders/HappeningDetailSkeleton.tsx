import React from 'react'

export const HappeningDetailSkeleton: React.FC = () => {
  return (
    <main className="min-h-screen bg-off-white">
      <article className="pb-24">
        {/* Hero Image Skeleton */}
        <div className="relative w-full h-[60vh] min-h-[400px] mb-16 bg-navy/10 animate-pulse rounded-none" />

        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Title and Featured Person Skeleton */}
            <div className="mb-8">
              <div className="h-16 bg-navy/20 animate-pulse rounded w-4/5 mb-4" />
              <div className="h-8 bg-bright-lake/20 animate-pulse rounded w-2/5" />
            </div>

            {/* Date and Time Information Skeleton */}
            <div className="mb-8 pb-8 border-b border-navy/20">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="h-4 bg-navy/20 animate-pulse rounded w-16" />
                  <div className="h-5 bg-navy/10 animate-pulse rounded w-48" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="h-4 bg-navy/20 animate-pulse rounded w-12" />
                  <div className="h-5 bg-navy/10 animate-pulse rounded w-48" />
                </div>
              </div>
            </div>

            {/* Category Skeleton */}
            <div className="mb-8">
              <div className="h-6 bg-navy/20 animate-pulse rounded-tag w-24" />
            </div>

            {/* Description Skeleton */}
            <div className="mb-6 space-y-3">
              <div className="h-4 bg-navy/10 animate-pulse rounded w-full" />
              <div className="h-4 bg-navy/10 animate-pulse rounded w-full" />
              <div className="h-4 bg-navy/10 animate-pulse rounded w-5/6" />
              <div className="h-4 bg-navy/10 animate-pulse rounded w-full" />
              <div className="h-4 bg-navy/10 animate-pulse rounded w-4/5" />
            </div>

            {/* Calendar Button Skeleton */}
            <div className="mt-12 pt-8 border-t border-navy/20">
              <div className="h-12 bg-navy/20 animate-pulse rounded w-48" />
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}

