import { describe, it, expect } from 'vitest'
import { formatStructuredHours } from '@/utilities/hoursHelpers'

describe('formatStructuredHours', () => {
  it('returns empty array for null input', () => {
    expect(formatStructuredHours(null)).toEqual([])
  })

  it('returns empty array for undefined input', () => {
    expect(formatStructuredHours(undefined)).toEqual([])
  })

  it('returns empty array for empty array', () => {
    expect(formatStructuredHours([])).toEqual([])
  })

  it('formats a single day', () => {
    const result = formatStructuredHours([{ day: '3', open: '10:00', close: '18:00' }])
    expect(result).toEqual([{ day: 'Wed', hours: '10 AM - 6 PM' }])
  })

  it('groups consecutive days with the same hours', () => {
    const result = formatStructuredHours([
      { day: '1', open: '10:00', close: '18:00' },
      { day: '2', open: '10:00', close: '18:00' },
      { day: '3', open: '10:00', close: '18:00' },
      { day: '4', open: '10:00', close: '18:00' },
      { day: '5', open: '10:00', close: '18:00' },
    ])
    expect(result).toEqual([{ day: 'Mon - Fri', hours: '10 AM - 6 PM' }])
  })

  it('separates non-consecutive days', () => {
    const result = formatStructuredHours([
      { day: '1', open: '10:00', close: '18:00' },
      { day: '3', open: '10:00', close: '18:00' },
    ])
    expect(result).toEqual([
      { day: 'Mon', hours: '10 AM - 6 PM' },
      { day: 'Wed', hours: '10 AM - 6 PM' },
    ])
  })

  it('separates days with different hours', () => {
    const result = formatStructuredHours([
      { day: '1', open: '10:00', close: '18:00' },
      { day: '2', open: '10:00', close: '18:00' },
      { day: '6', open: '11:00', close: '16:00' },
    ])
    expect(result).toEqual([
      { day: 'Mon - Tue', hours: '10 AM - 6 PM' },
      { day: 'Sat', hours: '11 AM - 4 PM' },
    ])
  })

  it('formats times with minutes correctly', () => {
    const result = formatStructuredHours([{ day: '0', open: '9:30', close: '17:45' }])
    expect(result).toEqual([{ day: 'Sun', hours: '9:30 AM - 5:45 PM' }])
  })

  it('formats noon and midnight correctly', () => {
    const result = formatStructuredHours([{ day: '5', open: '0:00', close: '12:00' }])
    expect(result).toEqual([{ day: 'Fri', hours: '12 AM - 12 PM' }])
  })

  it('sorts unsorted input by day number', () => {
    const result = formatStructuredHours([
      { day: '5', open: '10:00', close: '18:00' },
      { day: '1', open: '10:00', close: '18:00' },
      { day: '3', open: '10:00', close: '18:00' },
    ])
    expect(result).toEqual([
      { day: 'Mon', hours: '10 AM - 6 PM' },
      { day: 'Wed', hours: '10 AM - 6 PM' },
      { day: 'Fri', hours: '10 AM - 6 PM' },
    ])
  })
})
