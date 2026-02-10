import type { GlobalConfig } from 'payload'

export const Space: GlobalConfig = {
  slug: 'space',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
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
      admin: {
        description: 'Comma-separated hours string (legacy). Use structuredHours for new data.',
      },
    },
    {
      name: 'structuredHours',
      type: 'array',
      label: 'Operating Hours',
      admin: {
        description:
          'Structured hours for open/closed status. Day: 0=Sunday, 1=Monday, ... 6=Saturday',
      },
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Sunday', value: '0' },
            { label: 'Monday', value: '1' },
            { label: 'Tuesday', value: '2' },
            { label: 'Wednesday', value: '3' },
            { label: 'Thursday', value: '4' },
            { label: 'Friday', value: '5' },
            { label: 'Saturday', value: '6' },
          ],
        },
        {
          name: 'open',
          type: 'text',
          required: true,
          admin: {
            description: 'Opening time in 24h format, e.g. "10:00"',
          },
        },
        {
          name: 'close',
          type: 'text',
          required: true,
          admin: {
            description: 'Closing time in 24h format, e.g. "18:00"',
          },
        },
      ],
    },
    {
      name: 'admission',
      type: 'text',
      required: false,
    },
  ],
}

