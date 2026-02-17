import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { unstable_cache } from 'next/cache'
import type { Happening } from '@/payload-types'

type HappeningFilters = {
  featured?: boolean
  upcoming?: boolean
  active?: boolean
  /** Filter by happening type slug (e.g. 'exhibition', 'event', 'talk') */
  typeSlug?: string
  sortDirection?: 'asc' | 'desc'
}

/** Default select projection for list queries — excludes heavy rich text fields */
const defaultListSelect: Partial<Record<keyof Happening, true>> = {
  title: true,
  slug: true,
  startDate: true,
  endDate: true,
  featured: true,
  type: true,
  artists: true,
  heroImage: true,
  isActive: true,
  isActiveOverride: true,
  category: true,
  featuredPerson: true,
  featuredPersonName: true,
}

async function getHappenings(filters: HappeningFilters = {}, depth = 1, select?: Record<string, true>) {
  const payload = await getPayload({ config: configPromise })
  const now = new Date()

  const where: Where = {}

  // Build date range conditions for active filter
  const activeDateConditions: Where[] = []
  if (filters.active) {
    // Filter by date ranges instead of isActive field, since isActive is calculated dynamically
    // Active happenings: startDate <= now AND endDate >= now
    // Happenings without an endDate are NOT considered active (they have no defined end)
    activeDateConditions.push({
      startDate: {
        less_than_equal: now.toISOString(),
      },
    })
    activeDateConditions.push({
      endDate: {
        greater_than_equal: now.toISOString(),
      },
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

  if (filters.typeSlug) {
    allConditions.push({
      'type.slug': {
        equals: filters.typeSlug,
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
    ...(select ? { select } : { select: defaultListSelect }),
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

    // Active only if both startDate and endDate are set and now falls within the range.
    // Happenings without an endDate are NOT considered active (they have no defined end).
    let isActive = false
    if (endDate) {
      isActive = now >= startDate && now <= endDate
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
export const getCachedHappenings = (filters: HappeningFilters = {}, depth = 1, select?: Record<string, true>) =>
  unstable_cache(
    async () => getHappenings(filters, depth, select),
    ['happenings', JSON.stringify(filters), `depth-${depth}`, select ? JSON.stringify(select) : 'default'],
    {
      tags: ['happenings'],
      revalidate: 60, // Revalidate every 60 seconds
    },
  )

export { getHappenings }
