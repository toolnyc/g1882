import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const HappeningTypes: CollectionConfig = {
  slug: 'happening-types',
  labels: {
    singular: 'Happening Type',
    plural: 'Happening Types',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'dateDisplayMode'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-safe identifier, auto-generated from name',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.name) {
              return (siblingData.name as string)
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'dateDisplayMode',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Date Range (e.g. "March 16\u2013June 20")',
          value: 'date-range',
        },
        {
          label: 'Date + Time (e.g. "March 28 from 7\u20139pm")',
          value: 'datetime',
        },
      ],
      admin: {
        description: 'Controls how dates are formatted on the frontend for happenings of this type',
      },
    },
  ],
}
