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
    slugField({
      position: undefined,
    }),
  ],
  hooks: {
    afterChange: [revalidateArtist],
    afterDelete: [revalidateDeleteArtist],
  },
}
