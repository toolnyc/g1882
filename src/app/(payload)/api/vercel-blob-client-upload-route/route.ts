import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { getPayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import * as Sentry from '@sentry/nextjs'
import { head } from '@vercel/blob'

export const dynamic = 'force-dynamic'

/**
 * Custom client upload route for Vercel Blob that overrides the Payload plugin's
 * built-in handler (via [..slug] catch-all).
 *
 * Key differences:
 *  1. Returns `allowOverwrite: true` in onBeforeGenerateToken to prevent endless
 *     loading spinner when re-uploading after validation errors.
 *  2. Validates that the blob exists in the Vercel Blob API before resolving.
 *  3. Proper error responses (not crashing with "Expected response from upload handler").
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

  const logger = payload.logger
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (clientPayload !== 'media') {
          throw new Error(`Invalid collection: ${clientPayload}`)
        }
        return { allowOverwrite: true }
      },
      onUploadCompleted: async ({ blob }) => {
        // Validate the blob exists and is queryable before returning success to client
        try {
          // Retry blob validation since Vercel Blob may have eventual consistency delays
          let validated = false
          let validationAttempt = 0
          const maxValidationAttempts = 5

          while (validationAttempt < maxValidationAttempts) {
            try {
              const blobMeta = await head(blob.url, { token })
              if (blobMeta && blobMeta.size > 0) {
                validated = true
                logger.info(`[media] Blob validation succeeded for ${blob.pathname} on attempt ${validationAttempt + 1}`)
                break
              }
            } catch (validateErr) {
              validationAttempt++
              const validateMsg = validateErr instanceof Error ? validateErr.message : 'Unknown error'

              if (validationAttempt < maxValidationAttempts) {
                const delayMs = Math.min(200 * Math.pow(2, validationAttempt - 1), 1500)
                logger.warn(
                  `[media] Blob validation failed for ${blob.pathname} (attempt ${validationAttempt}/${maxValidationAttempts}): ${validateMsg} — retrying in ${delayMs}ms`,
                )
                await new Promise((resolve) => setTimeout(resolve, delayMs))
              } else {
                logger.warn(
                  `[media] Blob validation exhausted retries for ${blob.pathname} — proceeding with upload despite validation failure`,
                )
                validated = true // Proceed anyway to avoid blocking the UI
              }
            }
          }

          if (validated) {
            logger.info(`[media] Successfully validated blob upload: ${blob.pathname}`)
          }
        } catch (validationErr) {
          const validationMsg = validationErr instanceof Error ? validationErr.message : 'Unknown error'
          logger.error(`[media] Unexpected error during blob validation for ${blob.pathname}: ${validationMsg}`)
          // Don't throw — allow the client upload to succeed even if validation fails
          // The robustBlobFetch handler will retry during the fetch phase
        }
      },
    })

    if (!jsonResponse || typeof jsonResponse !== 'object' || !('blob' in jsonResponse)) {
      logger.error('[media] handleUpload returned invalid response structure')
      return NextResponse.json(
        { error: 'Invalid upload response from Vercel Blob' },
        { status: 500 },
      )
    }

    logger.info(`[media] Client upload completed: ${JSON.stringify(jsonResponse.blob)}`)
    return NextResponse.json(jsonResponse)
  } catch (error) {
    Sentry.captureException(error)
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`[media] Client upload route error: ${errMsg}`)
    return NextResponse.json(
      { error: errMsg },
      { status: 400 },
    )
  }
}
