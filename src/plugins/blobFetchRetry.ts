import { head, BlobNotFoundError } from '@vercel/blob'
import path from 'path'
import type { Plugin, PayloadRequest, TypeWithID } from 'payload'

/**
 * Patches the Vercel Blob static handler to retry CDN fetches.
 *
 * The default staticHandler in @payloadcms/storage-vercel-blob calls head()
 * (authoritative API) then fetch() (CDN) without checking response.ok.
 * After a delete + re-upload at the same URL, the CDN may briefly cache
 * the 404 from the delete, causing the fetch to return the 404 HTML body
 * as if it were the file — crashing sharp.
 *
 * This handler:
 *  1. Calls head() to verify the blob exists
 *  2. Fetches from CDN with response.ok check
 *  3. Retries with backoff if the CDN returns 404 (up to 3 attempts)
 *  4. Falls back to downloadUrl on persistent CDN failures
 *  5. Returns proper 404/500 on actual failures
 */
export const blobFetchRetryPlugin: Plugin = (incomingConfig) => {
  const token = process.env.BLOB_READ_WRITE_TOKEN || ''
  if (!token) return incomingConfig

  const storeId = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase()
  if (!storeId) return incomingConfig

  const baseUrl = `https://${storeId}.public.blob.vercel-storage.com`
  const cacheControlMaxAge = 60 * 60 * 24 * 365

  async function resolvePrefix(
    req: PayloadRequest,
    collectionSlug: string,
    filename: string,
    clientUploadContext?: unknown,
  ): Promise<string> {
    if (
      clientUploadContext &&
      typeof clientUploadContext === 'object' &&
      'prefix' in clientUploadContext &&
      typeof (clientUploadContext as Record<string, unknown>).prefix === 'string'
    ) {
      return (clientUploadContext as Record<string, string>).prefix
    }
    try {
      const result = await req.payload.find({
        collection: collectionSlug as 'media',
        depth: 0,
        draft: true,
        limit: 1,
        pagination: false,
        where: { filename: { equals: filename } },
      })
      const prefix = (result?.docs?.[0] as unknown as Record<string, unknown> | undefined)?.prefix
      return typeof prefix === 'string' ? prefix : ''
    } catch {
      return ''
    }
  }

  const retryHandler = async (
    req: PayloadRequest,
    {
      params,
    }: {
      doc: TypeWithID
      headers?: Headers
      params: { clientUploadContext?: unknown; collection: string; filename: string }
    },
  ): Promise<Response | void> => {
    const { filename } = params
    if (!filename) return undefined

    try {
      const prefix = await resolvePrefix(req, params.collection, filename, params.clientUploadContext)
      const fileKey = path.posix.join(prefix, encodeURIComponent(filename))
      const fileUrl = `${baseUrl}/${fileKey}`

      const blobMeta = await head(fileUrl, { token })
      const { contentDisposition, contentType, size, uploadedAt } = blobMeta
      const uploadedAtString = uploadedAt.toISOString()
      const ETag = `"${fileKey}-${uploadedAtString}"`

      const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match')

      const headers = new Headers()
      headers.append('Cache-Control', `public, max-age=${cacheControlMaxAge}`)
      headers.append('Content-Disposition', contentDisposition)
      headers.append('Content-Length', String(size))
      headers.append('Content-Type', contentType)
      headers.append('ETag', ETag)

      if (etagFromHeaders && etagFromHeaders === ETag) {
        return new Response(null, { headers, status: 304 })
      }

      // Fetch from CDN with retry on 404 (handles eventual consistency after delete + re-upload)
      let bodyBuffer: ArrayBuffer | null = null
      const maxAttempts = 3

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const cacheBuster = attempt === 1 ? uploadedAtString : `${uploadedAtString}-${attempt}`
        const response = await fetch(`${fileUrl}?${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            Pragma: 'no-cache',
          },
        })

        if (response.ok) {
          const blob = await response.blob()
          bodyBuffer = await blob.arrayBuffer()
          if (bodyBuffer.byteLength > 0) break
        }

        if (attempt < maxAttempts) {
          const delay = 500 * attempt
          req.payload?.logger?.warn(
            `[media] CDN fetch returned ${response.status} for "${filename}" (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms`,
          )
          await new Promise((r) => setTimeout(r, delay))
        }
      }

      // Last resort: try the downloadUrl from head() metadata
      if (!bodyBuffer || bodyBuffer.byteLength === 0) {
        try {
          const dlResponse = await fetch(blobMeta.downloadUrl)
          if (dlResponse.ok) {
            bodyBuffer = await dlResponse.arrayBuffer()
          }
        } catch {
          // ignore
        }
      }

      if (!bodyBuffer || bodyBuffer.byteLength === 0) {
        req.payload?.logger?.error(
          `[media] CDN fetch exhausted retries for "${filename}" despite head() success`,
        )
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      headers.append('Last-Modified', uploadedAtString)
      return new Response(bodyBuffer, { headers, status: 200 })
    } catch (err) {
      if (err instanceof BlobNotFoundError) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }
      req.payload?.logger?.error({
        err,
        msg: `Unexpected error in blob fetch retry handler for "${filename}"`,
      })
      return new Response('Internal Server Error', { status: 500 })
    }
  }

  return {
    ...incomingConfig,
    collections: (incomingConfig.collections || []).map((collection) => {
      if (collection.slug !== 'media') return collection
      const upload = typeof collection.upload === 'object' ? collection.upload : {}

      return {
        ...collection,
        upload: {
          ...upload,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handlers: [retryHandler as any],
        },
      }
    }),
  }
}
