import type { GlobalConfig } from 'payload'
import { hero } from '@/heros/config'
import { revalidateHome } from './hooks/revalidateHome'

export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [revalidateHome],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [hero],
    },
    {
      name: 'heroVideoUrl',
      type: 'text',
      label: 'Hero Video URL',
      required: false,
      admin: {
        description:
          'Cloudflare Stream iframe URL for the hero video. Leave blank to use the default video.',
      },
    },
    {
      name: 'missionCaption',
      type: 'text',
      label: 'Mission Section Caption',
      required: false,
      admin: {
        description: 'Caption above the mission statement (defaults to "Our Mission")',
      },
    },
    {
      name: 'missionStatement',
      type: 'textarea',
      label: 'Mission Statement',
      required: false,
    },
    {
      name: 'missionCtaText',
      type: 'text',
      label: 'Mission CTA Text',
      required: false,
    },
    {
      name: 'missionCtaUrl',
      type: 'text',
      label: 'Mission CTA URL',
      required: false,
    },
    {
      name: 'featuredArtist',
      type: 'relationship',
      relationTo: 'artists',
      label: 'Featured Artist',
      required: false,
      admin: {
        description: 'Select an artist to feature on the homepage',
      },
    },
    {
      name: 'featuredArtistImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Artist Image Override',
      required: false,
      admin: {
        description: "Optional: override the artist's default image for the homepage display",
      },
    },
    {
      name: 'featuredArtistDescription',
      type: 'textarea',
      label: 'Featured Artist Description',
      required: false,
      admin: {
        description: 'Optional: custom blurb for the homepage (overrides artist bio)',
      },
    },
    {
      name: 'visitSectionEnabled',
      type: 'checkbox',
      label: 'Show Visit Section',
      defaultValue: true,
      admin: {
        description: 'Toggle the Visit section on the homepage',
      },
    },
    {
      name: 'visitTitle',
      type: 'text',
      label: 'Visit Section Title',
      required: false,
    },
    {
      name: 'visitDescription',
      type: 'textarea',
      label: 'Visit Section Description',
      required: false,
    },
    {
      name: 'visitImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Visit Section Image',
      required: false,
    },
    {
      name: 'visitCtaText',
      type: 'text',
      label: 'Visit CTA Text',
      required: false,
    },
    {
      name: 'visitCtaUrl',
      type: 'text',
      label: 'Visit CTA URL',
      required: false,
    },
  ],
}

