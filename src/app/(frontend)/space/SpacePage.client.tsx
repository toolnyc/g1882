'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'
import { AnimatedBorder } from '@/components/AnimatedBorder'
import { resolveOptimizedUrl } from '@/utilities/resolveOptimizedUrl'
import type { Media, SiteSetting, Space } from '@/payload-types'

const PhotoCarousel = dynamic(
  () => import('@/components/PhotoCarousel').then((mod) => mod.PhotoCarousel),
  {
    loading: () => (
      <div className="w-full aspect-[16/9] bg-navy/5 animate-pulse rounded-lg" />
    ),
  },
)

interface RentalFormData {
  name: string
  email: string
  phone?: string
  eventDate?: string
  numberOfGuests?: string
  eventType?: string
  message: string
}

interface SpacePageClientProps {
  space?: Space | null
  siteSettings?: SiteSetting | null
}

type CapacityItem = NonNullable<Space['capacity']>[number]
type AmenityItem = NonNullable<NonNullable<Space['amenities']>['items']>[number]

const getDefaultDescription = (galleryName: string) => [
  `${galleryName} offers a contemporary, versatile space perfect for private events, corporate gatherings, weddings, and art-centric celebrations. Our gallery combines modern aesthetics with the natural beauty of the Indiana Dunes region.`,
  "Whether you're planning an intimate gathering or a larger celebration, our space can accommodate a variety of events while providing a sophisticated backdrop of contemporary art.",
]

const defaultCapacity: CapacityItem[] = [
  { label: 'Standing Reception', description: 'Up to 150 guests' },
  { label: 'Seated Dinner', description: 'Up to 80 guests' },
  { label: 'Meeting / Presentation', description: 'Up to 60 guests' },
]

const defaultAmenities: AmenityItem[] = [
  {
    title: 'Modern Facilities',
    description:
      'Climate-controlled space with professional lighting, AV equipment, and high-speed WiFi throughout.',
    icon: 'check',
  },
  {
    title: 'Catering Options',
    description: 'Full catering kitchen available. Work with our preferred caterers or bring your own.',
    icon: 'people',
  },
  {
    title: 'Flexible Scheduling',
    description: 'Available for day and evening events, with flexible scheduling to accommodate your needs.',
    icon: 'calendar',
  },
]

