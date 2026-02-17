import type { CollectionConfig } from 'payload'

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
  },
  hooks: {
    beforeValidate: [
      ({ req }) => {
        const file = req.file
        if (file && file.size > MAX_FILE_SIZE) {
          throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
        }
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
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'],
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
