'use client'
import React from 'react'
import { FeatureBanner } from '../FeatureBanner'

interface Artist {
  id: string
  name: string
  bio: string
  image: string
  exhibitions: string[]
  slug?: string
}

interface CurrentArtistBannerProps {
  artist: Artist
  exhibitionTitle?: string
  label?: string | null
}

export const CurrentArtistBanner: React.FC<CurrentArtistBannerProps> = ({
  artist,
  exhibitionTitle,
  label,
}) => {
  return (
    <FeatureBanner
      image={artist.image}
      imageAlt={artist.name}
      title={artist.name}
      subtitle={exhibitionTitle}
      description={artist.bio}
      label={label || 'Currently Showing'}
      href={artist.slug ? `/artists/${artist.slug}` : undefined}
      showLiveIndicator={true}
    />
  )
}
