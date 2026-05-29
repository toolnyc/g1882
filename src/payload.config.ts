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
import { RentalInquiries } from './collections/RentalInquiries'
import { Users } from './collections/Users'
import { Home } from './globals/Home/config'
import { Visit } from './globals/Visit/config'
import { Policies } from './globals/Policies/config'
import { OurStory } from './globals/OurStory/config'
import { Space } from './globals/Space/config'
import { SiteSettings } from './globals/SiteSettings/config'
import { plugins } from './plugins'
import { blobFetchRetryPlugin } from './plugins/blobFetchRetry'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { generateImageSizesTask } from './jobs/generateImageSizes'
import { canRunPayloadJobs } from './jobs/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PREVIEW_SECRET) {
  // Using console.warn here because Payload logger is not yet initialized at config load time
  console.warn('[g1882] PREVIEW_SECRET environment variable is not set — live preview will be disabled')
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.warn('[g1882] BLOB_READ_WRITE_TOKEN is not set — media uploads will use local disk storage instead of Vercel Blob. URLs stored in the DB will be relative paths, which break in production.')
}

if (!process.env.CRON_SECRET) {
  console.warn('[g1882] CRON_SECRET is not set — Vercel cron invocations of /api/payload-jobs/run will be rejected, leaving image processing jobs queued.')
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
  collections: [Posts, Media, Categories, Users, Artists, Happenings, HappeningTypes, RentalInquiries],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Home, Visit, Policies, OurStory, Space, SiteSettings],
  plugins: [
    ...plugins,
    vercelBlobStorage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true,
      addRandomSuffix: true,
    }),
    blobFetchRetryPlugin,
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
        return canRunPayloadJobs(req)
      },
    },
    tasks: [generateImageSizesTask],
  },
})
