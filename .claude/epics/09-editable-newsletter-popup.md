# Epic 9: Editable Newsletter Popup

**Priority**: Medium | **Phase**: 3 — UI refinements

## Intent

Make the newsletter gate modal copy editable from the CMS so the client can customize messaging without code changes.

## Current State

- `src/components/NewsletterGateModal/index.tsx` renders the newsletter popup
- Copy is hardcoded in the component
- Modal controlled by `NEXT_PUBLIC_ENABLE_NEWSLETTER_GATE` env var
- Used as "Coming Soon" lander until launch

## Delta

1. **Add CMS fields** to Home global (new "Newsletter Popup" tab): `popupHeadline`, `popupDescription`, `popupButtonText`, `popupSuccessMessage`
2. **Wire modal** to accept CMS copy as props, passed from homepage server component
3. **Test** with custom copy (clear localStorage to trigger modal)

## Data Model

**Home global** (`src/globals/Home/config.ts`):
- Add tab: "Newsletter Popup"
- `popupHeadline` — text, optional (fallback to current hardcoded value)
- `popupDescription` — textarea, optional
- `popupButtonText` — text, optional
- `popupSuccessMessage` — text, optional

## UI Breakdown

**Modified**: `src/components/NewsletterGateModal/index.tsx`
- Accept CMS copy as props
- Fall back to current hardcoded values when CMS fields are empty

**Modified**: Homepage server component
- Fetch Home global data and pass newsletter fields to modal

## Acceptance Criteria

- [ ] Home global admin shows "Newsletter Popup" tab
- [ ] All four fields editable in admin
- [ ] Modal renders CMS copy when fields are populated
- [ ] Modal falls back to hardcoded defaults when fields are empty
- [ ] Clear localStorage triggers modal with updated copy

## Known Risks

- Modal is a client component — CMS data must be passed as props from server component, not fetched client-side
