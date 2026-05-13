import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import config from '@/payload.config'
import * as Sentry from '@sentry/nextjs'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const data = await req.json()

    const { name, email, phone, eventDate, numberOfGuests, eventType, message } = data

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 },
      )
    }

    const inquiry = await payload.create({
      collection: 'rental-inquiries',
      data: {
        name,
        email,
        phone: phone || undefined,
        eventDate: eventDate || undefined,
        numberOfGuests: numberOfGuests || undefined,
        eventType: eventType || undefined,
        message,
      },
    })

    logger.info('Rental inquiry submitted', {
      inquiryId: inquiry.id,
      email,
      name,
    })

    return NextResponse.json({
      message: 'Submission received',
      id: inquiry.id,
    })
  } catch (error) {
    Sentry.captureException(error)
    logger.error('Error processing rental inquiry', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return NextResponse.json(
      { message: 'Failed to submit rental inquiry' },
      { status: 500 },
    )
  }
}
