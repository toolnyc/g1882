import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateRange,
  formatHappeningDate,
  formatHappeningDateParts,
} from '@/utilities/dateHelpers'

describe('formatDate', () => {
  it('returns empty string for null input', () => {
    expect(formatDate(null)).toBe('')
  })

  it('returns empty string for undefined input', () => {
    expect(formatDate(undefined)).toBe('')
  })

  it('returns empty string for invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('')
  })

  it('formats date in long format by default', () => {
    const result = formatDate('2026-03-16T10:00:00Z')
    expect(result).toMatch(/March 16, 2026/)
  })

  it('formats date in short format', () => {
    const result = formatDate('2026-03-16T10:00:00Z', 'short')
    expect(result).toMatch(/Mar 16, 2026/)
  })

  it('handles Date objects', () => {
    const result = formatDate(new Date('2026-06-20T00:00:00Z'))
    expect(result).toContain('2026')
  })
})

describe('formatDateRange', () => {
  it('formats start and end dates', () => {
    const result = formatDateRange('2026-03-16T10:00:00Z', '2026-06-20T18:00:00Z')
    expect(result).toContain(' - ')
    expect(result).toMatch(/Mar/)
    expect(result).toMatch(/Jun/)
  })

  it('returns only start date when end is missing', () => {
    const result = formatDateRange('2026-03-16T10:00:00Z', null)
    expect(result).toMatch(/Mar 16, 2026/)
  })

  it('returns empty string when both dates are null', () => {
    expect(formatDateRange(null, null)).toBe('')
  })
})

describe('formatHappeningDate', () => {
  it('returns empty string for null startDate', () => {
    expect(formatHappeningDate(null, null, 'date-range')).toBe('')
  })

  it('returns empty string for invalid startDate', () => {
    expect(formatHappeningDate('invalid', null, 'date-range')).toBe('')
  })

  describe('date-range mode', () => {
    it('formats start and end as month-day range with en-dash', () => {
      const result = formatHappeningDate('2026-03-16T10:00:00Z', '2026-06-20T18:00:00Z', 'date-range')
      expect(result).toContain('March')
      expect(result).toContain('\u2013') // en-dash
      expect(result).toContain('June')
    })

    it('formats just start date when no end date', () => {
      const result = formatHappeningDate('2026-03-16T10:00:00Z', null, 'date-range')
      expect(result).toMatch(/March 16/)
      expect(result).not.toContain('\u2013')
    })
  })

  describe('datetime mode', () => {
    it('formats with time range when both dates provided', () => {
      const result = formatHappeningDate('2026-03-28T19:00:00Z', '2026-03-28T21:00:00Z', 'datetime')
      expect(result).toContain('from')
      expect(result).toContain('\u2013') // en-dash between times
    })

    it('formats with "at" when only start date', () => {
      const result = formatHappeningDate('2026-03-28T19:00:00Z', null, 'datetime')
      expect(result).toContain('at')
    })
  })

  it('treats invalid end date as no end date', () => {
    const result = formatHappeningDate('2026-03-16T10:00:00Z', 'invalid', 'date-range')
    expect(result).toMatch(/March 16/)
    expect(result).not.toContain('\u2013')
  })
})

describe('formatHappeningDateParts', () => {
  it('returns empty parts for null startDate', () => {
    expect(formatHappeningDateParts(null, null, 'date-range')).toEqual({
      date: '',
      time: null,
      endDate: null,
    })
  })

  describe('date-range mode', () => {
    it('returns date and endDate without time', () => {
      const result = formatHappeningDateParts('2026-03-16T10:00:00Z', '2026-06-20T18:00:00Z', 'date-range')
      expect(result.date).toMatch(/March 16/)
      expect(result.time).toBeNull()
      expect(result.endDate).toMatch(/June 20/)
    })

    it('returns only date when no end date', () => {
      const result = formatHappeningDateParts('2026-03-16T10:00:00Z', null, 'date-range')
      expect(result.date).toMatch(/March 16/)
      expect(result.time).toBeNull()
      expect(result.endDate).toBeNull()
    })
  })

  describe('datetime mode', () => {
    it('returns date, time range, and no endDate', () => {
      const result = formatHappeningDateParts('2026-03-28T19:00:00Z', '2026-03-28T21:00:00Z', 'datetime')
      expect(result.date).toBeTruthy()
      expect(result.time).toBeTruthy()
      expect(result.time).toContain('\u2013')
      expect(result.endDate).toBeNull()
    })

    it('returns date and time without range when no end', () => {
      const result = formatHappeningDateParts('2026-03-28T19:00:00Z', null, 'datetime')
      expect(result.date).toBeTruthy()
      expect(result.time).toBeTruthy()
      expect(result.time).not.toContain('\u2013')
      expect(result.endDate).toBeNull()
    })
  })
})
