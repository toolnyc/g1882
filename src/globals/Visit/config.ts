import type { GlobalConfig } from 'payload'
import { revalidateVisit } from './hooks/revalidateVisit'
import { getServerSideURL } from '../../utilities/getURL'

export const Visit: GlobalConfig = {
  slug: 'visit',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    livePreview: {
      url: () => `${getServerSideURL()}/visit`,
    },
  },
  hooks: {
    afterChange: [revalidateVisit],
  },
  fields: [
    // Hero Section
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image',
      required: false,
    },

    // Hours Section
    {
      name: 'hours',
      type: 'group',
      label: 'Hours Section',
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          defaultValue: 'Hours',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Gallery Hours',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'note',
          type: 'textarea',
          label: 'Hours Note',
          admin: {
            description: 'Note about last admission, holidays, etc.',
          },
        },
        {
          name: 'specialHoursTitle',
          type: 'text',
          label: 'Special Hours Title',
          defaultValue: 'Special Hours',
        },
        {
          name: 'specialHours',
          type: 'array',
          label: 'Special Hours',
          admin: {
            description: 'Holiday or temporary hour changes. Shown only on the Visit page, alongside regular hours from Space.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
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
      ],
    },

    // Admission Section
    {
      name: 'showAdmissionSection',
      type: 'checkbox',
      label: 'Show Admission Section',
      defaultValue: false,
      admin: {
        description: 'Toggle visibility of the Admission section on the Visit page',
      },
    },
    {
      name: 'admission',
      type: 'group',
      label: 'Admission Section',
      admin: {
        description: 'Detailed admission info (general & group visits). Shown only on the Visit page when enabled. For the short footer text, edit Space > Admission instead.',
        condition: (data) => Boolean(data?.showAdmissionSection),
      },
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          defaultValue: 'Admission',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Free Admission',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'generalAdmissionTitle',
          type: 'text',
          label: 'General Admission Title',
          defaultValue: 'General Admission',
        },
        {
          name: 'generalAdmissionDescription',
          type: 'textarea',
          label: 'General Admission Description',
        },
        {
          name: 'generalAdmissionFeatures',
          type: 'array',
          label: 'General Admission Features',
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'groupVisitTitle',
          type: 'text',
          label: 'Group Visit Title',
          defaultValue: 'Group Visits',
        },
        {
          name: 'groupVisitDescription',
          type: 'textarea',
          label: 'Group Visit Description',
        },
        {
          name: 'groupVisitFeatures',
          type: 'array',
          label: 'Group Visit Features',
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    // Location Section
    {
      name: 'location',
      type: 'group',
      label: 'Location Section',
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          defaultValue: 'Location',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Getting Here',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'addressLabel',
          type: 'text',
          label: 'Address Section Label',
          defaultValue: 'Address',
          admin: {
            description:
              'Heading above the address (defaults to "Address"). The address itself is pulled from SiteSettings > Gallery Info.',
          },
        },
        {
          name: 'googleMapsUrl',
          type: 'text',
          label: 'Google Maps URL',
          admin: {
            description:
              'Link to Google Maps directions (e.g. https://maps.google.com/?q=Gallery+1882). Displays a "Get Directions" button.',
          },
        },
        {
          name: 'parkingLabel',
          type: 'text',
          label: 'Parking Section Label',
          defaultValue: 'Parking',
          admin: {
            description: 'Heading above the parking info (defaults to "Parking")',
          },
        },
        {
          name: 'parkingDescription',
          type: 'textarea',
          label: 'Parking Description',
        },
        {
          name: 'parkingFeatures',
          type: 'array',
          label: 'Parking Features',
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'directions',
          type: 'array',
          label: 'Direction Cards',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
            },
            {
              name: 'content',
              type: 'textarea',
              label: 'Content',
              required: true,
            },
            {
              name: 'style',
              type: 'select',
              label: 'Card Style',
              defaultValue: 'default',
              options: [
                { label: 'Default (White)', value: 'default' },
                { label: 'Lake (Light Blue)', value: 'lake' },
                { label: 'Dark (Navy)', value: 'dark' },
              ],
            },
          ],
        },
      ],
    },

    // About Chesterton Section
    {
      name: 'chesterton',
      type: 'group',
      label: 'About Chesterton Section',
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          defaultValue: 'About Chesterton',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'A Gateway to the Indiana Dunes',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Feature Cards',
          maxRows: 3,
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              label: 'Description',
              required: true,
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              defaultValue: 'location',
              options: [
                { label: 'Location Pin', value: 'location' },
                { label: 'Building', value: 'building' },
                { label: 'Heart', value: 'heart' },
              ],
            },
          ],
        },
      ],
    },

    // Duneland Community Section
    {
      name: 'dunelandCommunityEnabled',
      type: 'checkbox',
      label: 'Show Duneland Community Section',
      defaultValue: false,
      admin: {
        description: 'Toggle visibility of the "Explore the Duneland Community" section',
      },
    },
    {
      name: 'dunelandCommunity',
      type: 'group',
      label: 'Duneland Community Section',
      admin: {
        condition: (data) => Boolean(data?.dunelandCommunityEnabled),
      },
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          defaultValue: 'Community',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Explore the Duneland Community',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },

    // FAQs Section
    {
      name: 'faqsSection',
      type: 'group',
      label: 'FAQs Section',
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          defaultValue: 'Frequently Asked Questions',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Visitor Information',
        },
        {
          name: 'faqs',
          type: 'array',
          label: 'FAQs',
          fields: [
            {
              name: 'question',
              type: 'text',
              label: 'Question',
              required: true,
            },
            {
              name: 'answer',
              type: 'textarea',
              label: 'Answer',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
