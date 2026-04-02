import type { GlobalConfig } from 'payload'
import { revalidatePolicies } from './hooks/revalidatePolicies'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  HeadingFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const policyEditor = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    LinkFeature({}),
  ],
})

export const Policies: GlobalConfig = {
  slug: 'policies',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [revalidatePolicies],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Privacy Policy',
          fields: [
            {
              name: 'privacyContent',
              type: 'richText',
              label: 'Privacy Policy Content',
              editor: policyEditor,
              admin: {
                description:
                  'Full privacy policy content. Leave empty to display the default hardcoded policy.',
              },
            },
            {
              name: 'privacyLastUpdated',
              type: 'date',
              label: 'Last Updated',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'MMMM yyyy',
                },
              },
            },
          ],
        },
        {
          label: 'Cookie Policy',
          fields: [
            {
              name: 'cookiesContent',
              type: 'richText',
              label: 'Cookie Policy Content',
              editor: policyEditor,
              admin: {
                description:
                  'Full cookie policy content. Leave empty to display the default hardcoded policy.',
              },
            },
            {
              name: 'cookiesLastUpdated',
              type: 'date',
              label: 'Last Updated',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'MMMM yyyy',
                },
              },
            },
          ],
        },
        {
          label: 'Terms & Conditions',
          fields: [
            {
              name: 'termsContent',
              type: 'richText',
              label: 'Terms & Conditions Content',
              editor: policyEditor,
              admin: {
                description: 'Full terms and conditions content.',
              },
            },
            {
              name: 'termsLastUpdated',
              type: 'date',
              label: 'Last Updated',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'MMMM yyyy',
                },
              },
            },
          ],
        },
        {
          label: 'Land Acknowledgement',
          fields: [
            {
              name: 'landAcknowledgementContent',
              type: 'richText',
              label: 'Land Acknowledgement Content',
              editor: policyEditor,
              admin: {
                description: 'Land acknowledgement statement.',
              },
            },
          ],
        },
      ],
    },
  ],
}
