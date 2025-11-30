import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
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

