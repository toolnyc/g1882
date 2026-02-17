'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useNewsletterGate } from '@/providers/NewsletterGate/context'
import { useFocusTrap } from '@/hooks/useFocusTrap'

export function NewsletterGateModal() {
  const { markAsSignedUp } = useNewsletterGate()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const isVisible = !isDismissed
  const trapRef = useFocusTrap(isVisible)

  const handleDismiss = useCallback(() => {
    setIsDismissed(true)
  }, [])

  // Close on Escape
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, handleDismiss])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("You've been added to the newsletter!")
        setEmail('')
        markAsSignedUp() // Store signup status
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
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center p-4"
          onClick={handleDismiss}
        >
          <motion.div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-modal-title"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-off-white text-navy rounded-[3px] max-w-md w-full p-6 sm:p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-navy/40 hover:text-navy transition-colors text-2xl leading-none"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Content */}
            <h2 id="newsletter-modal-title" className="text-2xl font-bold mb-3">
              Opening Soon
            </h2>
            <p className="text-navy/70 mb-6">
              Gallery 1882 is preparing to open its doors. Sign up to be notified when we launch and
              receive exclusive updates about our inaugural exhibitions and artists.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="px-4 py-3 rounded-[3px] border border-navy/20 focus:outline-none focus:ring-2 focus:ring-lake disabled:opacity-50 text-navy"
              />
              <label className="flex items-start gap-2 text-sm text-navy/70">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-lake"
                  required
                />
                <span>
                  I agree to receive newsletter emails and accept the{' '}
                  <Link href="/privacy" className="text-lake underline hover:text-bright-lake">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              <button
                type="submit"
                disabled={isLoading || !consent}
                className="bg-lake text-off-white px-4 py-3 font-medium rounded-[3px] hover:bg-lake/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
