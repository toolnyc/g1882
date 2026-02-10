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
import { revalidateHappening, revalidateDeleteHappening } from './hooks/revalidateHappening'

export const Happenings: CollectionConfig = {
  slug: 'happenings',
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
      generatePreviewPath({ collection: 'happenings', slug: doc.slug as string, req }),
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'featured', 'isActive', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 255,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'exhibition',
      options: [
        { label: 'Exhibition', value: 'exhibition' },
        { label: 'Event', value: 'event' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Exhibitions have date ranges; events are single-day occurrences',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'category',
              type: 'text',
              required: false,
              maxLength: 255,
              admin: {
                description: 'Deprecated -- use the "type" field instead',
              },
            },
            {
              name: 'featuredPerson',
              type: 'relationship',
              relationTo: 'artists',
              required: false,
              admin: {
                position: 'sidebar',
                description: 'Deprecated -- use the "artists" field instead',
              },
            },
            {
              name: 'featuredPersonName',
              type: 'text',
              required: false,
              maxLength: 255,
              admin: {
                description: 'Deprecated -- use the "artists" field instead',
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Schedule',
          fields: [
            {
              name: 'startDate',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'endDate',
              type: 'date',
              required: false,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'isActiveOverride',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Enable to manually override automatic isActive calculation',
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Automatically calculated based on dates unless overridden',
              },
              hooks: {
                beforeChange: [
                  ({ siblingData, value }) => {
                    // If override is enabled, use the manually set value
                    if (siblingData.isActiveOverride) {
                      return value
                    }

                    // Auto-calculate based on dates
                    const now = new Date()
                    const startDate = siblingData.startDate
                      ? new Date(siblingData.startDate as string)
                      : null
                    const endDate = siblingData.endDate
                      ? new Date(siblingData.endDate as string)
                      : null

                    if (!startDate) {
                      return false
                    }

                    // Active if current date is between start and end (or after start if no end date)
                    if (endDate) {
                      return now >= startDate && now <= endDate
                    } else {
                      return now >= startDate
                    }
                  },
                ],
              },
            },
          ],
        },
        {
          label: 'People',
          fields: [
            {
              name: 'artists',
              type: 'relationship',
              relationTo: 'artists',
              hasMany: true,
              required: false,
              admin: {
                description:
                  'Artists involved in this happening (supports multiple for group shows)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateHappening],
    afterDelete: [revalidateDeleteHappening],
  },
}
