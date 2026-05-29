import type { Media } from '@/payload-types'

/**
 * Size metadata for a single image variant.
 * Matches the structure Payload uses for image sizes.
 */
export interface ImageSizeData {
  url?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  filesize?: number | null
  filename?: string | null
}

/**
 * Extended Media type that includes background-generated image sizes.
 *
 * The Payload imageSizes config only includes `thumbnail` for fast uploads.
 * The remaining sizes (square, small, medium, large, xlarge, og) are generated
 * by the `generateImageSizes` background job and stored on the document.
 *
 * Use this type when accessing media documents that may have background-generated sizes.
 */
export type MediaWithSizes = Omit<Media, 'sizes'> & {
  sizes?: Media['sizes'] & {
    square?: ImageSizeData | null
    small?: ImageSizeData | null
    medium?: ImageSizeData | null
    large?: ImageSizeData | null
    xlarge?: ImageSizeData | null
    og?: ImageSizeData | null
  }
}
