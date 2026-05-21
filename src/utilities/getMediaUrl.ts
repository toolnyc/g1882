/**
 * Processes media resource URL to ensure proper formatting.
 *
 * Relative URLs (e.g. `/api/media/file/...`) are kept relative so Next.js Image
 * treats them as same-origin, bypassing remotePatterns restrictions.
 * Absolute URLs (e.g. Blob CDN) pass through unchanged.
 *
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
  return appendCacheTag(normalizedPath)
}
