import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { revalidateArtist, revalidateDeleteArtist } from './hooks/revalidateArtist'

export const Artists: CollectionConfig = {
  slug: 'artists',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  versions: {
    maxPerDoc: 3,
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
  },

  admin: {
    preview: (doc, { req }) =>
      generatePreviewPath({ collection: 'artists', slug: doc.slug as string, req }),
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'works',
      type: 'array',
      label: 'Works',
      maxRows: 50,
      admin: {
        description: 'Gallery of artist works with images and captions',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: false,
        },
        {
          name: 'caption',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
      required: false,
      admin: {
        description: "Artist's personal website",
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      maxRows: 10,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    slugField({
      position: undefined,
    }),
  ],
  hooks: {
    afterChange: [revalidateArtist],
    afterDelete: [revalidateDeleteArtist],
  },
}
