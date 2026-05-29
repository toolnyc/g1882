import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { revalidateTag } from 'next/cache'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const MAX_FILE_SIZE = 50 * 1024 * 1024
const MAX_DIMENSION = 2560
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']

type MediaProcessingDoc = {
  mimeType?: string | null
  processingStatus?: string | null
  url?: string | null
}

export function shouldQueueImageSizeGeneration(
  doc: MediaProcessingDoc,
  previousDoc?: MediaProcessingDoc | null,
): boolean {
  if (!doc.mimeType?.startsWith('image/')) return false
  if (!doc.url) return false
  if (doc.processingStatus !== 'pending') return false

  return previousDoc?.processingStatus !== 'pending'
}

export function sanitizeUploadFilename(filename: string): string {
  return filename.trim().replace(/\s+/g, '-')
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    useAsTitle: 'filename',
    description:
      'Max file size: 50MB. Accepted formats: JPEG, PNG, WebP, GIF, MP4, WebM. Images larger than 2560px are auto-resized. Images are automatically converted to WebP for optimal performance.',
  },
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        const file = req.file
        req.payload.logger.info(`[media-debug] beforeValidate hook. file.name: "${file?.name}", data.filename: "${data?.filename}", isClientUpload: ${!!file?.clientUploadContext}`)

        if (!file) return

        // Client uploads go to Blob first, so data.filename already has
        // the Blob-assigned name (including addRandomSuffix). Sanitize it
        // directly to preserve the suffix.
        if (file.clientUploadContext) {
          if (data && (!data.alt || !data.alt.trim())) {
            const nameWithoutExt = file.name?.replace(/\.[^/.]+$/, '') || 'Uploaded image'
            data.alt = nameWithoutExt.replace(/[-_]/g, ' ')
          }
          return
        }

        if (file.name) {
          file.name = sanitizeUploadFilename(file.name)
          if (data?.filename) {
            data.filename = file.name
          }
        }

        const errors: { message: string; path: string }[] = []

        if (file.size > MAX_FILE_SIZE) {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
          const maxMB = MAX_FILE_SIZE / (1024 * 1024)
          errors.push({
            message: `File is ${sizeMB}MB but the maximum is ${maxMB}MB. Compress or reduce the file size before uploading.`,
            path: 'file',
          })
        }

        const baseMime = file.mimetype?.split(';')[0]?.trim()
        if (baseMime && !ALLOWED_MIMES.includes(baseMime)) {
          errors.push({
            message: `"${baseMime}" is not supported. Accepted formats: JPEG, PNG, WebP, GIF, MP4, WebM.`,
            path: 'file',
          })
        }

        if (data && (!data.alt || !data.alt.trim())) {
          const nameWithoutExt = file.name?.replace(/\.[^/.]+$/, '') || 'Uploaded image'
          data.alt = nameWithoutExt.replace(/[-_]/g, ' ')
        }

        if (errors.length > 0) {
          throw new ValidationError({
            errors,
            collection: 'media',
          })
        }
      },
    ],
    beforeChange: [
      async ({ data, req }) => {
        req.payload.logger.info(`[media-debug] beforeChange hook. file.name: "${req.file?.name}", data.filename: "${data?.filename}"`)
        // For client uploads, the file buffer was re-fetched from Blob.
        // Skip resize — the plugin will re-upload the original anyway.
        if (req.file?.clientUploadContext) {
          if (req.file.mimetype?.startsWith('image/')) {
            data.processingStatus = 'pending'
            data.processingError = null
          }
          return data
        }

        if (!req.file?.data || !req.file.mimetype?.startsWith('image/')) return data

        const sharp = (await import('sharp')).default
        const image = sharp(req.file.data)
        const metadata = await image.metadata()
        const originalSize = req.file.size

        if (
          (metadata.width && metadata.width > MAX_DIMENSION) ||
          (metadata.height && metadata.height > MAX_DIMENSION)
        ) {
          const resized = await image
            .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
            .toBuffer()
          req.file.data = resized
          req.file.size = resized.length

          data.processingInfo = `Auto-resized from ${metadata.width}x${metadata.height} to fit within ${MAX_DIMENSION}px. File size: ${(originalSize / (1024 * 1024)).toFixed(1)}MB → ${(resized.length / (1024 * 1024)).toFixed(1)}MB.`
        }

        // Reset processing status for new image uploads
        if (req.file?.data && req.file.mimetype?.startsWith('image/')) {
          data.processingStatus = 'pending'
          data.processingError = null
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, req: { context } }) => {
        // When a Media document changes (e.g., caption edited), invalidate caches
        // for collections that embed this media via relationship fields.
        if (!context?.disableRevalidate) {
          revalidateTag('artists')
          revalidateTag('happenings')
        }
        return doc
      },
      async ({ doc, previousDoc, req }) => {
        if (!shouldQueueImageSizeGeneration(doc, previousDoc)) return doc

        try {
          await req.payload.jobs.queue({
            task: 'generateImageSizes',
            input: { mediaId: String(doc.id) },
          })
          req.payload.logger.info(
            `[media] Queued image size generation for media ${doc.id} (cron picks up within 1 min)`,
          )

          // Do NOT call jobs.run() here — the originating save transaction may
          // still be open, and the job's payload.update() on the same document
          // causes a MongoDB write conflict. The vercel.json cron runs every
          // minute and processes queued jobs in its own request context.
        } catch (err) {
          req.payload.logger.error(
            `[media] Failed to queue image size generation for media ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`,
          )
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Auto-generated from filename if left blank. Customize for better screen reader experience and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      admin: {
        description: 'Photo credit or caption displayed wherever this image appears on the site',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'processingInfo',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Details about automatic processing applied to this upload',
      },
    },
    {
      name: 'processingStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Complete', value: 'complete' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Status of background image size generation',
      },
    },
    {
      name: 'processingError',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data?.processingStatus === 'failed',
        description: 'Error details from image processing',
      },
    },
  ],
  upload: {
    // Files are stored in Vercel Blob via storage plugin; don't use local disk storage
    adminThumbnail: ({ doc }) => {
      const sizes = doc?.sizes as Record<string, { url?: string }> | undefined
      // Validate thumbnail URL is absolute (not a broken relative path)
      const thumbnailUrl = sizes?.thumbnail?.url
      if (thumbnailUrl?.startsWith('http')) {
        return thumbnailUrl
      }
      // Fall back through other background-generated sizes (all have absolute Blob URLs)
      for (const name of ['square', 'small'] as const) {
        const url = sizes?.[name]?.url
        if (url?.startsWith('http')) {
          return url
        }
      }
      // Final fallback to original URL
      return (doc?.url as string) || null
    },
    focalPoint: true,
    mimeTypes: ALLOWED_MIMES,
    resizeOptions: {
      withoutEnlargement: true,
    },
    imageSizes: [],
  },
}
