import { head } from '@vercel/blob'
import path from 'path'
import type { Plugin, PayloadRequest, TypeWithID } from 'payload'

/**
 * Patches the Vercel Blob storage handler to properly validate CDN responses.
 *
 * Background: The default staticHandler in @payloadcms/storage-vercel-blob
 * does not check `response.ok` after fetching from the CDN. When the CDN
 * returns 404 (e.g. for filenames with consecutive spaces or special chars),
 * the error page body is returned as if it were the file — causing sharp to
 * crash with "There was a problem while uploading the file."
 *
 * Additionally, Vercel Blob has eventual consistency: a blob uploaded via
 * the client may not be queryable via head() immediately. This handler now:
 *  1. Retries head() with exponential backoff (up to 3 attempts)
 *  2. Falls back to direct CDN fetch if head() fails
 *  3. Returns proper error Responses instead of undefined
 *
 * See: SENTRY-CITRINE-CANVAS-8
 */
export const robustBlobFetchPlugin: Plugin = (incomingConfig) => {
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''
  if (!token) return incomingConfig

  const storeId = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase()
  if (!storeId) return incomingConfig

  const baseUrl = `https://${storeId}.public.blob.vercel-storage.com`

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const robustHandler = async (
    req: PayloadRequest,
    {
      params,
    }: {
      doc: TypeWithID
      headers?: Headers
      params: { clientUploadContext?: unknown; collection: string; filename: string }
    },
  ): Promise<Response | void> => {
    // Only handle client upload fetches
    if (!('clientUploadContext' in params)) return undefined

    const { filename } = params
    if (!filename) return undefined

    const fileKey = path.posix.join('', encodeURIComponent(filename))
    const fileUrl = `${baseUrl}/${fileKey}`
    const logger = req.payload?.logger

    try {
      let blobMeta
      let headAttempt = 0
      const maxHeadAttempts = 3

      // Step 1: Retry head() with exponential backoff (handles eventual consistency)
      while (headAttempt < maxHeadAttempts) {
        try {
          blobMeta = await head(fileUrl, { token })
          logger?.info(`[media] Blob head() succeeded for "${filename}" on attempt ${headAttempt + 1}`)
          break
        } catch (headErr) {
          headAttempt++
          const headErrMsg = headErr instanceof Error ? headErr.message : 'Unknown error'

          if (headAttempt < maxHeadAttempts) {
            const delayMs = Math.min(500 * Math.pow(2, headAttempt - 1), 2000)
            logger?.warn(
              `[media] Blob head() failed for "${filename}" (attempt ${headAttempt}/${maxHeadAttempts}): ${headErrMsg} — retrying in ${delayMs}ms`,
            )
            await sleep(delayMs)
          } else {
            logger?.warn(
              `[media] Blob head() exhausted retries for "${filename}": ${headErrMsg} — falling back to direct CDN fetch`,
            )
            // Fall back to direct CDN fetch without metadata
            blobMeta = undefined
          }
        }
      }

      // Step 2: Fetch the blob (either from metadata or direct CDN)
      let fetchTarget: string
      if (blobMeta) {
        fetchTarget = blobMeta.downloadUrl || blobMeta.url
      } else {
        // Direct CDN fetch: construct canonical URL from storeId + filename
        fetchTarget = fileUrl
      }

      const response = await fetch(fetchTarget, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
        },
      })

      // Step 3: Validate the response
      if (!response.ok) {
        const statusMsg = `${response.status} ${response.statusText}`
        logger?.warn(`[media] Blob fetch returned ${statusMsg} for "${filename}" at ${fetchTarget}`)

        // If we have metadata, retry with cache-bust timestamp
        if (blobMeta) {
          const retryUrl = `${blobMeta.url}?${blobMeta.uploadedAt.toISOString()}`
          logger?.info(`[media] Retrying with cache-bust: ${retryUrl}`)
          const retryResponse = await fetch(retryUrl)

          if (retryResponse.ok) {
            const retryBuffer = await retryResponse.arrayBuffer()
            return new Response(retryBuffer, {
              status: 200,
              headers: {
                'Content-Type': blobMeta.contentType,
                'Content-Disposition': blobMeta.contentDisposition,
                'Content-Length': String(blobMeta.size),
              },
            })
          } else {
            logger?.error(
              `[media] Cache-bust retry also failed (${retryResponse.status}) for "${filename}"`,
            )
          }
        }

        // Return a 503 error response instead of undefined
        return new Response(
          JSON.stringify({
            error: `Failed to fetch blob: ${statusMsg}`,
            filename,
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const bodyBuffer = await response.arrayBuffer()

      // Sanity check: body size should be non-zero
      if (bodyBuffer.byteLength === 0) {
        logger?.warn(`[media] Blob returned empty body for "${filename}"`)
        return new Response(
          JSON.stringify({
            error: 'Blob returned empty body',
            filename,
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const contentType = blobMeta?.contentType || response.headers.get('content-type') || 'application/octet-stream'
      const contentDisposition = blobMeta?.contentDisposition || response.headers.get('content-disposition') || ''

      return new Response(bodyBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': contentDisposition,
          'Content-Length': String(bodyBuffer.byteLength),
        },
      })
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      logger?.error(`[media] Robust blob handler crashed for "${filename}": ${errMsg}`)

      // Return a 500 error response instead of undefined
      return new Response(
        JSON.stringify({
          error: `Handler error: ${errMsg}`,
          filename,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  }

  return {
    ...incomingConfig,
    collections: (incomingConfig.collections || []).map((collection) => {
      if (collection.slug !== 'media') return collection
      const upload = typeof collection.upload === 'object' ? collection.upload : {}
      if (!Array.isArray(upload.handlers) || upload.handlers.length === 0) return collection

      // Replace the last handler (Blob plugin's handler) with our robust version
      const handlers = [...upload.handlers]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handlers[handlers.length - 1] = robustHandler as any
      return {
        ...collection,
        upload: { ...upload, handlers },
      }
    }),
  }
}
