import React from 'react'
import { GalleryHero } from '@/components/GalleryHero'
import { CurrentExhibition } from '@/components/CurrentExhibition'
import { VisitSection } from '@/components/VisitSection'
import { ArtistFeature } from '@/components/ArtistFeature'
import { UpcomingHappenings } from '@/components/UpcomingHappenings'
import { MissionSection } from '@/components/MissionSection'
import { GalleryInfo } from '@/components/GalleryInfo'
import { getCachedHappenings } from '@/utilities/getHappenings'
import { getCachedSpace } from '@/utilities/getSpace'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Artist, Media, Home } from '@/payload-types'

export default async function HomePage() {
  // Fetch home global data
  const homeData = (await getCachedGlobal('home', 2)()) as Home
  const getHappenings = getCachedHappenings()
  const activeHappenings = await getHappenings()

  // Get the most active happening (or first featured)
  const currentHappening = activeHappenings.find((h) => h.featured) || activeHappenings[0]
  // Get upcoming happenings (not active, future dates)
  const getUpcoming = getCachedHappenings({ upcoming: true })
  const upcomingHappenings = await getUpcoming()

  // Fetch space global for visit section
  const space = await getCachedSpace()()

  // Get featured happening for artist feature
  const getFeaturedHappenings = getCachedHappenings({ featured: true })
  const featuredHappenings = await getFeaturedHappenings()

  const featuredHappening = featuredHappenings[0] || currentHappening

  // Resolve featured artist - prioritize home global, then fallback to happening
  let featuredArtistData: {
    id: string
    name: string
    title: string
    bio: string
    image: string
    exhibitionId: string
    artistSlug: string
  } | null = null

  // Check if home global has a featured artist
  if (homeData?.featuredArtist) {
    const artist =
      typeof homeData.featuredArtist === 'object' && homeData.featuredArtist
        ? (homeData.featuredArtist as Artist)
        : null

    if (artist) {
      const artistImage =
        typeof artist.image === 'object' && artist.image ? (artist.image as Media) : null
      const imageUrl = artistImage?.url
        ? getMediaUrl(artistImage.url, artistImage.updatedAt)
        : '/media/test-artist.jpg'

      featuredArtistData = {
        id: artist.id,
        name: artist.name,
        title: artist.name, // Use artist name as title when from home global
        bio: artist.bio || '',
        image: imageUrl,
        exhibitionId: '', // No exhibition ID when from home global
        artistSlug: artist.slug,
      }
    }
  }

  // Fallback to featured happening if no artist from home global
  if (!featuredArtistData && featuredHappening) {
    const artist =
      typeof featuredHappening.featuredPerson === 'object' && featuredHappening.featuredPerson
        ? (featuredHappening.featuredPerson as Artist)
        : null

    if (artist) {
      const artistImage =
        typeof artist.image === 'object' && artist.image ? (artist.image as Media) : null
      const imageUrl = artistImage?.url
        ? getMediaUrl(artistImage.url, artistImage.updatedAt)
        : '/media/test-artist.jpg'

      featuredArtistData = {
        id: artist.id,
        name: artist.name,
        title: featuredHappening.title,
        bio: artist.bio || '',
        image: imageUrl,
        exhibitionId: featuredHappening.id,
        artistSlug: artist.slug,
      }
    } else if (featuredHappening.featuredPersonName) {
      // Fallback to featuredPersonName if no artist relationship
      featuredArtistData = {
        id: featuredHappening.id,
        name: featuredHappening.featuredPersonName,
        title: featuredHappening.title,
        bio: '',
        image: '/media/test-artist.jpg',
        exhibitionId: featuredHappening.id,
        artistSlug: '',
      }
    }
  }

  // Construct visit section - prioritize home global, then fallback to space data
  const visitSectionData = homeData?.visitTitle
    ? {
        title: homeData.visitTitle,
        description: homeData.visitDescription || '',
        image:
          homeData.visitImage && typeof homeData.visitImage === 'object'
            ? getMediaUrl(
                (homeData.visitImage as Media).url,
                (homeData.visitImage as Media).updatedAt,
              )
            : '/media/test-space.jpg',
        ctaText: homeData.visitCtaText || 'Plan Your Visit',
        ctaUrl: homeData.visitCtaUrl || '/visit',
      }
    : space
      ? {
          title: 'Escape to the Duneland',
          description:
            space.description ||
            'Located under an hours drive from Chicago, Gallery 1882, in the heart of Chesterton, Indiana is the gateway to the Indiana Dunes National Park. Always open, always free, always inspiring.',
          image: '/media/test-space.jpg',
          ctaText: 'Plan Your Visit',
          ctaUrl: '/visit',
        }
      : null

  return (
    <main className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <GalleryHero />

      {/* Mission Section */}
      <MissionSection
        missionStatement={homeData?.missionStatement}
        missionCtaText={homeData?.missionCtaText}
        missionCtaUrl={homeData?.missionCtaUrl}
      />

      {/* Current Happening */}
      {currentHappening && (
        <CurrentExhibition
          happening={{
            ...currentHappening,
            heroImage:
              typeof currentHappening.heroImage === 'object' && currentHappening.heroImage
                ? {
                    url: getMediaUrl(
                      (currentHappening.heroImage as Media).url,
                      (currentHappening.heroImage as Media).updatedAt,
                    ),
                    alt: (currentHappening.heroImage as Media).alt || undefined,
                  }
                : currentHappening.heroImage || null,
            featured: currentHappening.featured ?? false,
            isActive: currentHappening.isActive ?? false,
          }}
        />
      )}

      {/* Visit Section */}
      {visitSectionData && <VisitSection {...visitSectionData} />}

      {/* Artist Feature */}
      {featuredArtistData && <ArtistFeature {...featuredArtistData} />}

      {/* Upcoming Happenings */}
      {upcomingHappenings.length > 0 && (
        <UpcomingHappenings
          happenings={upcomingHappenings.slice(0, 3).map((h) => ({
            ...h,
            featured: h.featured ?? false,
          }))}
        />
      )}

      {/* Gallery Info */}
    </main>
  )
}
