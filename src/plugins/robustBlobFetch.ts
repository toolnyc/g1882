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
 * This plugin runs AFTER vercelBlobStorage and replaces the last handler
 * (the Blob plugin's handler) with a robust version that:
 *  1. Uses the Blob API `head()` to get canonical metadata
 *  2. Fetches from the canonical `downloadUrl` (not a hand-crafted CDN URL)
 *  3. Checks `response.ok` before returning
 *
 * See: SENTRY-CITRINE-CANVAS-8
 */
export const robustBlobFetchPlugin: Plugin = (incomingConfig) => {
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''
  if (!token) return incomingConfig

  const storeId = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase()
  if (!storeId) return incomingConfig

  const baseUrl = `https://${storeId}.public.blob.vercel-storage.com`

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

    try {
      // Step 1: Get canonical metadata from Blob API
      const blobMeta = await head(fileUrl, { token })

      // Step 2: Fetch using the downloadUrl from the API (canonical, works reliably)
      const fetchTarget = blobMeta.downloadUrl || blobMeta.url
      const response = await fetch(fetchTarget, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
        },
      })

      // Step 3: Validate the response
      if (!response.ok) {
        req.payload?.logger?.warn(
          `[media] Blob fetch returned ${response.status} for "${filename}" — retrying with cache-bust`,
        )

        // Retry with timestamp cache-bust (mirrors original staticHandler behavior)
        const retryUrl = `${blobMeta.url}?${blobMeta.uploadedAt.toISOString()}`
        const retryResponse = await fetch(retryUrl)
        if (!retryResponse.ok) {
          req.payload?.logger?.error(
            `[media] Blob fetch retry also failed (${retryResponse.status}) for "${filename}"`,
          )
          return undefined
        }
        const retryBuffer = await retryResponse.arrayBuffer()
        return new Response(retryBuffer, {
          status: 200,
          headers: {
            'Content-Type': blobMeta.contentType,
            'Content-Disposition': blobMeta.contentDisposition,
            'Content-Length': String(blobMeta.size),
          },
        })
      }

      const bodyBuffer = await response.arrayBuffer()

      // Sanity check: body size should roughly match expected size
      if (bodyBuffer.byteLength === 0) {
        req.payload?.logger?.warn(`[media] Blob returned empty body for "${filename}"`)
        return undefined
      }

      return new Response(bodyBuffer, {
        status: 200,
        headers: {
          'Content-Type': blobMeta.contentType,
          'Content-Disposition': blobMeta.contentDisposition,
          'Content-Length': String(blobMeta.size),
        },
      })
    } catch (err) {
      req.payload?.logger?.error(
        `[media] Robust blob handler failed for "${filename}": ${err instanceof Error ? err.message : 'Unknown error'}`,
      )
      return undefined
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
