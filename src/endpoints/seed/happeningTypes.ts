import type { HappeningType } from '@/payload-types'
import type { Payload, PayloadRequest } from 'payload'

const TYPE_DEFINITIONS = [
  { name: 'Exhibition', slug: 'exhibition', dateDisplayMode: 'date-range' as const },
  { name: 'Event', slug: 'event', dateDisplayMode: 'datetime' as const },
  { name: 'Talk', slug: 'talk', dateDisplayMode: 'datetime' as const },
]

export async function seedHappeningTypes(
  payload: Payload,
  req: PayloadRequest,
): Promise<Map<string, HappeningType>> {
  const typeMap = new Map<string, HappeningType>()

  for (const typeDef of TYPE_DEFINITIONS) {
    const happeningType = await payload.create({
      collection: 'happening-types',
      data: typeDef,
      req,
      context: { disableRevalidate: true },
    })
    typeMap.set(typeDef.slug, happeningType)
  }

  return typeMap
}
