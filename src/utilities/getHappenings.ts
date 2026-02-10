import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { unstable_cache } from 'next/cache'

type HappeningFilters = {
  featured?: boolean
  upcoming?: boolean
  active?: boolean
  type?: 'exhibition' | 'event'
  sortDirection?: 'asc' | 'desc'
}

async function getHappenings(filters: HappeningFilters = {}, depth = 1) {
  const payload = await getPayload({ config: configPromise })
  const now = new Date()

  const where: Where = {}

  // Build date range conditions for active filter
  const activeDateConditions: Where[] = []
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
  const allConditions: Where[] = []

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

  if (filters.type) {
    allConditions.push({
      type: {
        equals: filters.type,
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

  // Add published status filter since happenings uses drafts
  const publishedFilter: Where = { _status: { equals: 'published' } }
  if (Object.keys(where).length > 0) {
    where.and = [...(where.and || []), publishedFilter]
  } else {
    Object.assign(where, publishedFilter)
  }

  // Default to ascending for upcoming, descending otherwise
  const sortDirection = filters.sortDirection || (filters.upcoming ? 'asc' : 'desc')
  const sort = sortDirection === 'asc' ? 'startDate' : '-startDate'

  const result = await payload.find({
    collection: 'happenings',
    depth,
    where,
    sort,
    limit: 1000,
    pagination: false,
    overrideAccess: true,
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
 * Revalidates every 60 seconds or when the happenings tag is invalidated
 */
export const getCachedHappenings = (filters: HappeningFilters = {}, depth = 1) =>
  unstable_cache(
    async () => getHappenings(filters, depth),
    ['happenings', JSON.stringify(filters), `depth-${depth}`],
    {
      tags: ['happenings'],
      revalidate: 60, // Revalidate every 60 seconds
    },
  )

export { getHappenings }
