# Epic 12: Accessibility

**Priority**: Medium | **Phase**: 4 — Polish & extras
**Launch gate**: Accessibility audit must pass before launch

## Intent

Integrate a third-party accessibility widget and run a WCAG AA audit before launch. Client specifically requested a third-party widget rather than custom-built accessibility features.

## Current State

- No accessibility widget installed
- No formal WCAG audit has been run
- Site uses semantic HTML in most places
- Image alt text supported via Media collection
- Focus ring styles use `ring-lake` or `ring-navy` (Gallery 1882 design tokens)

## Delta

### 12.1 — Third-party accessibility widget
- Evaluate: accessiBe, UserWay, or similar
- Install as script tag or lightweight component
- Renders as floating button in bottom-right corner

### 12.2 — WCAG AA audit
- Run Lighthouse and axe-core against all public pages
- Fix critical and serious violations
- Document remaining issues for future work

## Data Model

No schema changes.

## UI Breakdown

**New**: Accessibility widget component (thin wrapper around third-party script)
- Floating button, bottom-right corner
- Loads asynchronously to avoid performance impact

## Acceptance Criteria

- [ ] Accessibility widget loads on all public pages
- [ ] Widget button is visible and functional
- [ ] Widget does not affect page load performance significantly
- [ ] Lighthouse accessibility score 90+ on all public pages
- [ ] No critical or serious axe-core violations
- [ ] Audit results documented

## Known Risks

- Third-party accessibility overlays are controversial in the a11y community — some cause more problems than they solve
- Widget script may affect page performance or conflict with existing styles
- WCAG AA compliance may require fixes beyond what a widget provides
