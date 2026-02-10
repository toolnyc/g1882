import type { CollectionBeforeChangeHook } from 'payload'
import type { Artist } from '../../../payload-types'

/**
 * Ensures the slug field is always a proper URL-friendly format (lowercase, hyphenated).
 * This handles legacy data where slugs were stored as raw names with spaces and uppercase.
 */
export const formatSlug: CollectionBeforeChangeHook<Artist> = ({ data }) => {
  if (data?.slug && typeof data.slug === 'string') {
    data.slug = data.slug
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()
  }

  return data
}
