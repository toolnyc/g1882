# Epic 11: Visit Page Enhancements

**Priority**: Medium | **Phase**: 4 — Polish & extras

## Intent

Add Google Maps integration to the Visit page. The "Explore the Duneland Community" section is deferred until content is defined.

## Current State

- Visit page at `src/app/(frontend)/visit/page.tsx`
- Visit global has address data, hours, admission info
- No maps integration
- "About Chesterton" section exists but is toggled off
- All Visit page sections are conditional on configured data

## Delta

### 11.1 — Google Maps integration
- Add embedded Google Map or "Get Directions" CTA linking to Google Maps
- Single CTA approach preferred per client meeting
- Use gallery address from Space or Visit global

### 11.2 — "Explore the Duneland Community" section (deferred)
- Scaffold the section toggle only
- Client needs to define content and structure first
- Ready for content when client provides it

## Data Model

**Visit global** (or Space global):
- Add: `googleMapsUrl` (text, optional) — for "Get Directions" link
- Or: `googleMapsEmbedUrl` (text, optional) — for embedded map iframe

## UI Breakdown

**Modified**: Visit page
- Add "Get Directions" CTA button or embedded map section
- Add toggleable placeholder section for Duneland Community content

## Acceptance Criteria

- [ ] Visit page has Google Maps link or embedded map
- [ ] Maps link/embed uses correct gallery address
- [ ] Duneland Community section toggle exists in admin (off by default)
- [ ] Maps CTA is styled consistently with Gallery 1882 design system

## Known Risks

- Google Maps embed requires API key for advanced features (simple embed may suffice)
- "Get Directions" CTA is simpler and avoids API key dependency
- Duneland content scope is undefined — scaffold must be flexible
