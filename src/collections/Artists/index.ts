import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { formatSlug } from './hooks/formatSlug'
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
      // autosave disabled — causes blank create pages on Vercel with required
      // relationship fields (same pattern as Happenings, documented Apr 2026)
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
      maxLength: 255,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              name: 'bio',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
          ],
        },
        {
          label: 'Gallery',
          fields: [
            {
              name: 'works',
              type: 'array',
              label: 'Works',
              maxRows: 100,
              admin: {
                description: 'Gallery of artist works. Photo captions/credits are managed on each Media document.',
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
                  maxLength: 255,
                  admin: {
                    description: 'Artwork title. The photo caption/credit comes from the Media document.',
                  },
                },
                {
                  name: 'happenings',
                  type: 'relationship',
                  relationTo: 'happenings',
                  hasMany: true,
                  required: false,
                  admin: {
                    description: 'Tag which shows/exhibitions this work appears in',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Links',
          fields: [
            {
              name: 'website',
              type: 'text',
              label: 'Website URL',
              required: false,
              maxLength: 2048,
              validate: (value: string | null | undefined) =>
                !value || /^https?:\/\/.+/.test(value) || 'Must be a valid URL starting with http:// or https://',
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
                  maxLength: 2048,
                  validate: (value: string | null | undefined) =>
                    !value || /^https?:\/\/.+/.test(value) || 'Must be a valid URL starting with http:// or https://',
                },
              ],
            },
          ],
        },
      ],
    },
    slugField({
      fieldToUse: 'name',
      position: undefined,
    }),
  ],
  hooks: {
    beforeChange: [formatSlug],
    afterChange: [revalidateArtist],
    afterDelete: [revalidateDeleteArtist],
  },
}
