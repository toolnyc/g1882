import type { CollectionConfig } from 'payload'

export const RentalInquiries: CollectionConfig = {
  slug: 'rental-inquiries',
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'eventDate',
      type: 'text',
    },
    {
      name: 'numberOfGuests',
      type: 'text',
    },
    {
      name: 'eventType',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
  timestamps: true,
}
