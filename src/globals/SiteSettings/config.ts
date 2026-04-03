import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      type: 'group',
      name: 'search',
      label: 'Search Bars',
      fields: [
        {
          name: 'artistsShowSearch',
          type: 'checkbox',
          label: 'Show search bar on Artists page',
          defaultValue: true,
        },
        {
          name: 'happeningsShowSearch',
          type: 'checkbox',
          label: 'Show search bar on Happenings page',
          defaultValue: true,
        },
      ],
    },
  ],
}
