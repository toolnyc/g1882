'use client'
import React, { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your backend
      console.log('Email submitted:', email)
      setIsSubscribed(true)
      setEmail('')
    }
  }

  if (isSubscribed) {
    return <div className="text-off-white text-sm font-medium">Thank you for subscribing!</div>
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
        className="flex-1 w-full px-3 py-2 text-navy placeholder-navy/60 bg-off-white rounded-[3px] border-0 focus:outline-none focus:ring-2 focus:ring-lake text-sm"
      />
      <button
        type="submit"
        className="bg-lake text-off-white px-4 py-2 text-sm font-medium rounded-[3px] hover:bg-bright-lake hover:scale-105 transition-all duration-300 whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  )
}
