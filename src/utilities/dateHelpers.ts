type DateFormat = 'long' | 'short'

const DATE_FORMATTERS: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  long: { month: 'long', day: 'numeric', year: 'numeric' },
  short: { month: 'short', day: 'numeric', year: 'numeric' },
}

const parseDate = (value: string | Date) => (typeof value === 'string' ? new Date(value) : value)

export const formatDate = (
  value: string | Date | null | undefined,
  format: DateFormat = 'long',
): string => {
  if (!value) {
    return ''
  }

  const date = parseDate(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString('en-US', DATE_FORMATTERS[format])
}

export const formatDateRange = (
  start: string | Date | null | undefined,
  end?: string | Date | null | undefined,
  format: DateFormat = 'short',
) => {
  const startLabel = formatDate(start, format)
  const endLabel = formatDate(end, format)

  if (startLabel && endLabel) {
    return `${startLabel} - ${endLabel}`
  }

  return startLabel || endLabel || ''
}

// --- Type-driven date display ---

export type DateDisplayMode = 'date-range' | 'datetime'

/**
 * Format a date as "Month Day" (no year).
 * e.g. "March 16"
 */
const formatMonthDay = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

/**
 * Format a time in 12-hour format without minutes when on the hour.
 * e.g. "7pm", "7:30pm"
 */
const formatTime12 = (date: Date): string => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'pm' : 'am'
  const displayHour = hours % 12 || 12

  if (minutes === 0) {
    return `${displayHour}${period}`
  }
  return `${displayHour}:${minutes.toString().padStart(2, '0')}${period}`
}

/**
 * Format dates for "date-range" mode: "March 16\u2013June 20"
 * Shows month + day only, no year, en-dash separator.
 */
const formatDateRangeDisplay = (
  startDate: Date,
  endDate: Date | null,
): string => {
  const startLabel = formatMonthDay(startDate)
  if (endDate) {
    return `${startLabel}\u2013${formatMonthDay(endDate)}`
  }
  return startLabel
}

/**
 * Format dates for "datetime" mode: "March 28 from 7\u20139pm" or "March 28 at 7pm"
 * Shows month + day + time, no year.
 */
const formatDateTimeDisplay = (
  startDate: Date,
  endDate: Date | null,
): string => {
  const dayLabel = formatMonthDay(startDate)
  const startTime = formatTime12(startDate)

  if (endDate) {
    const endTime = formatTime12(endDate)
    return `${dayLabel} from ${startTime}\u2013${endTime}`
  }

  return `${dayLabel} at ${startTime}`
}

/**
 * Main entry point for type-driven date formatting.
 * Dispatches to the right formatter based on dateDisplayMode.
 */
export const formatHappeningDate = (
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  dateDisplayMode: DateDisplayMode,
): string => {
  if (!startDate) return ''

  const start = parseDate(startDate)
  if (Number.isNaN(start.getTime())) return ''

  const end = endDate ? parseDate(endDate) : null
  if (end && Number.isNaN(end.getTime())) {
    // Invalid end date — treat as no end date
    return formatHappeningDate(startDate, null, dateDisplayMode)
  }

  if (dateDisplayMode === 'date-range') {
    return formatDateRangeDisplay(start, end)
  }

  return formatDateTimeDisplay(start, end)
}
