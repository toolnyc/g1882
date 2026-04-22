import { unstable_cache } from 'next/cache'
import { logger } from '@/lib/logger'

/**
 * Wrapper around unstable_cache that logs cache operations.
 * Drop-in replacement — same signature as unstable_cache but adds
 * structured logging for observability via Vercel log drain → Axiom.
 */
export function cachedFetch<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  options: { tags?: string[]; revalidate?: number | false },
): () => Promise<T> {
  const cacheKey = keyParts.join(':')

  return async () => {
    const start = performance.now()
    try {
      const result = await unstable_cache(fn, keyParts, options)()
      const duration = Math.round(performance.now() - start)
      logger.debug('cache_fetch', {
        cacheKey,
        tags: options.tags,
        durationMs: duration,
      })
      return result
    } catch (error) {
      const duration = Math.round(performance.now() - start)
      logger.error('cache_fetch_error', {
        cacheKey,
        tags: options.tags,
        durationMs: duration,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }
}
