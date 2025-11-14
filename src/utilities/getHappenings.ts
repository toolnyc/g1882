import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type HappeningFilters = {
  featured?: boolean
  upcoming?: boolean
  active?: boolean
}

async function getHappenings(filters: HappeningFilters = {}, depth = 1) {
  const payload = await getPayload({ config: configPromise })
  const now = new Date()

  const where: any = {}

  if (filters.featured !== undefined) {
    where.featured = {
      equals: filters.featured,
    }
  }

  if (filters.upcoming) {
    where.startDate = {
      greater_than: now.toISOString(),
    }
  }

  if (filters.active) {
    where.isActive = {
      equals: true,
    }
  }

  const result = await payload.find({
    collection: 'happenings',
    depth,
    where,
    sort: '-startDate',
    limit: 1000,
    pagination: false,
    overrideAccess: false,
  })

  // Calculate isActive dynamically if not overridden
  const happenings = result.docs.map((happening) => {
    if (happening.isActiveOverride) {
      return happening
    }

    const startDate = happening.startDate ? new Date(happening.startDate as string) : null
    const endDate = happening.endDate ? new Date(happening.endDate as string) : null

    if (!startDate) {
      return { ...happening, isActive: false }
    }

    let isActive = false
    if (endDate) {
      isActive = now >= startDate && now <= endDate
    } else {
      isActive = now >= startDate
    }

    return { ...happening, isActive }
  })

  return happenings
}

/**
 * Returns a cached function to fetch happenings
 */
export const getCachedHappenings = (filters: HappeningFilters = {}) =>
  unstable_cache(async () => getHappenings(filters), ['happenings', JSON.stringify(filters)], {
    tags: ['happenings'],
  })

export { getHappenings }
