import React from 'react'

export const ArtistDetailSkeleton: React.FC = () => {
  return (
    <main className="min-h-screen bg-off-white">
      <article className="pt-48 pb-24">
        {/* Hero Image Skeleton */}
        <div className="relative w-full h-[60vh] min-h-[400px] mb-16 bg-navy/10 animate-pulse rounded-none" />

        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Name Skeleton */}
            <div className="mb-8">
              <div className="h-16 bg-navy/20 animate-pulse rounded w-3/4 mb-4" />
            </div>

            {/* Bio Skeleton */}
            <div className="mb-6 space-y-3">
              <div className="h-4 bg-navy/10 animate-pulse rounded w-full" />
              <div className="h-4 bg-navy/10 animate-pulse rounded w-full" />
              <div className="h-4 bg-navy/10 animate-pulse rounded w-5/6" />
              <div className="h-4 bg-navy/10 animate-pulse rounded w-full" />
              <div className="h-4 bg-navy/10 animate-pulse rounded w-4/5" />
            </div>

            {/* Related Happenings Skeleton */}
            <div className="mt-12 pt-8 border-t border-navy/20">
              <div className="h-8 bg-navy/20 animate-pulse rounded w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 border border-navy/20 rounded-lg bg-navy/5 animate-pulse"
                  >
                    <div className="h-6 bg-navy/20 animate-pulse rounded w-3/4 mb-2" />
                    <div className="h-4 bg-navy/10 animate-pulse rounded w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}

