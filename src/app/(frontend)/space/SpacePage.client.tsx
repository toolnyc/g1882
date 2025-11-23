'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'

interface RentalFormData {
  name: string
  email: string
  phone?: string
  eventDate?: string
  numberOfGuests?: string
  eventType?: string
  message: string
}

export function SpacePageClient() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RentalFormData>()

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const onSubmit = async (data: RentalFormData) => {
    setIsLoading(true)
    setError(undefined)

    try {
      // For now, we'll log the data. In production, you'd send this to an API endpoint
      // Similar to how FormBlock submits to /api/form-submissions
      const response = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: 'rental-inquiry', // This would be a form ID if using Payload form builder
          submissionData: [
            { field: 'name', value: data.name },
            { field: 'email', value: data.email },
            { field: 'phone', value: data.phone || '' },
            { field: 'eventDate', value: data.eventDate || '' },
            { field: 'numberOfGuests', value: data.numberOfGuests || '' },
            { field: 'eventType', value: data.eventType || '' },
            { field: 'message', value: data.message },
          ],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to submit form')
      }

      setIsLoading(false)
      setHasSubmitted(true)
      reset()
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <main className="relative  w-full overflow-hidden">
      {/* Cloudflare Stream Video Background */}
      <div className="fixed inset-0 z-0">
        <div className="relative h-full w-full overflow-hidden">
          <iframe
            src="https://customer-dz4f40f4nnmmdd6e.cloudflarestream.com/8aa90e2afac27de9b53b72d6feda8fc5/iframe?muted=true&preload=true&loop=true&autoplay=true&controls=false&poster=https%3A%2F%2Fcustomer-dz4f40f4nnmmdd6e.cloudflarestream.com%2F8aa90e2afac27de9b53b72d6feda8fc5%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
            loading="lazy"
            className="hero-video-iframe"
            allow="accelerometer; gyroscope; autoplay; encrypted-media;"
            allowFullScreen={true}
          />
        </div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/5 via-transparent to-navy/20" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <section className="py-32 mt-12 gallery-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-off-white border-b-4 border-bright-lake pb-4">
                Space
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Hero Form Section */}
        <section className="pt-0 pb-32 gallery-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              {hasSubmitted ? (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-12 text-center">
                  <h2 className="text-3xl font-bold text-off-white mb-4">Thank You!</h2>
                  <p className="text-lg text-off-white/90">
                    We've received your rental inquiry and will get back to you soon.
                  </p>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 pt-4 pb-8 lg:px-8 lg:pt-6 lg:pb-12">
                  <h2 className="text-3xl font-bold text-off-white mb-2">Rent the Space</h2>
                  <p className="text-lg text-off-white/90 mb-8">
                    Interested in renting Gallery 1882 for your event? Fill out the form below and
                    we'll get back to you.
                  </p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded text-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <Label htmlFor="name" className="text-off-white">
                          Full Name <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          className="mt-2"
                          {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-300">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="text-off-white">
                          Email <span className="text-red-400">*</span>
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
                          <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div>
                        <Label htmlFor="phone" className="text-off-white">
                          Phone
                        </Label>
                        <Input id="phone" type="tel" className="mt-2" {...register('phone')} />
                      </div>

                      {/* Event Date */}
                      <div>
                        <Label htmlFor="eventDate" className="text-off-white">
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
                      {/* Number of Guests */}
                      <div>
                        <Label htmlFor="numberOfGuests" className="text-off-white">
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

                      {/* Event Type */}
                      <div>
                        <Label htmlFor="eventType" className="text-off-white">
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

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-off-white">
                        Message / Event Details <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        rows={6}
                        className="mt-2"
                        {...register('message', { required: 'Message is required' })}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-300">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto px-8 py-6 text-lg bg-navy text-off-white hover:bg-navy/90"
                      >
                        {isLoading ? 'Submitting...' : 'Submit Inquiry'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  )
}
