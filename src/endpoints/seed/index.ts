import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { seedArtists } from './artists'
import { seedHappenings } from './happenings'
import { seedMedia } from './media'
import { seedPosts } from './posts'
import { seedGlobals } from './globals'
import { mockGalleryInfo } from './mockData'

const collections: CollectionSlug[] = ['media', 'artists', 'happenings', 'posts']

const globals: GlobalSlug[] = ['space', 'home']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // Clear collections and globals
  // Note: This seed is rerunnable - all collections are cleared before seeding,
  // so running the seed multiple times will produce the same result.
  // If transactions were available, we could wrap the create steps in a transaction,
  // but since collections are cleared upfront, partial failures can be recovered by rerunning.
  payload.logger.info(`— Clearing collections and globals...`)

  // Clear globals
  await Promise.all(
    globals.map((global) => {
      if (global === 'space') {
        // Space requires 'name' field, provide minimal valid data
        return payload.updateGlobal({
          slug: global,
          data: {
            name: mockGalleryInfo.name,
          },
          depth: 0,
          context: {
            disableRevalidate: true,
          },
        })
      } else {
        // Home global - can be cleared with empty object as it has no required fields
        // But we'll skip clearing it and let seedGlobals overwrite it immediately
        return Promise.resolve()
      }
    }),
  )

  // Clear collections
  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  // Clear versions
  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  // Seed media from /public/media/ directory
  payload.logger.info(`— Seeding media...`)
  const mediaMap = await seedMedia(payload, req)

  // Seed artists
  payload.logger.info(`— Seeding artists...`)
  const artistMap = await seedArtists(payload, req, mediaMap)

  // Seed happenings (depends on artists)
  payload.logger.info(`— Seeding happenings...`)
  const happeningMap = await seedHappenings(payload, req, artistMap, mediaMap)

  // Seed posts/news (depends on artists and happenings)
  payload.logger.info(`— Seeding posts...`)
  await seedPosts(payload, req, artistMap, happeningMap, mediaMap)

  // Seed globals (space, home)
  payload.logger.info(`— Seeding globals...`)
  await seedGlobals(payload)

  payload.logger.info('Seeded database successfully!')
}
