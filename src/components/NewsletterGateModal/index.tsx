'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'
import { useNewsletterGate } from '@/providers/NewsletterGate/context'

export function NewsletterGateModal() {
  const { markAsSignedUp } = useNewsletterGate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

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

  const handleDismiss = () => {
    setIsDismissed(true)
    // Modal will reappear on refresh (state doesn't persist)
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
            <h2 className="text-2xl font-bold mb-3">Opening Soon</h2>
            <p className="text-navy/70 mb-6">
              Gallery 1882 is preparing to open its doors. Sign up to be notified when we launch and receive exclusive updates about our inaugural exhibitions and artists.
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
              <button
                type="submit"
                disabled={isLoading}
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
