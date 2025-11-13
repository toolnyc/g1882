import { createLocalReq, getPayload } from 'payload'
import { seed } from '@/endpoints/seed'
import config from '@payload-config'
import { headers } from 'next/headers'

export const maxDuration = 60 // This function can run for a maximum of 60 seconds

export async function POST(): Promise<Response> {
  // Restrict seed route to development only
  if (process.env.NODE_ENV !== 'development') {
    return new Response('Seed route is only available in development.', { status: 403 })
  }

  // Optionally require SEED_SECRET header
  const requestHeaders = await headers()
  const seedSecret = requestHeaders.get('x-seed-secret')
  const expectedSecret = process.env.SEED_SECRET

  if (expectedSecret && seedSecret !== expectedSecret) {
    return new Response('Invalid seed secret.', { status: 403 })
  }

  const payload = await getPayload({ config })

  // Authenticate by passing request headers
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    // Create a Payload request object to pass to the Local API for transactions
    // At this point you should pass in a user, locale, and any other context you need for the Local API
    const payloadReq = await createLocalReq({ user }, payload)

    await seed({ payload, req: payloadReq })

    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding data' })

    // Check if this is a validation error with structured data
    if (e && typeof e === 'object' && 'data' in e && e.data && typeof e.data === 'object') {
      const errorData = e.data as { errors?: unknown[] }
      if (errorData.errors && Array.isArray(errorData.errors)) {
        return Response.json(
          {
            success: false,
            errors: errorData.errors,
            message: 'Validation error occurred while seeding data.',
          },
          { status: 400 },
        )
      }
    }

    // Check if error has a message property
    const errorMessage = e instanceof Error ? e.message : String(e)

    return Response.json(
      {
        success: false,
        message: errorMessage || 'Error seeding data.',
      },
      { status: 500 },
    )
  }
}
