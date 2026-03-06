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

        return data
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
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'small',
        width: 600,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'center',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
    ],
  },
}
