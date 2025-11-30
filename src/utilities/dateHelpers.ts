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

