# Epic 2: Happenings Creation Fix

**Priority**: Critical | **Phase**: 1 — Unblock content team
**Blocks**: Event/exhibition management

## Intent

Users get a blank screen when creating new Happenings in the admin panel. The `type` field is a required relationship to the `happening-types` collection. If that collection is empty in the target database, the form can't render a valid selection.

## Current State

- `src/collections/Happenings/index.ts` has a required `type` field — relationship to `happening-types`
- `happening-types` collection stores types like Exhibition, Event, Talk with `dateDisplayMode` settings
- Preview environment uses development MongoDB — types may not be seeded
- A migration script exists: `scripts/migrate-happening-types.mjs`
- The seed endpoint at `src/endpoints/seed/` handles initial data population

## Delta

1. **Verify** `happening-types` has documents in the development MongoDB
2. **Seed types** if missing — run migration script or add to seed endpoint
3. **Add startup safeguard** — Payload `onInit` check or admin dashboard warning when `happening-types` is empty; add type seeding to the existing seed endpoint
4. **Verify** end-to-end Happening creation works

## Data Model

No schema changes. The `happening-types` collection already exists — it just needs to be populated.

## UI Breakdown

No frontend UI changes. Fix is data + admin safeguard.

## Acceptance Criteria

- [ ] `happening-types` collection has Exhibition, Event, and Talk documents
- [ ] Creating a new Happening in admin panel renders correctly (no blank screen)
- [ ] New Happening saves with title, type, and startDate
- [ ] Saved Happening generates slug and appears at `/happenings/[slug]`
- [ ] Revalidation hook fires on save
- [ ] Seed endpoint includes `happening-types` seeding
- [ ] Admin warning or `onInit` check prevents silent failure if types are missing

## Known Risks

- The development database may have other missing seed data beyond `happening-types`
- Migration script may need updates if `happening-types` schema has changed since it was written
