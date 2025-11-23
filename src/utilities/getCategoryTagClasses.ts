/**
 * Returns Tailwind classes for category tags based on the category type
 * @param category - The category string (e.g., "Exhibition", "Event", "Workshop")
 * @returns Object with background and text color classes
 */
export function getCategoryTagClasses(category: string | null | undefined): {
  bgClass: string
  textClass: string
} {
  if (!category) {
    return {
      bgClass: 'bg-bright-lake/10',
      textClass: 'text-bright-lake',
    }
  }

  const normalizedCategory = category.toLowerCase().trim()

  // Color mapping based on category type
  switch (normalizedCategory) {
    case 'exhibition':
      return {
        bgClass: 'bg-lake/10',
        textClass: 'text-lake',
      }
    case 'event':
      return {
        bgClass: 'bg-forest/50',
        textClass: 'text-off-white',
      }
    case 'workshop':
      return {
        bgClass: 'bg-bright-lake/10',
        textClass: 'text-bright-lake',
      }
    case 'talk':
    case 'lecture':
      return {
        bgClass: 'bg-navy/10',
        textClass: 'text-navy',
      }
    default:
      return {
        bgClass: 'bg-bright-lake/10',
        textClass: 'text-bright-lake',
      }
  }
}
