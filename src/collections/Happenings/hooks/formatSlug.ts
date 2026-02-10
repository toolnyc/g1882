import type { CollectionBeforeChangeHook } from 'payload'
import type { Happening } from '../../../payload-types'

/**
 * Ensures the slug field is always a proper URL-friendly format (lowercase, hyphenated).
 * This handles legacy data where slugs were stored as raw titles with spaces and special characters.
 */
export const formatSlug: CollectionBeforeChangeHook<Happening> = ({ data }) => {
  if (data?.slug && typeof data.slug === 'string') {
    data.slug = data.slug
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()
  }

  return data
}
