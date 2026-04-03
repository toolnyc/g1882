# Epic 10: Search & Directory Toggles

**Priority**: Low | **Phase**: 4 — Polish & extras

## Intent

Give the client control over search bar visibility and clean up the artist roster page by removing descriptive text below names.

## Current State

- Artists page has a search bar (always visible)
- Happenings page has a search bar (always visible)
- Artist roster page shows bio excerpts below names
- No SiteSettings global or per-page toggle mechanism

## Delta

1. **Make search bar optional** on Artists page — add `showSearchBar` checkbox
2. **Make search bar optional** on Happenings page — same pattern
3. **Remove descriptive text** below artist names on roster page

## Data Model

Options:
- Add toggles to a new SiteSettings global
- Add toggles to existing page-level globals or directly to the component config

**Recommended**: Add to existing globals or create lightweight SiteSettings global with:
- `artistsShowSearch` (checkbox, default true)
- `happeningsShowSearch` (checkbox, default true)

## UI Breakdown

**Modified**: Artists listing page — conditionally render search bar
**Modified**: Happenings listing page — conditionally render search bar
**Modified**: Artists roster — remove bio excerpts below names

## Acceptance Criteria

- [ ] Search bar on Artists page can be hidden via admin toggle
- [ ] Search bar on Happenings page can be hidden via admin toggle
- [ ] Artist roster page shows names only (no bio excerpts)
- [ ] Toggles default to showing search bars

## Known Risks

- Removing bio excerpts may affect SEO or page layout spacing
- Need to decide where toggle fields live (new global vs. existing)
