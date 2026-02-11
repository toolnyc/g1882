interface StructuredHour {
  day: string
  open: string
  close: string
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_ABBREVS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Convert a 24h time string (e.g. "10:00") to 12h display (e.g. "10 AM").
 * Drops minutes when they are :00 for cleaner display.
 */
const formatTime12h = (time24: string): string => {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m ? `${hour12}:${String(m).padStart(2, '0')} ${period}` : `${hour12} ${period}`
}

interface FormattedHoursLine {
  day: string
  hours: string
}

/**
 * Convert structured hours into display-friendly lines, grouping consecutive
 * days with the same open/close times (e.g. "Mon - Fri: 10 AM - 6 PM").
 */
export const formatStructuredHours = (
  structuredHours: StructuredHour[] | null | undefined,
): FormattedHoursLine[] => {
  if (!structuredHours || structuredHours.length === 0) return []

  // Sort by day number and build a map
  const sorted = [...structuredHours].sort((a, b) => Number(a.day) - Number(b.day))

  // Group consecutive days with the same open/close
  const groups: { days: number[]; open: string; close: string }[] = []
  for (const entry of sorted) {
    const dayNum = Number(entry.day)
    const last = groups[groups.length - 1]
    if (
      last &&
      last.open === entry.open &&
      last.close === entry.close &&
      dayNum === last.days[last.days.length - 1] + 1
    ) {
      last.days.push(dayNum)
    } else {
      groups.push({ days: [dayNum], open: entry.open, close: entry.close })
    }
  }

  return groups.map((g) => {
    const timeRange = `${formatTime12h(g.open)} - ${formatTime12h(g.close)}`
    if (g.days.length === 1) {
      return { day: DAY_ABBREVS[g.days[0]], hours: timeRange }
    }
    return {
      day: `${DAY_ABBREVS[g.days[0]]} - ${DAY_ABBREVS[g.days[g.days.length - 1]]}`,
      hours: timeRange,
    }
  })
}

/**
 * Get full day name from day number string.
 */
export const getDayName = (day: string): string => DAY_NAMES[Number(day)] || day
