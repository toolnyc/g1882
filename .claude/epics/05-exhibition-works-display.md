# Epic 5: Exhibition Works Display

**Priority**: High | **Phase**: 2 — Core features

## Intent

Exhibition pages need to show associated artwork. Works live on Artists but need a way to indicate which works are in a specific show. This enables the gallery to curate per-exhibition artwork displays.

## Current State

- Artists have a `works[]` array (image + title + caption) in `src/collections/Artists/index.ts`
- `works` array has `maxRows: 50`
- Happenings have an `artists` relationship (hasMany)
- Exhibition detail page at `src/app/(frontend)/happenings/[slug]/page.tsx`
- No way to tag works to specific exhibitions
- No contact info field on Happenings

## Delta

1. **Add** `happenings` relationship to each work in the Artist's works array — optional, hasMany
2. **Increase** works limit from 50 to 100
3. **Build** works masonry grid on exhibition detail page — query artists, filter works by happening ID
4. **Add** `contactInfo` rich text field to Happenings collection under a new "Exhibition Details" tab
5. **Generate types** and test

## Data Model

**Artists** (`src/collections/Artists/index.ts`):
- Add to `works` array fields: `{ name: 'happenings', type: 'relationship', relationTo: 'happenings', hasMany: true, required: false }`
- Change `maxRows: 50` → `maxRows: 100`

**Happenings** (`src/collections/Happenings/index.ts`):
- Add `contactInfo` — rich text field, optional, under new "Exhibition Details" tab

## UI Breakdown

**Modified**: `src/app/(frontend)/happenings/[slug]/page.tsx`
- Query all artists associated with the happening
- Filter each artist's works for ones tagged with this happening's ID
- Render works in CSS columns masonry grid with hover captions
- Render `contactInfo` rich text below the works grid (if populated)

## Acceptance Criteria

- [ ] Works in artist admin have optional "happenings" relationship field
- [ ] Admin description reads "Tag which shows/exhibitions this work appears in"
- [ ] Works limit is 100
- [ ] Exhibition detail page shows tagged works in masonry grid
- [ ] Hover captions display title and caption on works
- [ ] `contactInfo` renders below works grid when populated
- [ ] Types generate successfully
- [ ] End-to-end: create artist with works → tag works to happening → works appear on exhibition page

## Known Risks

- Query complexity: fetching all artists then filtering works client-side vs. building a server query
- Large exhibitions with many artists could mean heavy data fetching
- Masonry grid reused in Epic 6 — consider shared component
