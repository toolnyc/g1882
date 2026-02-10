# Payload CMS Patterns Improvement Plan

Branch: `feature/payload-patterns` | Skill: `payload-cms-patterns`

## High Priority

### 1. Add missing revalidation hook for Space global
- **File**: Create `src/globals/Space/hooks/revalidateSpace.ts`
- **Problem**: Space global (structuredHours, admission) is used on frontend (visit page, footer, GalleryHero open/closed status) but has NO `afterChange` hook -- changes don't trigger page revalidation
- **Change**: Create revalidation hook that revalidates `/space`, `/visit`, and footer-dependent pages
- **Follow pattern from**: `src/globals/Home/hooks/revalidateHome.ts`, `src/globals/Visit/hooks/revalidateVisit.ts`

### 2. Fix Home global revalidation to include homepage path
- **File**: `src/globals/Home/hooks/revalidateHome.ts:5-13`
- **Problem**: Hook only revalidates tag `global_home` but doesn't revalidate the actual homepage path
- **Change**: Add `revalidatePath('/')` to ensure homepage updates immediately when Home global is edited

### 3. Add live preview to globals
- **Files**: `src/globals/Home/config.ts`, `src/globals/Visit/config.ts`, `src/globals/Space/config.ts`
- **Problem**: No globals have live preview configured, so editors can't see changes in real-time
- **Change**: Add `admin.livePreview` config pointing to appropriate frontend routes:
  - Home -> `/`
  - Visit -> `/visit`
  - Space -> `/space`

### 4. Reorganize Home global with tabs
- **File**: `src/globals/Home/config.ts:14-127`
- **Problem**: 14 fields in a flat structure; hard for editors to navigate
- **Model to follow**: `src/globals/Visit/config.ts` (exemplary tab/group organization)
- **Change**: Add tab structure:
  1. **Hero** tab: heroImage, heroVideoUrl
  2. **Mission** tab: missionCaption, missionStatement, missionCtaText, missionCtaUrl
  3. **Featured Artist** tab: featuredArtist, featuredArtistImage, featuredArtistDescription
  4. **Visit Section** tab: visitSectionEnabled, visitTitle, visitDescription, visitImage, visitCtaText, visitCtaUrl

## Medium Priority

### 5. Add admin config to Media collection
- **File**: `src/collections/Media.ts:17-80`
- **Problem**: Media collection has no `admin` configuration -- no `defaultColumns`, no `useAsTitle`
- **Change**: Add `admin: { defaultColumns: ['filename', 'alt', 'updatedAt'], useAsTitle: 'filename' }`
- **Also**: Add `admin.description` to `alt` and `caption` fields for editor guidance

### 6. Add defaultColumns to Categories collection
- **File**: `src/collections/Categories.ts:15-17`
- **Problem**: Has `useAsTitle: 'title'` but no `defaultColumns`
- **Change**: Add `defaultColumns: ['title', 'slug', 'updatedAt']`

### 7. Add tab organization to Artists collection
- **File**: `src/collections/Artists/index.ts`
- **Problem**: Complex field set (works array, socialLinks, website) not grouped
- **Change**: Add tabs:
  1. **Profile** tab: name, bio, image
  2. **Gallery** tab: works array
  3. **Links** tab: website, socialLinks

### 8. Add tab organization to Happenings collection
- **File**: `src/collections/Happenings/index.ts`
- **Problem**: Dates, type, description, artists, deprecated fields all mixed together
- **Change**: Add tabs:
  1. **Details** tab: title, type, description, heroImage
  2. **Schedule** tab: startDate, endDate, isActiveOverride, isActive
  3. **People** tab: artists

### 9. Fix Categories slug field positioning
- **File**: `src/collections/Categories.ts:24-26`
- **Problem**: `slugField({ position: undefined })` disables custom positioning
- **Change**: `slugField({ position: 'sidebar' })` for consistency with other collections

### 10. Add revalidation hook for Categories
- **File**: `src/collections/Categories.ts`
- **Problem**: Categories used in search results and archive blocks, but changes don't trigger revalidation
- **Change**: Add `afterChange` hook that revalidates search page: `revalidateTag('search-index')`

## Lower Priority

### 11. Fix populateAuthors hook efficiency
- **File**: `src/collections/Posts/hooks/populateAuthors.ts:8-37`
- **Problem**: N+1 query pattern -- calls `findByID` per author in a loop
- **Change**: Batch load all authors in single query

### 12. Consider drafts for Categories
- **File**: `src/collections/Categories.ts`
- **Problem**: Public-facing collection lacks draft/publish -- category name changes go live immediately
- **Change**: Add `versions: { drafts: { autosave: { interval: 100 } }, maxPerDoc: 3 }`
- **Note**: Low risk since categories are rarely edited, but maintains pattern consistency

### 13. Clean up deprecated Happenings fields
- **File**: `src/collections/Happenings/index.ts:106-131`
- **Fields**: `category`, `featuredPerson`, `featuredPersonName`
- **Change**: Either hide from admin UI with `admin: { hidden: true }` or remove entirely after data migration
- **Prerequisite**: Verify no frontend code depends on these fields

### 14. Add `admin.description` to undocumented fields
- **Files**: Multiple collections
- **Fields needing descriptions**:
  - Media: `alt`, `caption`
  - Artists: `name`, `bio`, `image`
  - Happenings: `title`, `description`
- **Change**: Add helpful `admin.description` strings for content editors

### 15. Standardize field ordering across collections
- **All collection configs**
- **Establish pattern**:
  1. Core content fields (name/title, description/bio)
  2. Media fields (image, heroImage)
  3. Relationship fields (artists, categories)
  4. Metadata in sidebar (featured, dates, status, slug)
  5. Computed/deprecated fields last

## Validation

After implementing:
1. Run `pnpm generate:types` after any schema changes
2. Run `pnpm generate:importmap` if admin UI components changed
3. Run `pnpm build` to verify compilation
4. Run `pnpm test:pre-deploy`
5. Test admin panel: verify tabs render correctly, columns display properly
6. Test live preview on globals
7. Verify revalidation works: edit Space global, check frontend updates