const CheckIcon = () => (
  <svg className="w-8 h-8 text-lake" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const PeopleIcon = () => (
  <svg className="w-8 h-8 text-lake" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-8 h-8 text-lake" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const getIcon = (icon: string | null | undefined) => {
  switch (icon) {
    case 'people':
      return <PeopleIcon />
    case 'calendar':
      return <CalendarIcon />
    case 'check':
    default:
      return <CheckIcon />
  }
}

const splitParagraphs = (content: string | null | undefined) =>
  content
    ?.split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

export function SpacePageClient({ space, siteSettings }: SpacePageClientProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RentalFormData>()

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const galleryName = siteSettings?.name || 'Gallery 1882'
  const galleryEmail = siteSettings?.email || null
  const galleryPhone = siteSettings?.phone || null
  const heroImage = typeof space?.heroImage === 'object' ? (space.heroImage as Media) : null
  const introParagraphs = splitParagraphs(space?.intro?.description)
  const descriptionParagraphs = introParagraphs?.length
    ? introParagraphs
    : getDefaultDescription(galleryName)
  const capacity = space?.capacity?.length ? space.capacity : defaultCapacity
  const amenities = space?.amenities?.items?.length ? space.amenities.items : defaultAmenities
  const inquiryDescription =
    space?.inquiry?.description ||
    `Interested in renting ${galleryName} for your event? Fill out the form below and we'll get back to you within 48 hours.`

  const onSubmit = async (data: RentalFormData) => {
    setIsLoading(true)
    setError(undefined)

    try {
      const response = await fetch(`${getClientSideURL()}/api/rental-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit form')
      }

      setHasSubmitted(true)
      reset()
    } catch (err) {
      import('@sentry/nextjs').then((Sentry) => Sentry.captureException(err))
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-off-white">
      <section className="pt-32 mt-12 gallery-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-navy">
                {space?.pageTitle || 'Gallery Space'}
              </h1>
              <AnimatedBorder className="mt-4" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full"
        >
          {space?.heroImages && space.heroImages.length > 1 ? (
            <PhotoCarousel photos={space.heroImages} fullWidth />
          ) : (
            <div className="w-full flex items-center justify-center max-h-[75vh] overflow-hidden">
              <Image
                src={resolveOptimizedUrl(heroImage, 1920) || resolveOptimizedUrl((space?.heroImages?.[0]?.image as Media), 1920) || (heroImage?.url) || ((space?.heroImages?.[0]?.image as Media)?.url) || '/media/placeholder.svg'}
                alt={heroImage?.alt || ((space?.heroImages?.[0]?.image as Media)?.alt) || `${galleryName} gallery space`}
                width={heroImage?.width || ((space?.heroImages?.[0]?.image as Media)?.width) || 1920}
                height={heroImage?.height || ((space?.heroImages?.[0]?.image as Media)?.height) || 1080}
                sizes="100vw"
                className="w-full h-auto max-h-[75vh] object-contain"
                priority
              />
            </div>
          )}
        </motion.div>
      </section>

      <section className="py-10 gallery-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid gap-20 lg:grid-cols-12"
          >
            <div className="lg:col-span-7">
              <div className="caption text-lake mb-6">{space?.intro?.caption || 'Our Venue'}</div>
              <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
                {space?.intro?.title || 'A Unique Space for Your Event'}
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-navy/80">
                {descriptionParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="bg-lake/5 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-navy mb-6">Space Capacity</h3>
                <div className="space-y-4">
                  {capacity.map((item) => (
                    <div key={item.id || item.label}>
                      <p className="font-semibold text-navy mb-2">{item.label}</p>
                      <p className="text-navy/80">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {space?.amenities?.enabled !== false && (
        <section className="py-20 gallery-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-5xl mx-auto"
            >
              <div className="caption text-lake mb-6">{space?.amenities?.caption || 'Amenities'}</div>
              <h2 className="mb-10 text-4xl font-bold tracking-tight md:text-5xl text-navy">
                {space?.amenities?.title || 'What We Offer'}
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                {amenities.map((amenity) => (
                  <div key={amenity.id || amenity.title} className="text-center">
                    <div className="w-16 h-16 bg-lake/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {getIcon(amenity.icon)}
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">{amenity.title}</h3>
                    <p className="text-navy/80 text-sm">{amenity.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-20 gallery-section bg-navy/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="caption text-lake mb-6">{space?.inquiry?.caption || 'Inquire'}</div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-navy">
                {space?.inquiry?.title || 'Request Information'}
              </h2>
              <p className="text-lg text-navy/80">{inquiryDescription}</p>
              {(galleryEmail || galleryPhone) && (
                <p className="mt-4 text-navy/60 text-sm">
                  You can also reach us directly
                  {galleryEmail && (
                    <>
                      {' '}at{' '}
                      <a href={`mailto:${galleryEmail}`} className="text-lake hover:underline">
                        {galleryEmail}
                      </a>
                    </>
                  )}
                  {galleryEmail && galleryPhone && ' or'}
                  {galleryPhone && (
                    <>
                      {' '}by phone at{' '}
                      <a href={`tel:${galleryPhone}`} className="text-lake hover:underline">
                        {galleryPhone}
                      </a>
                    </>
                  )}
                  .
                </p>
              )}
            </div>

            {hasSubmitted ? (
              <div className="bg-lake/5 border border-lake/20 rounded-lg p-12 text-center">
                <h3 className="text-3xl font-bold text-navy mb-4">Thank You!</h3>
                <p className="text-lg text-navy/80">
                  We&apos;ve received your rental inquiry and will get back to you soon.
                </p>
              </div>
            ) : (
              <div className="bg-off-white border border-navy/10 rounded-lg p-8 lg:p-12">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-navy">
                        Full Name <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        className="mt-2"
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-navy">
                        Email <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="mt-2"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S[^\s@]*@\S+$/,
                            message: 'Please enter a valid email address',
                          },
                        })}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-navy">
                        Phone
                      </Label>
                      <Input id="phone" type="tel" className="mt-2" {...register('phone')} />
                    </div>

                    <div>
                      <Label htmlFor="eventDate" className="text-navy">
                        Event Date
                      </Label>
                      <Input
                        id="eventDate"
                        type="date"
                        className="mt-2"
                        {...register('eventDate')}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="numberOfGuests" className="text-navy">
                        Number of Guests
                      </Label>
                      <Input
                        id="numberOfGuests"
                        type="number"
                        min="1"
                        className="mt-2"
                        {...register('numberOfGuests')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="eventType" className="text-navy">
                        Event Type
                      </Label>
                      <Input
                        id="eventType"
                        type="text"
                        placeholder="e.g., Wedding, Corporate Event, Art Show"
                        className="mt-2"
                        {...register('eventType')}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-navy">
                      Message / Event Details <span className="text-red-600">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      rows={6}
                      className="mt-2"
                      {...register('message', { required: 'Message is required' })}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full md:w-auto px-8 py-6 text-lg bg-navy text-off-white hover:bg-navy/90"
                    >
                      {isLoading ? 'Submitting...' : space?.inquiry?.submitButtonLabel || 'Submit Inquiry'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
