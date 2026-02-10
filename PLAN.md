# MongoDB Optimization Plan

Branch: `feature/mongodb-optimization` | Skill: `mongodb-best-practices`

## High Priority

### 1. Add missing indexes to collection slug fields
- **Files**: `src/collections/Happenings/index.ts`, `src/collections/Artists/index.ts`, `src/collections/Posts/index.ts`
- **Problem**: No `index: true` on any slug fields despite being the primary lookup field for detail pages
- **Change**: Add `index: true` to all `slug` fields used in `where` clauses
- **Impact**: Very high -- every detail page query (`getHappeningBySlug`, `getArtistBySlug`, `getPostBySlug`) currently does a full collection scan

### 2. Add compound indexes for common query patterns
- **File**: Collection configs or MongoDB directly
- **Indexes needed**:
  - Happenings: `{ _status: 1, startDate: 1 }` (date range queries)
  - Happenings: `{ _status: 1, slug: 1 }` (detail page lookups)
  - Happenings: `{ featured: 1, _status: 1 }` (featured queries)
  - Posts: `{ _status: 1, publishedAt: -1 }` (journal page sorting)
  - Artists: `{ _status: 1, name: 1 }` (directory sorting)
- **Impact**: All list page queries will use indexes instead of collection scans

### 3. Add `select` projections to list page queries
- **Files**: `src/utilities/getHappenings.ts:94`, `src/utilities/getArtists.ts:8`, `src/utilities/getPosts.ts:8`
- **Problem**: List queries fetch full documents including rich text `description`, `works` arrays, `socialLinks` etc. when only title/slug/dates are rendered
- **Change**: Add `select` parameter to limit returned fields:
  - Happenings list: `{ title, slug, startDate, endDate, featured, type, artists, heroImage, isActive }`
  - Artists list: `{ name, slug, image, bio }`
  - Posts list: `{ title, slug, publishedAt, heroImage }`
- **Impact**: Significant reduction in data transfer and memory usage

### 4. Consolidate homepage happenings queries
- **File**: `src/app/(frontend)/page.tsx:22-57`
- **Problem**: Three separate `getCachedHappenings()` calls at depth 2 (active, upcoming exhibitions, upcoming happenings)
- **Change**: Fetch once, filter in-memory server-side
- **Impact**: Reduces 3 DB queries to 1 on homepage

## Medium Priority

### 5. Add `maxRows` to unbounded arrays
- **Files**: `src/collections/Artists/index.ts` (works array line 51, socialLinks line 86)
- **Problem**: Arrays have no `maxRows` limit -- could theoretically grow to 16MB document limit
- **Note**: `src/globals/Visit/config.ts` already uses `maxRows: 3` as a good pattern
- **Change**: Add `maxRows: 50` to works, `maxRows: 10` to socialLinks

### 6. Add `startDate` index for Happenings
- **File**: `src/collections/Happenings/index.ts`
- **Problem**: `startDate` used in range queries (`greater_than_equal`, `less_than_equal`) and sorting but not indexed
- **Change**: Add `index: true` to the `startDate` field config

### 7. Fix redirects query limit
- **File**: `src/utilities/getRedirects.ts:11`
- **Problem**: Uses `limit: 0` (no limit) -- fetches entire redirects collection into memory
- **Change**: Set reasonable limit (e.g., `limit: 500`) or implement pagination

### 8. Optimize global depth for Home
- **File**: `src/utilities/getGlobals.ts`
- **Problem**: Home global fetched at depth 0 but contains `featuredArtist` relationship that needs population
- **Change**: Use depth 1 when fetching 'home' global; keep depth 0 for others

## Lower Priority

### 9. Remove deprecated fields from Happenings
- **File**: `src/collections/Happenings/index.ts:106-131`
- **Fields**: `category`, `featuredPerson`, `featuredPersonName` (all marked deprecated)
- **Prerequisites**: Verify no frontend code still reads these fields; update `happenings/page.tsx:92,120` and `happenings/[slug]/page.tsx:47-53`
- **Impact**: Smaller documents, cleaner schema

### 10. Fix populateAuthors N+1 query
- **File**: `src/collections/Posts/hooks/populateAuthors.ts:8-37`
- **Problem**: Loop calls `payload.findByID()` once per author (N+1 pattern)
- **Change**: Batch load all authors in a single `payload.find()` query with `where: { id: { in: authorIds } }`

### 11. Add index monitoring documentation
- Document how to check index usage: `db.happenings.aggregate([{ $indexStats: {} }])`
- Document slow query profiling: `db.setProfilingLevel(1, { slowms: 100 })`
- Add `pnpm audit:db` script for periodic checks

## Validation

After implementing:
1. Run `pnpm generate:types` if any schema changes
2. Run `pnpm build` to verify TypeScript compilation
3. Run `pnpm test:pre-deploy` to verify tests pass
4. Test detail page load times before/after indexing
5. Verify homepage renders correctly with consolidated query
