import type { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: 'Settings',
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Titles',
          description: 'Customize the titles displayed at the top of each page',
          fields: [
            {
              name: 'pageTitles',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'artists',
                  type: 'text',
                  label: 'Artists Page Title',
                  defaultValue: 'Artists',
                  admin: {
                    description: 'Title shown at the top of the Artists page',
                  },
                },
                {
                  name: 'happenings',
                  type: 'text',
                  label: 'Happenings Page Title',
                  defaultValue: 'Happenings',
                  admin: {
                    description: 'Title shown at the top of the Happenings page',
                  },
                },
                {
                  name: 'news',
                  type: 'text',
                  label: 'News Page Title',
                  defaultValue: 'News',
                  admin: {
                    description: 'Title shown at the top of the News page',
                  },
                },
                {
                  name: 'visit',
                  type: 'text',
                  label: 'Visit Page Title',
                  defaultValue: 'Visit',
                  admin: {
                    description: 'Title shown at the top of the Visit page',
                  },
                },
                {
                  name: 'ourStory',
                  type: 'text',
                  label: 'Our Story Page Title',
                  defaultValue: 'Our Story',
                  admin: {
                    description: 'Title shown at the top of the Our Story page',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Labels',
          description: 'Customize display labels used across the site',
          fields: [
            {
              name: 'labels',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'featuredArtist',
                  type: 'text',
                  label: 'Featured Artist Caption',
                  defaultValue: 'Featured Artist',
                  admin: {
                    description: 'Caption shown above the featured artist on the homepage',
                  },
                },
                {
                  name: 'currentlyShowing',
                  type: 'text',
                  label: 'Currently Showing Label',
                  defaultValue: 'Currently Showing',
                  admin: {
                    description: 'Banner label for artists with active exhibitions',
                  },
                },
                {
                  name: 'recentlyPosted',
                  type: 'text',
                  label: 'Recently Posted Label',
                  defaultValue: 'Recently Posted',
                  admin: {
                    description: 'Banner label on the News page for the latest post',
                  },
                },
                {
                  name: 'comingUp',
                  type: 'text',
                  label: 'Coming Up Label',
                  defaultValue: 'Coming Up',
                  admin: {
                    description: 'Banner label on the Happenings page for the next event',
                  },
                },
                {
                  name: 'upcoming',
                  type: 'text',
                  label: 'Upcoming Caption',
                  defaultValue: 'Upcoming',
                  admin: {
                    description:
                      'Caption above the "What\'s Happening" section on the homepage',
                  },
                },
                {
                  name: 'onNow',
                  type: 'text',
                  label: 'On Now Label',
                  defaultValue: 'On Now',
                  admin: {
                    description: 'Label shown for currently active exhibitions',
                  },
                },
                {
                  name: 'upNext',
                  type: 'text',
                  label: 'Up Next Label',
                  defaultValue: 'Up Next',
                  admin: {
                    description: 'Label shown for the next upcoming exhibition',
                  },
                },
                {
                  name: 'opens',
                  type: 'text',
                  label: 'Opens Label',
                  defaultValue: 'Opens',
                  admin: {
                    description: 'Label before the start date of a happening',
                  },
                },
                {
                  name: 'closes',
                  type: 'text',
                  label: 'Closes Label',
                  defaultValue: 'Closes',
                  admin: {
                    description: 'Label before the end date of a happening',
                  },
                },
                {
                  name: 'viewHappening',
                  type: 'text',
                  label: 'View Happening Label',
                  defaultValue: 'View Happening',
                  admin: {
                    description:
                      'Fallback button text when a happening type name is not available',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Gallery Info',
          description: 'Content for the Gallery Info section on the homepage',
          fields: [
            {
              name: 'galleryInfo',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Section Caption',
                  defaultValue: 'About Gallery 1882',
                  admin: {
                    description: 'Small caption text above the headline',
                  },
                },
                {
                  name: 'headline',
                  type: 'text',
                  label: 'Section Headline',
                  defaultValue: 'Contemporary Art in the Heart of the Indiana Dunes',
                  admin: {
                    description: 'Main headline for the Gallery Info section',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Gallery Description',
                  admin: {
                    description:
                      'Second paragraph describing the gallery. Leave blank to use the default description.',
                  },
                },
                {
                  name: 'visitUsTitle',
                  type: 'text',
                  label: 'Visit Us Title',
                  defaultValue: 'Visit Us',
                  admin: {
                    description: 'Heading for the visit information sidebar',
                  },
                },
                {
                  name: 'visitCtaText',
                  type: 'text',
                  label: 'Visit Button Text',
                  defaultValue: 'Plan Your Visit',
                  admin: {
                    description: 'Text on the primary visit button',
                  },
                },
                {
                  name: 'contactCtaText',
                  type: 'text',
                  label: 'Contact Button Text',
                  defaultValue: 'Contact Us',
                  admin: {
                    description: 'Text on the secondary contact button',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          description: 'Customize footer section headings',
          fields: [
            {
              name: 'footer',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'sitemapTitle',
                  type: 'text',
                  label: 'Sitemap Column Title',
                  defaultValue: 'Sitemap',
                },
                {
                  name: 'hoursTitle',
                  type: 'text',
                  label: 'Hours Column Title',
                  defaultValue: 'Our Hours',
                },
                {
                  name: 'infoTitle',
                  type: 'text',
                  label: 'Gallery Info Column Title',
                  defaultValue: 'Gallery Info',
                },
                {
                  name: 'newsletterTitle',
                  type: 'text',
                  label: 'Newsletter Column Title',
                  defaultValue: 'News',
                },
              ],
            },
          ],
        },
        {
          label: 'Search',
          description: 'Toggle search bars on listing pages',
          fields: [
            {
              name: 'search',
              type: 'group',
              label: false,
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
        },
      ],
    },
  ],
}
