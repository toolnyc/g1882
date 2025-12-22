import type { Payload } from 'payload'
import { mockGalleryInfo } from './mockData'

export async function seedGlobals(payload: Payload): Promise<void> {
  // Seed Space
  await payload.updateGlobal({
    slug: 'space',
    data: {
      name: mockGalleryInfo.name,
      tagline: mockGalleryInfo.tagline,
      description: mockGalleryInfo.description,
      address: mockGalleryInfo.address,
      phone: mockGalleryInfo.phone,
      email: mockGalleryInfo.email,
      hours: mockGalleryInfo.hours,
      admission: mockGalleryInfo.admission,
    },
    depth: 0,
    context: {
      disableRevalidate: true,
    },
  })

  // Seed Home
  await payload.updateGlobal({
    slug: 'home',
    data: {
      missionStatement:
        'We believe art has the power to transform our understanding of place, to bridge the gap between human creativity and the natural world, and to inspire new ways of seeing the landscape we call home.',
      missionCtaText: 'Learn More About Us',
      missionCtaUrl: '/about',
      visitTitle: 'Escape to the Duneland',
      visitDescription:
        'Located under an hours drive from Chicago, Gallery 1882, in the heart of Chesterton, Indiana is the gateway to the Indiana Dunes National Park. Always open, always free, always inspiring.',
      visitCtaText: 'Plan Your Visit',
      visitCtaUrl: '/visit',
    },
    depth: 0,
    context: {
      disableRevalidate: true,
    },
  })
}

