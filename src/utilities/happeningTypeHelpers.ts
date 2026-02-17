import type { DateDisplayMode } from './dateHelpers'

interface ResolvedHappeningType {
  name: string
  slug: string
  dateDisplayMode: DateDisplayMode
}

/**
 * Safely resolves a happening's `type` field, which can be:
 * - A populated object (from depth > 0 queries)
 * - A string ID (from depth 0 queries)
 * - null/undefined
 *
 * Returns the resolved type object or null.
 */
export function resolveHappeningType(
  type: unknown,
): ResolvedHappeningType | null {
  if (typeof type === 'object' && type !== null && 'name' in type && 'dateDisplayMode' in type) {
    const t = type as Record<string, unknown>
    return {
      name: (t.name as string) || '',
      slug: (t.slug as string) || '',
      dateDisplayMode: (t.dateDisplayMode as DateDisplayMode) || 'datetime',
    }
  }
  return null
}

/**
 * Check if a happening type uses date-range display (i.e. is an "exhibition-like" type).
 */
export function isDateRangeType(type: unknown): boolean {
  const resolved = resolveHappeningType(type)
  return resolved?.dateDisplayMode === 'date-range'
}
