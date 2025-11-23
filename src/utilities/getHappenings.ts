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

  // Build date range conditions for active filter
  const activeDateConditions: any[] = []
  if (filters.active) {
    // Filter by date ranges instead of isActive field, since isActive is calculated dynamically
    // Active happenings: startDate <= now AND (endDate >= now OR endDate is null)
    activeDateConditions.push({
      startDate: {
        less_than_equal: now.toISOString(),
      },
    })
    activeDateConditions.push({
      or: [
        {
          endDate: {
            greater_than_equal: now.toISOString(),
          },
        },
        {
          endDate: {
            equals: null,
          },
        },
      ],
    })
  }

  // Combine all conditions
  const allConditions: any[] = []

  if (filters.featured !== undefined) {
    allConditions.push({
      featured: {
        equals: filters.featured,
      },
    })
  }

  if (filters.upcoming) {
    allConditions.push({
      startDate: {
        greater_than: now.toISOString(),
      },
    })
  }

  // Add active date conditions
  allConditions.push(...activeDateConditions)

  // If we have multiple conditions, use 'and', otherwise use direct assignment
  if (allConditions.length > 1) {
    where.and = allConditions
  } else if (allConditions.length === 1) {
    Object.assign(where, allConditions[0])
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

  // If active filter is requested, only return happenings that are actually active
  // (after dynamic calculation, in case of isActiveOverride or edge cases)
  if (filters.active) {
    return happenings.filter((happening) => happening.isActive === true)
  }

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
