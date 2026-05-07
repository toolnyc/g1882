import type { GlobalConfig } from 'payload'

import { getServerSideURL } from '../../utilities/getURL'
import { revalidateSpace } from './hooks/revalidateSpace'

export const Space: GlobalConfig = {
  slug: 'space',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    livePreview: {
      url: () => `${getServerSideURL()}/space`,
    },
  },
  hooks: {
    afterChange: [revalidateSpace],
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image (Fallback)',
      required: false,
    },
    {
      name: 'heroImages',
      type: 'array',
      label: 'Hero Images',
      admin: {
        description: 'Add multiple images to display a full-width carousel. If only one is provided, it displays statically.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption to display with the image',
          },
        },
      ],
    },
    {
      name: 'pageTitle',
      type: 'text',
      label: 'Page Title',
      defaultValue: 'Gallery Space',
    },
    {
      name: 'intro',
      type: 'group',
      label: 'Intro Section',
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          defaultValue: 'Our Venue',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'A Unique Space for Your Event',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue:
            "Gallery 1882 offers a contemporary, versatile space perfect for private events, corporate gatherings, weddings, and art-centric celebrations. Our gallery combines modern aesthetics with the natural beauty of the Indiana Dunes region.\n\nWhether you're planning an intimate gathering or a larger celebration, our space can accommodate a variety of events while providing a sophisticated backdrop of contemporary art.",
          admin: {
            description: 'Use separate paragraphs by adding blank lines.',
          },
        },
      ],
    },
    {
      name: 'capacity',
      type: 'array',
      label: 'Space Capacity',
      defaultValue: [
        {
          label: 'Standing Reception',
          description: 'Up to 150 guests',
        },
        {
          label: 'Seated Dinner',
          description: 'Up to 80 guests',
        },
        {
          label: 'Meeting / Presentation',
          description: 'Up to 60 guests',
        },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          required: true,
        },
      ],
    },
    {
      name: 'amenities',
      type: 'group',
      label: 'Amenities Section',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Amenities Section',
          defaultValue: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          defaultValue: 'Amenities',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'What We Offer',
        },
        {
          name: 'items',
          type: 'array',
          label: 'Amenities',
          defaultValue: [
            {
              title: 'Modern Facilities',
              description:
                'Climate-controlled space with professional lighting, AV equipment, and high-speed WiFi throughout.',
              icon: 'check',
            },
            {
              title: 'Catering Options',
              description:
                'Full catering kitchen available. Work with our preferred caterers or bring your own.',
              icon: 'people',
            },
            {
              title: 'Flexible Scheduling',
              description:
                'Available for day and evening events, with flexible scheduling to accommodate your needs.',
              icon: 'calendar',
            },
          ],
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              required: true,
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              defaultValue: 'check',
              options: [
                { label: 'Check', value: 'check' },
                { label: 'People', value: 'people' },
                { label: 'Calendar', value: 'calendar' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'inquiry',
      type: 'group',
      label: 'Inquiry Section',
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          defaultValue: 'Inquire',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Request Information',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue:
            "Interested in renting Gallery 1882 for your event? Fill out the form below and we'll get back to you within 48 hours.",
        },
        {
          name: 'submitButtonLabel',
          type: 'text',
          label: 'Submit Button Label',
          defaultValue: 'Submit Inquiry',
        },
      ],
    },
  ],
}
