# Epic 8: Footer & Policy Pages

**Priority**: Medium | **Phase**: 3 — UI refinements

## Intent

Footer needs rich text address formatting and policy page links. All policy pages need to be CMS-editable for legal compliance.

## Current State

- Footer defined in `src/Footer/config.ts` (global)
- Footer pulls address from Space global
- Footer has "Our Hours" column pulling from Visit global `regularHours`
- No subfooter links section
- Privacy page may exist at `/privacy`; cookies page may exist
- No `/terms` or `/land-acknowledgement` pages

## Delta

### 8.1 — Footer address as rich text
- Convert footer address display to render from rich text (or structured address with line breaks)
- Currently pulls from Space global — may need field change there

### 8.2 — Add policy page links to subfooter
- Privacy Policy, Cookie Policy, Terms & Conditions, Land Acknowledgement
- Each links to its own page

### 8.3 — Make policy pages CMS-editable
- Ensure `/privacy`, `/cookies`, `/terms`, `/land-acknowledgement` pull from CMS
- Use Pages collection or dedicated globals

### 8.4 — Footer verification
- Confirm "Gallery Space" links to `/space`
- Confirm "Our Hours" column pulls from Visit global `regularHours`

## Data Model

Depends on implementation approach:
- Option A: Use existing Pages collection for policy pages (create page documents)
- Option B: Create a Policies global with fields for each policy page

**Space global** or **Footer global**: May need rich text address field.

## UI Breakdown

**Modified**: Footer component
- Add rich text address rendering
- Add subfooter links row

**New routes** (if not using Pages collection catch-all):
- `/terms`
- `/land-acknowledgement`

## Acceptance Criteria

- [ ] Footer address renders with proper line breaks
- [ ] Subfooter shows links: Privacy, Cookies, Terms, Land Acknowledgement
- [ ] All policy pages are CMS-editable
- [ ] Policy pages render content from CMS
- [ ] "Gallery Space" link goes to `/space`
- [ ] "Our Hours" column displays correct hours from Visit global

## Known Risks

- Address formatting may differ between Space global and Footer display
- Policy page content needs legal review before launch (not a dev concern, but scaffolding must be ready)
