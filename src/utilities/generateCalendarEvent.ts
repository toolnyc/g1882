/**
 * Generates an .ics file content for calendar events
 * Supports Google Calendar, Apple Calendar, Outlook, and other calendar applications
 */

export interface CalendarEvent {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  location?: string
  url?: string
}

/**
 * Escapes special characters in ICS format
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Formats date to ICS format (YYYYMMDDTHHMMSSZ)
 */
function formatICSDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

/**
 * Generates .ics file content for a calendar event
 */
export function generateCalendarEvent(event: CalendarEvent): string {
  const lines: string[] = []

  // Header
  lines.push('BEGIN:VCALENDAR')
  lines.push('VERSION:2.0')
  lines.push('PRODID:-//Gallery 1882//Calendar Event//EN')
  lines.push('CALSCALE:GREGORIAN')
  lines.push('METHOD:PUBLISH')

  // Event
  lines.push('BEGIN:VEVENT')
  lines.push(`UID:${Date.now()}-${Math.random().toString(36).substring(7)}@gallery1882.org`)
  lines.push(`DTSTAMP:${formatICSDate(new Date())}`)
  lines.push(`DTSTART:${formatICSDate(event.startDate)}`)

  if (event.endDate) {
    lines.push(`DTEND:${formatICSDate(event.endDate)}`)
  } else {
    // If no end date, set end to 1 hour after start
    const endDate = new Date(event.startDate)
    endDate.setHours(endDate.getHours() + 1)
    lines.push(`DTEND:${formatICSDate(endDate)}`)
  }

  lines.push(`SUMMARY:${escapeICS(event.title)}`)

  if (event.description) {
    // ICS format requires DESCRIPTION to be wrapped at 75 characters
    const description = escapeICS(event.description)
    const maxLength = 75
    for (let i = 0; i < description.length; i += maxLength) {
      const chunk = description.substring(i, i + maxLength)
      if (i === 0) {
        lines.push(`DESCRIPTION:${chunk}`)
      } else {
        lines.push(` ${chunk}`)
      }
    }
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICS(event.location)}`)
  }

  if (event.url) {
    lines.push(`URL:${event.url}`)
  }

  lines.push('END:VEVENT')
  lines.push('END:VCALENDAR')

  return lines.join('\r\n')
}

/**
 * Downloads .ics file in browser
 */
export function downloadCalendarEvent(event: CalendarEvent, filename?: string): void {
  const icsContent = generateCalendarEvent(event)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `${event.title.replace(/\s+/g, '-').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

