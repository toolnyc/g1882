# Epic 6: Masonry Grid for Artist Pages

**Priority**: Medium | **Phase**: 3 — UI refinements
**Depends on**: Epic 1 (images must be uploadable)

## Intent

Replace the uniform grid on artist detail pages with a masonry layout that shows natural aspect ratios. The gallery displays fine art — uniform cropping undermines the artwork.

## Current State

- Artist detail page at `src/app/(frontend)/artists/[slug]/page.tsx`
- Works displayed with `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` + `aspect-square`
- Hover overlay shows caption (`group-hover:opacity-100`)
- Hover is desktop-only — no touch support for captions
- Works array supports up to 100 items (after Epic 5)

## Delta

1. **Replace** uniform grid with CSS `columns` masonry layout — remove aspect ratio constraints
2. **Add** touch support for caption overlays (tap-to-reveal on touch devices)
3. **Add** lazy loading for galleries with 50+ works
4. **Test** with large image sets (70+ works)

## Data Model

No schema changes.

## UI Breakdown

**Modified**: `src/app/(frontend)/artists/[slug]/page.tsx`
- Replace grid classes with CSS `columns` masonry
- Remove `aspect-square` constraint
- Preserve hover overlay behavior on desktop
- Add tap-to-reveal on touch devices (or show captions below images on mobile breakpoints)

**Performance**:
- `loading="lazy"` on below-fold `<Image />` elements
- First ~20 images render eagerly
- Consider shared masonry component with Epic 5's exhibition grid

## Acceptance Criteria

- [ ] Works display at natural aspect ratios (no cropping)
- [ ] Layout uses CSS columns masonry (no JS layout library)
- [ ] Hover captions work on desktop
- [ ] Touch/tap reveals captions on mobile
- [ ] Images below fold use `loading="lazy"`
- [ ] First ~20 images load eagerly
- [ ] 70+ works render without layout jank or scroll performance issues
- [ ] Works on mobile and desktop breakpoints

## Known Risks

- CSS `columns` can reorder items in unexpected ways (fills columns top-to-bottom, not left-to-right)
- Touch caption state management (tap to open, tap again or tap elsewhere to close)
- Memory pressure on mobile with 70+ high-res images
