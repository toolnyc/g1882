import type { GlobalConfig } from 'payload'
import { getServerSideURL } from '../../utilities/getURL'
import { createRevalidateHook } from '@/utilities/revalidateFactory'

const { afterChange: revalidateOurStory } = createRevalidateHook({
  collection: 'our-story',
  getTags: () => ['global_our-story'],
})

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
            description: 'Editorial caption for the carousel, shown below the photo on the Our Story page',
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
