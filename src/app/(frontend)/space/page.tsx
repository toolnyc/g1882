import type { Metadata } from 'next'
import React from 'react'
import { getCachedSpace } from '@/utilities/getSpace'
import { generateMeta } from '@/utilities/generateMeta'

export default async function SpacePage() {
  const space = await getCachedSpace()

  if (!space) {
    return (
      <main className="min-h-screen bg-off-white">
        <div className="container py-32">
          <h1 className="text-4xl font-bold">Space information not found</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-off-white">
      <article className="pt-16 pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-navy mb-4">
                {space.name || 'Gallery 1882'}
              </h1>
              {space.tagline && (
                <p className="text-2xl text-bright-lake font-semibold">{space.tagline}</p>
              )}
            </div>

            {/* Description */}
            {space.description && (
              <div className="mb-12">
                <p className="text-lg leading-relaxed text-navy/80 whitespace-pre-line">
                  {space.description}
                </p>
              </div>
            )}

            {/* Visit Information */}
            <div className="mt-12 pt-8 border-t border-navy/20">
              <h2 className="text-2xl font-bold text-navy mb-6">Visit Us</h2>
              <div className="space-y-4 text-lg">
                {space.address && (
                  <div>
                    <p className="font-bold text-navy mb-1">Address</p>
                    <p className="text-navy/80">{space.address}</p>
                  </div>
                )}
                {space.phone && (
                  <div>
                    <p className="font-bold text-navy mb-1">Phone</p>
                    <p className="text-navy/80">{space.phone}</p>
                  </div>
                )}
                {space.email && (
                  <div>
                    <p className="font-bold text-navy mb-1">Email</p>
                    <p className="text-navy/80">
                      <a href={`mailto:${space.email}`} className="hover:text-bright-lake">
                        {space.email}
                      </a>
                    </p>
                  </div>
                )}
                {space.hours && (
                  <div>
                    <p className="font-bold text-navy mb-1">Hours</p>
                    <p className="text-navy/80">{space.hours}</p>
                  </div>
                )}
                {space.admission && (
                  <div>
                    <p className="font-bold text-navy mb-1">Admission</p>
                    <p className="text-navy/80">{space.admission}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const space = await getCachedSpace()

  if (!space) {
    return {
      title: 'Space',
    }
  }

  return generateMeta({
    doc: {
      ...space,
      meta: {
        title: space.name || 'Space',
        description: space.description || space.tagline || undefined,
      },
    },
  })
}

