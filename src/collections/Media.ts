import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const MAX_FILE_SIZE = 50 * 1024 * 1024
const MAX_DIMENSION = 2560
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']

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
      ({ req }) => {
        const file = req.file
        if (!file) return

        const errors: { message: string; path: string }[] = []

        if (file.size > MAX_FILE_SIZE) {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
          const maxMB = MAX_FILE_SIZE / (1024 * 1024)
          errors.push({
            message: `File is ${sizeMB}MB but the maximum is ${maxMB}MB. Compress or reduce the file size before uploading.`,
            path: 'file',
          })
        }

        if (file.mimetype && !ALLOWED_MIMES.includes(file.mimetype)) {
          errors.push({
            message: `"${file.mimetype}" is not supported. Accepted formats: JPEG, PNG, WebP, GIF, MP4, WebM.`,
            path: 'file',
          })
        }

        // Normalize filenames that would cause Vercel Blob CDN 404s
        // (SENTRY-CITRINE-CANVAS-8): collapse consecutive whitespace, trim,
        // and replace remaining spaces with hyphens for URL safety.
        if (file.name) {
          file.name = file.name.trim().replace(/\s+/g, '-')
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
      async ({ doc, req }) => {
        // Only queue for images with a URL
        if (!doc.mimeType?.startsWith('image/')) return doc
        if (!doc.url) return doc

        // Only queue if processing is needed
        if (doc.processingStatus === 'complete') return doc

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
      //required: true,
      admin: {
        description: 'Describe the image for screen readers and SEO (e.g. "Artist painting in gallery studio")',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      admin: {
        description: 'Optional caption displayed below the image when shown on the site',
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
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    mimeTypes: ALLOWED_MIMES,
    resizeOptions: {
      withoutEnlargement: true,
    },
    // WebP quality 90: higher fidelity for art gallery imagery at the cost of larger file sizes
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: { format: 'webp', options: { quality: 90 } },
      },
    ],
  },
}
