'use client'
import React, { useState } from 'react'
import { toast } from 'sonner'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('You\'ve been added to the newsletter list!')
        setEmail('')
      } else {
        toast.error(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 justify-center items-center"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={isLoading}
        className="flex-1 w-full px-3 py-2 text-navy placeholder-navy/60 bg-off-white rounded-[3px] border-0 focus:outline-none focus:ring-2 focus:ring-lake text-sm disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-lake text-off-white px-4 py-2 text-sm font-medium rounded-[3px] hover:bg-bright-lake hover:scale-105 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  )
}
