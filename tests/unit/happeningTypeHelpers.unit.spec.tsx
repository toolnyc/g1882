import { describe, it, expect } from 'vitest'
import { resolveHappeningType, isDateRangeType } from '@/utilities/happeningTypeHelpers'

describe('resolveHappeningType', () => {
  it('returns null for null input', () => {
    expect(resolveHappeningType(null)).toBeNull()
  })

  it('returns null for undefined input', () => {
    expect(resolveHappeningType(undefined)).toBeNull()
  })

  it('returns null for string ID (unpopulated)', () => {
    expect(resolveHappeningType('507f1f77bcf86cd799439011')).toBeNull()
  })

  it('returns null for object without required fields', () => {
    expect(resolveHappeningType({ id: '1', slug: 'test' })).toBeNull()
  })

  it('resolves populated type object', () => {
    const type = {
      name: 'Exhibition',
      slug: 'exhibition',
      dateDisplayMode: 'date-range',
    }
    expect(resolveHappeningType(type)).toEqual({
      name: 'Exhibition',
      slug: 'exhibition',
      dateDisplayMode: 'date-range',
    })
  })

  it('defaults dateDisplayMode to datetime when empty', () => {
    const type = { name: 'Event', slug: 'event', dateDisplayMode: '' }
    expect(resolveHappeningType(type)?.dateDisplayMode).toBe('datetime')
  })

  it('handles missing name/slug gracefully', () => {
    const type = { name: undefined, slug: undefined, dateDisplayMode: 'datetime' }
    const result = resolveHappeningType(type)
    expect(result?.name).toBe('')
    expect(result?.slug).toBe('')
  })
})

describe('isDateRangeType', () => {
  it('returns false for null', () => {
    expect(isDateRangeType(null)).toBe(false)
  })

  it('returns false for string ID', () => {
    expect(isDateRangeType('507f1f77bcf86cd799439011')).toBe(false)
  })

  it('returns true for date-range type', () => {
    expect(isDateRangeType({ name: 'Exhibition', slug: 'exhibition', dateDisplayMode: 'date-range' })).toBe(true)
  })

  it('returns false for datetime type', () => {
    expect(isDateRangeType({ name: 'Event', slug: 'event', dateDisplayMode: 'datetime' })).toBe(false)
  })
})
