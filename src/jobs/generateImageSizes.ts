import type { TaskConfig } from 'payload'
import { put } from '@vercel/blob'

// The 7 sizes deferred from synchronous generation
// Includes thumbnail for admin dashboard and to self-heal missing relative URLs
const DEFERRED_SIZES = [
  { name: 'thumbnail', width: 300, height: 300, fit: 'cover' as const },
  { name: 'square', width: 500, height: 500, fit: 'cover' as const },
  { name: 'small', width: 600, height: undefined, fit: 'inside' as const },
  { name: 'medium', width: 900, height: undefined, fit: 'inside' as const },
  { name: 'large', width: 1400, height: undefined, fit: 'inside' as const },
  { name: 'xlarge', width: 1920, height: undefined, fit: 'inside' as const },
  { name: 'og', width: 1200, height: 630, fit: 'cover' as const, position: 'centre' },
]

export const generateImageSizesTask: TaskConfig<'generateImageSizes'> = {
  slug: 'generateImageSizes',
  label: 'Generate Image Sizes',
  inputSchema: [
    { name: 'mediaId', type: 'text', required: true },
  ],
  outputSchema: [
    { name: 'sizesGenerated', type: 'number' },
  ],
  retries: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
  onFail: async ({ input, req }) => {
    const mediaId = (input as Record<string, unknown> | undefined)?.mediaId as string | undefined
    if (!mediaId) {
      req.payload.logger.error('[generateImageSizes] All retries exhausted, no mediaId available')
      return
    }
    req.payload.logger.error(`[generateImageSizes] All retries exhausted for media ${mediaId}`)
    try {
      await req.payload.update({
        collection: 'media',
        id: mediaId,
        data: {
          processingStatus: 'failed',
          processingError: 'Image processing failed after all retry attempts',
        },
      })
    } catch (_ignoredErr) {
      req.payload.logger.error(`[generateImageSizes] Failed to update status for media ${mediaId}`)
    }
  },
  handler: async ({ input, req }) => {
    const mediaId = input.mediaId as string
    req.payload.logger.info(`[generateImageSizes] Starting processing for media ${mediaId}`)

    // 1. Fetch the media document
    const doc = await req.payload.findByID({
      collection: 'media',
      id: mediaId,
    })

    if (!doc) {
      req.payload.logger.info(`[generateImageSizes] Media ${mediaId} not found, skipping`)
      return { output: { sizesGenerated: 0 } }
    }

    // Guard: skip non-images
    if (!doc.mimeType?.startsWith('image/')) {
      req.payload.logger.info(
        `[generateImageSizes] Media ${mediaId} is not an image (${doc.mimeType}), skipping`,
      )
      return { output: { sizesGenerated: 0 } }
    }

    // Guard: skip if no URL
    if (!doc.url) {
      req.payload.logger.warn(`[generateImageSizes] Media ${mediaId} has no URL, skipping`)
      return { output: { sizesGenerated: 0 } }
    }

    // Guard: idempotent — skip if already complete with valid thumbnail
    // Re-process if thumbnail is missing or has a relative URL (broken local disk fallback)
    const thumbnailUrl = (doc.sizes as { thumbnail?: { url?: string } } | undefined)?.thumbnail?.url
    const thumbnailNeedsRepair = !thumbnailUrl || !thumbnailUrl.startsWith('http')
    if (doc.processingStatus === 'complete' && !thumbnailNeedsRepair) {
      req.payload.logger.info(`[generateImageSizes] Media ${mediaId} already complete, skipping`)
      return { output: { sizesGenerated: 0 } }
    }

    if (doc.processingStatus === 'complete' && thumbnailNeedsRepair) {
      req.payload.logger.info(
        `[generateImageSizes] Media ${mediaId} has broken thumbnail URL (relative or missing), reprocessing to repair`,
      )
    }

    // 2. Mark as processing
    await req.payload.update({
      collection: 'media',
      id: mediaId,
      data: { processingStatus: 'processing', processingError: null },
    })

    try {
      // 3. Fetch original image from Blob (or local storage fallback)
      // doc.url is normally an absolute Blob URL, but legacy uploads or Blob
      // misconfiguration can leave a relative path like /api/media/file/name.jpg.
      // Node.js fetch() requires an absolute URL, so resolve relative paths.
      let fetchUrl = doc.url as string
      if (!fetchUrl.startsWith('http')) {
        const baseUrl =
          process.env.NEXT_PUBLIC_SERVER_URL ||
          (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : '')
        if (!baseUrl) {
          throw new Error(
            `Media ${mediaId} has a relative URL (${fetchUrl}) and no server base URL is configured. Re-upload the file to store it in Blob storage.`,
          )
        }
        fetchUrl = `${baseUrl}${fetchUrl.startsWith('/') ? '' : '/'}${fetchUrl}`
        req.payload.logger.warn(
          `[generateImageSizes] Media ${mediaId} has relative URL, resolved to: ${fetchUrl}`,
        )
      }

      req.payload.logger.info(`[generateImageSizes] Fetching original image for media ${mediaId}`)
      const response = await fetch(fetchUrl)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch original image: ${response.status} ${response.statusText}`,
        )
      }
      const originalBuffer = Buffer.from(await response.arrayBuffer())
      req.payload.logger.info(
        `[generateImageSizes] Fetched original image: ${originalBuffer.length} bytes`,
      )

      // 4. Import sharp
      const sharp = (await import('sharp')).default

      // 5. Derive base filename (strip extension from original filename)
      const originalFilename = doc.filename || 'image'
      const baseName = originalFilename.replace(/\.[^.]+$/, '')

      // 6. Generate each size sequentially (memory safe)
      const sizesData: Record<string, Record<string, unknown>> = {}
      const token = process.env.BLOB_READ_WRITE_TOKEN || ''
      let sizesGenerated = 0

      for (const sizeSpec of DEFERRED_SIZES) {
        try {
          req.payload.logger.info(
            `[generateImageSizes] Generating ${sizeSpec.name} (${sizeSpec.width}x${sizeSpec.height || 'auto'})`,
          )

          const pipeline = sharp(originalBuffer).resize(
            sizeSpec.width,
            sizeSpec.height || null,
            {
              fit: sizeSpec.fit,
              position: (sizeSpec as { position?: string }).position || undefined,
              withoutEnlargement: true,
            },
          )

          const resizedBuffer = await pipeline.webp({ quality: 90 }).toBuffer()
          const metadata = await sharp(resizedBuffer).metadata()

          const sizedFilename = `${baseName}-${metadata.width}x${metadata.height}.webp`

          req.payload.logger.info(
            `[generateImageSizes] Uploading ${sizeSpec.name}: ${sizedFilename} (${resizedBuffer.length} bytes)`,
          )

          // Upload to Vercel Blob
          const blobResult = await put(sizedFilename, resizedBuffer, {
            access: 'public',
            contentType: 'image/webp',
            token,
            addRandomSuffix: false,
          })

          sizesData[sizeSpec.name] = {
            url: blobResult.url,
            width: metadata.width,
            height: metadata.height,
            mimeType: 'image/webp',
            filesize: resizedBuffer.length,
            filename: sizedFilename,
          }

          sizesGenerated++
          req.payload.logger.info(
            `[generateImageSizes] ${sizeSpec.name} complete for media ${mediaId}`,
          )
        } catch (sizeErr) {
          req.payload.logger.error(
            `[generateImageSizes] Failed to generate ${sizeSpec.name} for media ${mediaId}: ${sizeErr instanceof Error ? sizeErr.message : 'Unknown error'}`,
          )
          throw sizeErr // Let the retry mechanism handle it
        }
      }

      // 7. Update media document with all deferred sizes
      // Merge with existing sizes (preserve thumbnail)
      const existingSizes = ((doc as unknown as Record<string, unknown>).sizes as Record<string, unknown>) || {}
      const mergedSizes = { ...existingSizes, ...sizesData }

      await req.payload.update({
        collection: 'media',
        id: mediaId,
        data: {
          sizes: mergedSizes,
          processingStatus: 'complete',
          processingError: null,
          processingInfo: `Background processed: ${sizesGenerated} sizes generated from ${(originalBuffer.length / (1024 * 1024)).toFixed(1)}MB original.`,
        },
      })

      req.payload.logger.info(
        `[generateImageSizes] Media ${mediaId} complete: ${sizesGenerated} sizes generated`,
      )
      return { output: { sizesGenerated } }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      req.payload.logger.error(
        `[generateImageSizes] Failed for media ${mediaId}: ${errorMessage}`,
      )

      // Report to Sentry
      try {
        const Sentry = await import('@sentry/nextjs')
        Sentry.captureException(err, { extra: { mediaId } })
      } catch {
        // Sentry import may fail in some environments
      }

      await req.payload.update({
        collection: 'media',
        id: mediaId,
        data: {
          processingStatus: 'failed',
          processingError: errorMessage.substring(0, 500),
        },
      })

      return { state: 'failed' as const, errorMessage }
    }
  },
}
