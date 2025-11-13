import type { GlobalConfig } from 'payload'

export const Space: GlobalConfig = {
  slug: 'space',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'address',
      type: 'text',
      required: false,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      type: 'email',
      required: false,
    },
    {
      name: 'hours',
      type: 'text',
      required: false,
    },
    {
      name: 'admission',
      type: 'text',
      required: false,
    },
  ],
}

