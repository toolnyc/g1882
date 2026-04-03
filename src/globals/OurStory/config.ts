import type { GlobalConfig } from 'payload'
import { revalidateOurStory } from './hooks/revalidateOurStory'
import { getServerSideURL } from '../../utilities/getURL'

export const OurStory: GlobalConfig = {
  slug: 'our-story',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    livePreview: {
      url: () => `${getServerSideURL()}/our-story`,
    },
  },
  hooks: {
    afterChange: [revalidateOurStory],
  },
  fields: [
    {
      name: 'photos',
      type: 'array',
      label: 'Photo Gallery',
      maxRows: 10,
      admin: {
        description: 'Up to 10 photos displayed in the carousel. Drag to reorder.',
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
          label: 'Caption',
          required: false,
          admin: {
            description: 'Optional caption displayed below the image',
          },
        },
      ],
    },
    {
      name: 'story',
      type: 'richText',
      label: 'Our Story',
      admin: {
        description: 'The gallery story content, displayed below the photo carousel',
      },
    },
  ],
}
