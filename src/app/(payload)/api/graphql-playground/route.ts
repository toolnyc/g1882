/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* Modified to restrict access in production. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'
import { NextResponse } from 'next/server'

const handler = GRAPHQL_PLAYGROUND_GET(config)

export const GET = process.env.NODE_ENV === 'production'
  ? () => NextResponse.json({ error: 'Not available' }, { status: 404 })
  : handler
