import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getHappeningBySlug(slug: string, depth = 2) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'happenings',
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    pagination: false,
    overrideAccess: false,
  })

  return result.docs[0] || null
}

/**
 * Returns a cached function to fetch a happening by slug
 * Revalidates every 60 seconds or when the happening tag is invalidated
 */
export const getCachedHappeningBySlug = (slug: string) =>
  unstable_cache(async () => getHappeningBySlug(slug), ['happening', slug], {
    tags: [`happening_${slug}`, 'happenings'],
    revalidate: 60, // Revalidate every 60 seconds
  })

export { getHappeningBySlug }

