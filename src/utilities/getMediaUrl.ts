import canUseDOM from './canUseDOM'
import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const encodedTag = cacheTag && cacheTag !== '' ? encodeURIComponent(cacheTag) : null
  const appendCacheTag = (value: string) => (encodedTag ? `${value}?${encodedTag}` : value)

  const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://')
  if (isAbsoluteUrl) {
    return appendCacheTag(url)
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  // When rendering on the server we need to keep URLs relative so Next/Image
  // treats them as same-origin rather than remote localhost requests.
  if (!canUseDOM) {
    return appendCacheTag(normalizedPath)
  }

  const baseUrl = getClientSideURL()
  const origin = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return appendCacheTag(`${origin}${normalizedPath}`)
}
