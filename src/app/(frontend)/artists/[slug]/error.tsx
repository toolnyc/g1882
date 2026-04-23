'use client'

export default function ArtistError() {
  return (
    <main className="min-h-screen bg-off-white">
      <div className="container py-32">
        <h1 className="text-4xl font-bold text-navy mb-4">Something went wrong</h1>
        <p className="text-navy/70 mb-8">We couldn&apos;t load this artist. Please try refreshing the page.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-navy text-off-white rounded hover:bg-navy/90 transition-colors"
        >
          Refresh
        </button>
      </div>
    </main>
  )
}
