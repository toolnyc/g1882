function hasCookieConsent(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('cookie_consent=accepted')
}

export function setNewsletterSignupStatus() {
  // Always set localStorage for fast client-side checks
  if (typeof window !== 'undefined') {
    localStorage.setItem('newsletter_signup_status', 'completed')
  }

  // Only set cookie if user has accepted cookies
  if (hasCookieConsent()) {
    const oneYear = new Date()
    oneYear.setFullYear(oneYear.getFullYear() + 1)
    document.cookie = `newsletter_signup_status=completed; expires=${oneYear.toUTCString()}; path=/; SameSite=Lax; Secure`
  }
}

export function checkNewsletterSignupStatus(): boolean {
  // Check localStorage first (fastest)
  if (typeof window !== 'undefined' && localStorage.getItem('newsletter_signup_status') === 'completed') {
    return true
  }

  // Fallback to cookie check
  if (typeof document !== 'undefined') {
    return document.cookie.includes('newsletter_signup_status=completed')
  }

  return false
}

export function clearNewsletterSignupStatus() {
  // For testing/debugging
  if (typeof window !== 'undefined') {
    localStorage.removeItem('newsletter_signup_status')
  }
  document.cookie = 'newsletter_signup_status=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}
