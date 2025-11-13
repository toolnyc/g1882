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

export const Happenings: CollectionConfig = {
  slug: 'happenings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'featured', 'isActive', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
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
      name: 'category',
      type: 'text',
      required: false,
    },
    {
      name: 'featuredPerson',
      type: 'relationship',
      relationTo: 'artists',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredPersonName',
      type: 'text',
      required: false,
      admin: {
        description: 'Fallback name when no artist relationship is set',
        position: 'sidebar',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActiveOverride',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable to manually override automatic isActive calculation',
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Automatically calculated based on dates unless overridden',
        position: 'sidebar',
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
            const endDate = siblingData.endDate ? new Date(siblingData.endDate as string) : null

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
    slugField(),
  ],
}
