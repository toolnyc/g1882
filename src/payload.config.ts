import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Artists } from './collections/Artists'
import { Categories } from './collections/Categories'
import { Happenings } from './collections/Happenings'
import { HappeningTypes } from './collections/HappeningTypes'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Home } from './globals/Home/config'
import { Space } from './globals/Space/config'
import { Visit } from './globals/Visit/config'
import { Policies } from './globals/Policies/config'
import { OurStory } from './globals/OurStory/config'
import { SiteSettings } from './globals/SiteSettings/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PREVIEW_SECRET) {
  // Using console.warn here because Payload logger is not yet initialized at config load time
  console.warn('[g1882] PREVIEW_SECRET environment variable is not set — live preview will be disabled')
}

export default buildConfig({
  admin: {
    meta: {
      titleSuffix: ' — Gallery 1882',
      icons: [{ url: '/favicon.svg' }],
    },
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      afterNavLinks: ['@/components/BackToSite', '@/components/AdminDiagnostics'],
      graphics: {
        Logo: '@/components/Logo/Logo#Logo',
        Icon: '@/components/Logo/Icon#Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [Posts, Media, Categories, Users, Artists, Happenings, HappeningTypes],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Space, Home, Visit, Policies, OurStory, SiteSettings],
  plugins: [
    ...plugins,
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true,
    }),
  ],
  onInit: async (payload) => {
    const { totalDocs } = await payload.count({
      collection: 'happening-types',
    })
    if (totalDocs === 0) {
      payload.logger.warn(
        '[g1882] The happening-types collection is empty. Creating new Happenings will fail because the required "type" field has no options. Run the seed endpoint or create types manually in the admin panel.',
      )
    }
  },
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
