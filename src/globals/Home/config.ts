import type { GlobalConfig } from 'payload'
import { hero } from '@/heros/config'
import { revalidateHome } from './hooks/revalidateHome'

export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
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

