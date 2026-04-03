# Epic 13: Backlog & Cleanup

**Priority**: Low | **Phase**: 4 — Polish & extras (opportunistic)

## Intent

Collected small fixes and improvements that can be addressed opportunistically alongside other work.

## Current State

- Artists collection autosave interval at 100ms (`src/collections/Artists/index.ts:30`)
- WebP compression quality at 80 in `src/collections/Media.ts`
- Cookie banner z-index 9999 vs newsletter modal z-index 9998
- Various sections not yet toggleable in admin

## Delta

### 13.1 — Fix Artists autosave interval
- Change 100ms → 800ms in `src/collections/Artists/index.ts`
- 100ms causes excessive saves and potential performance issues

### 13.2 — Evaluate image compression quality
- Consider bumping WebP quality from 80 → 90 in `src/collections/Media.ts`
- Art gallery context demands higher fidelity than typical web usage
- Evaluate file size tradeoff

### 13.3 — Fix cookie/modal z-index conflict
- Cookie banner (z-9999) should be below newsletter modal (z-9998)
- Ensure modal is always on top when both are visible

### 13.4 — Admin toggleability pass
- Review all sections site-wide
- Ensure more fields are editable/toggleable per client request
- This is an ongoing concern addressed across multiple epics

## Data Model

- 13.1: Config change only (autosave interval)
- 13.2: Config change only (compression quality)
- 13.3: CSS change only
- 13.4: Various field additions across globals/collections

## UI Breakdown

Minimal — mostly config and CSS fixes.

## Acceptance Criteria

- [ ] Artists autosave interval is 800ms
- [ ] WebP quality evaluated (decision documented even if kept at 80)
- [ ] Newsletter modal renders above cookie banner when both visible
- [ ] Admin toggleability improvements identified and implemented

## Known Risks

- Bumping WebP quality increases storage costs and bandwidth — needs size comparison
- Autosave interval change may affect admin UX if too slow
- z-index fixes can cascade — verify no other overlapping elements are affected
