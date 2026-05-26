# Gallery 1882 Context

Terminology and domain language for the Gallery 1882 Next.js and Payload CMS application.

## Language

**Collection**:
A standard database table containing multiple documents, each with a unique ID and usually a slug. Can be created, updated, and deleted. Examples: Artists, Posts, Happenings.
_Avoid_: Table, list

**Global**:
A singleton document representing a single instance of data. It cannot be deleted or duplicated, only updated. Examples: SiteSettings, Home.
_Avoid_: Singleton, config document

**Revalidation**:
The process of clearing the Next.js internal data cache (`unstable_cache`) by specific tags or paths, forcing the next request to pull fresh data from the database.
_Avoid_: Purging, cache busting

**Edge Cache**:
The CDN caching layer (Cloudflare or Vercel Edge) controlled by middleware `Cache-Control` headers. We disable this for frontend routes to rely on Next.js data caching instead.
_Avoid_: CDN cache, Cloudflare cache

## Example Dialogue

**Developer**: "When an editor updates an artist's bio, we need to clear the edge cache."
**Domain Expert**: "Actually, we don't use the edge cache for frontend routes anymore to prevent staleness. We rely entirely on revalidation of the Next.js data cache."
**Developer**: "Right, so the Payload hook fires `revalidateTag('artists')`. Should we use the same hook for SiteSettings?"
**Domain Expert**: "Yes, we use a single unified factory for revalidation, but since SiteSettings is a global and can't be deleted, it only registers the `afterChange` hook, whereas the artist collection registers both `afterChange` and `afterDelete`."
