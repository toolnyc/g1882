import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limiter: max 5 requests per IP per 15-minute window
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip)
  }
}, RATE_LIMIT_WINDOW_MS)

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Try to add contact to audience if audience ID is configured
    if (process.env.RESEND_AUDIENCE_ID) {
      try {
        const { error } = await resend.contacts.create({
          email,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        })

        if (!error) {
          return NextResponse.json({ success: true, message: 'Successfully subscribed to newsletter' })
        }
        // If contact creation fails, fall through to email confirmation
        console.warn('Contact creation failed, falling back to email:', error)
      } catch (contactError) {
        // If contact creation throws, fall through to email confirmation
        console.warn('Contact creation error, falling back to email:', contactError)
      }
    }

    // Fallback: send confirmation email
    // Note: Update 'onboarding@resend.dev' with your verified domain email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Welcome to our newsletter!',
        html: '<p>Thank you for subscribing to our newsletter!</p>',
      })
      return NextResponse.json({ success: true, message: 'Successfully subscribed to newsletter' })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

