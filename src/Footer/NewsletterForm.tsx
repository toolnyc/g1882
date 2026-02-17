'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
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
        toast.success("You've been added to the newsletter list!")
        setEmail('')
        setConsent(false)
      } else {
        toast.error(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (_error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
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
          disabled={isLoading || !consent}
          className="bg-lake text-off-white px-4 py-2 text-sm font-medium rounded-[3px] hover:bg-bright-lake hover:scale-105 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-off-white/70">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-lake"
          required
        />
        <span>
          I agree to receive emails and accept the{' '}
          <Link href="/privacy" className="text-lake underline hover:text-bright-lake">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
    </form>
  )
}
