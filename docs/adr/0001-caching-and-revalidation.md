# Unify Revalidation and Remove Edge Caching

**Context**: Editors were experiencing stale content on the live site after saving changes in Payload CMS. This was caused by a double-caching topology: Next.js was caching data via `unstable_cache` for 60 seconds, and Cloudflare was caching the HTML via an `s-maxage=60` header set in `src/middleware.ts`. Payload's `revalidateTag` calls successfully cleared the Next.js data cache, but could not reach Cloudflare to purge the HTML edge cache. 

**Decision**: 
1. We are removing the custom `Cache-Control` edge caching headers (`s-maxage`, `stale-while-revalidate`) for frontend routes in the Next.js middleware.
2. We are relying entirely on `force-dynamic` rendering combined with Next.js `unstable_cache` as the single source of truth for caching, bringing the app back to native Next.js/Payload defaults.
3. We are replacing the 11 disparate Payload revalidation hooks with a single, unified `createRevalidateHook` factory that gracefully handles both Collections (with delete events) and Globals (singletons without delete events).

**Why**: Removing the edge cache directive ensures that when Payload fires `revalidateTag`, the very next request will receive fresh HTML generated from the newly updated database record. The unified factory simplifies maintenance and ensures consistent revalidation behavior across all content types.
