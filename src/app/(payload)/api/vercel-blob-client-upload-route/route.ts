import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { getPayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import * as Sentry from '@sentry/nextjs'

export const dynamic = 'force-dynamic'

/**
 * Custom client upload route for Vercel Blob that overrides the Payload plugin's
 * built-in handler (via [..slug] catch-all).
 *
 * Key difference: returns `allowOverwrite: true` in onBeforeGenerateToken so that
 * re-uploading the same filename after a failed save (e.g. missing Alt text or a
 * transient MongoDB error) does not block with "blob already exists" and cause an
 * endless loading spinner in the admin UI.
 *
 * Uses @vercel/blob@2.x (project direct dep) which supports allowOverwrite,
 * unlike the 0.x version bundled inside @payloadcms/storage-vercel-blob.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  const payload = await getPayload({ config })
  const headersList = await nextHeaders()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (clientPayload !== 'media') {
          throw new Error(`Invalid collection: ${clientPayload}`)
        }
        return { allowOverwrite: true }
      },
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    Sentry.captureException(error)
    payload.logger.error(
      `[media] Client upload route error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 },
    )
  }
}
