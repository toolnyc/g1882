# Epic 4: "Our Story" Page (Scaffold)

**Priority**: High | **Phase**: 2 — Core features
**Note**: Scaffold only — content not ready

## Intent

New page at `/our-story` with a photo carousel + text block. This is a scaffold build — the client will populate content later.

## Current State

- No `/our-story` route exists
- No OurStory global exists
- Site navigation defined in `src/Header/GalleryNav/index.tsx`
- Existing globals pattern: `src/globals/<Name>/config.ts` registered in `payload.config.ts`
- All frontend pages use `force-dynamic` export
- Rich text uses Lexical editor

## Delta

1. **Create** OurStory Payload global with photos array + rich text story
2. **Build** photo carousel component (CSS scroll-snap, touch-friendly)
3. **Build** page route at `src/app/(frontend)/our-story/page.tsx`
4. **Add** "Our Story" to site navigation (after Artists, before Visit)
5. **Generate types** and verify scaffold renders

## Data Model

**New global**: `OurStory` (`src/globals/OurStory/config.ts`)
- `photos` — array of media uploads, ordered, max 10
- `story` — rich text (Lexical editor)
- Revalidation hook for `/our-story`

Register in `payload.config.ts`.

## UI Breakdown

**New component**: Photo carousel
- Responsive, swipeable, touch-friendly
- Keyboard navigation (arrow keys)
- CSS scroll-snap (no heavy library dependencies)
- Uses `medium` or `large` image size variants

**New route**: `src/app/(frontend)/our-story/page.tsx`
- Server component
- Fetches OurStory global
- Renders carousel above rich text
- `generateMetadata` for SEO
- `force-dynamic` export

**Modified**: `src/Header/GalleryNav/index.tsx`
- Add "Our Story" link after "Artists", before "Visit"

## Acceptance Criteria

- [ ] OurStory global appears in admin panel
- [ ] Photos array accepts up to 10 media uploads
- [ ] Rich text story field uses Lexical editor
- [ ] Photo carousel is touch-swipeable and keyboard-navigable
- [ ] Page renders at `/our-story` (even with empty content)
- [ ] "Our Story" appears in site navigation in correct position
- [ ] Types generated successfully
- [ ] Revalidation fires when OurStory global is updated

## Known Risks

- Carousel accessibility needs attention (ARIA labels, focus management)
- Empty state rendering when no photos or story content exists yet
