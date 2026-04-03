# Epic 7: Homepage & Happening UI Refinements

**Priority**: Medium | **Phase**: 3 — UI refinements

## Intent

Collected UI improvements from the Mar 31 client meeting. Multiple small-to-medium changes across homepage and happening-related components.

## Current State

- Homepage sections: GalleryHero, What's Happening, Featured Artist, Visit
- Happening components: `CurrentExhibition`, `FeatureBanner`, `DirectoryListing`, `RelatedHappenings`
- "What's Happening" section title is hardcoded
- No subcaption field on Happenings
- Exhibition date display inconsistent across surfaces
- Exhibition images cropped to banner format
- Happening page fold animation timing is default

## Delta

### 7.1 — Subcaption field on Happenings
- Add optional `subcaption` text field to `src/collections/Happenings/index.ts`
- Renders between title and artist list
- Supports custom text like "featuring works by..."
- Only renders when populated

### 7.2 — "What's Happening" section title editable + toggleable
- Add to Home global: `whatsHappeningTitle` (text, defaults "What's Happening"), `whatsHappeningEnabled` (checkbox, default true), `whatsHappeningIcon` (checkbox for question mark icon)

### 7.3 — Font size adjustments
- Reduce artist link font size ~25% across: `DirectoryListing`, `CurrentExhibition` artist names, happening detail artist list, `RelatedHappenings`
- Increase "Featured Artist" title font size
- Increase "by appointment" text on Visit page

### 7.4 — Exhibition date display audit
- Verify all surfaces show both start AND end dates
- Key surfaces: `CurrentExhibition`, `FeatureBanner`, `DirectoryListing`, detail page, `RelatedHappenings`

### 7.5 — Exhibition image display — full aspect ratio
- Change cropped banner to show images at full/original aspect ratio on exhibition pages

### 7.6 — Happening page fold timing
- Adjust scroll trigger so fold animation occurs earlier during initial scroll

## Data Model

**Happenings** (`src/collections/Happenings/index.ts`):
- Add: `subcaption` (text, optional)

**Home global** (`src/globals/Home/config.ts`):
- Add: `whatsHappeningTitle` (text, default "What's Happening")
- Add: `whatsHappeningEnabled` (checkbox, default true)
- Add: `whatsHappeningIcon` (checkbox, default true)

## UI Breakdown

Multiple components modified — see individual task descriptions above for specifics.

## Acceptance Criteria

- [ ] Subcaption renders between title and artist list when populated
- [ ] "What's Happening" title is editable in admin
- [ ] "What's Happening" section is toggleable
- [ ] Question mark icon is toggleable
- [ ] Artist link font sizes reduced ~25% on all listed surfaces
- [ ] Featured Artist title font size increased
- [ ] "By appointment" text increased on Visit page
- [ ] All exhibition date surfaces show both start and end dates
- [ ] Exhibition images show full aspect ratio (not cropped)
- [ ] Happening page fold triggers earlier on scroll

## Known Risks

- Font size changes affect multiple components — need consistent sizing across all surfaces
- Date display audit may reveal inconsistencies in date formatting utilities
- Fold timing is subjective — may need client feedback iteration
