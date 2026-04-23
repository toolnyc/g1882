import type { GlobalConfig } from 'payload'
import { hero } from '@/heros/config'
import { revalidateHome } from './hooks/revalidateHome'
import { getServerSideURL } from '../../utilities/getURL'

export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    livePreview: {
      url: () => `${getServerSideURL()}/`,
    },
  },
  hooks: {
    afterChange: [revalidateHome],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [hero],
            },
            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Video',
              required: false,
              admin: {
                description:
                  'Upload an MP4 or WebM video for the hero background. Leave blank to show no video.',
              },
            },
            {
              name: 'heroVideoPoster',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Video Poster Image',
              required: false,
              admin: {
                description:
                  'Optional poster image shown while the video loads. Should be a still frame or preview of the video.',
              },
            },
          ],
        },
        {
          label: 'Mission',
          fields: [
            {
              name: 'missionIcon',
              type: 'upload',
              relationTo: 'media',
              label: 'Mission Section Icon',
              required: false,
              admin: {
                description: 'Small icon/logo displayed above the mission statement',
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
          ],
        },
        {
          label: 'Featured Artist',
          fields: [
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
                description:
                  "Optional: override the artist's default image for the homepage display",
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
          ],
        },
        {
          label: 'Visit Section',
          fields: [
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
        },
        {
          label: 'Newsletter Popup',
          fields: [
            {
              name: 'popupHeadline',
              type: 'text',
              label: 'Popup Headline',
              required: false,
              admin: {
                description: 'Headline for the newsletter popup (defaults to "Opening Soon")',
              },
            },
            {
              name: 'popupDescription',
              type: 'textarea',
              label: 'Popup Description',
              required: false,
              admin: {
                description:
                  'Description text for the newsletter popup (defaults to launch announcement copy)',
              },
            },
            {
              name: 'popupButtonText',
              type: 'text',
              label: 'Popup Button Text',
              required: false,
              admin: {
                description: 'Submit button text (defaults to "Subscribe")',
              },
            },
            {
              name: 'popupSuccessMessage',
              type: 'text',
              label: 'Popup Success Message',
              required: false,
              admin: {
                description:
                  'Message shown after successful signup (defaults to "You\'ve been added to the newsletter!")',
              },
            },
          ],
        },
        {
          label: "What's Happening",
          fields: [
            {
              name: 'whatsHappeningEnabled',
              type: 'checkbox',
              label: "Show What's Happening Section",
              defaultValue: true,
              admin: {
                description: "Toggle the What's Happening section on the homepage",
              },
            },
            {
              name: 'whatsHappeningTitle',
              type: 'text',
              label: "What's Happening Title",
              required: false,
              admin: {
                description: 'Override the section title (defaults to "What\'s Happening?")',
              },
            },
            {
              name: 'whatsHappeningIcon',
              type: 'checkbox',
              label: 'Show Section Icon',
              defaultValue: true,
              admin: {
                description: 'Show the decorative icon next to the section heading',
              },
            },
          ],
        },
      ],
    },
  ],
}
