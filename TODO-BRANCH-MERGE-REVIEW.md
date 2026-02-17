# Branch Merge Review & Testing Checklist

> Merged 2026-02-17: `feature/event-types`, `feature/media-improvements`, `feature/gdpr-accessibility` into `main`

---

## 1. Event/Happening Types System

Replaced the hardcoded `type: 'exhibition' | 'event'` select with a `HappeningTypes` relationship collection. Added `dateDisplayMode` (`date-range` vs `datetime`) to control frontend date rendering. All pages migrated from `h.type === 'exhibition'` to `isDateRangeType(h.type)`.

### Known Issues (Fix Before Deploy)

- [x] ~~**No data migration for existing Happening `type` values**~~ — Fixed: `scripts/migrate-happening-types.mjs` upserts Exhibition/Event type docs and converts string values to ObjectId references in both `happenings` and `_happenings_v`.
- [x] ~~**Exhibitions page shows ALL happenings**~~ — Removed (orphaned `/exhibitions` page already deleted).
- [x] ~~**`generateMetadata` uses `JSON.stringify` for description**~~ — Fixed: uses `extractPlainText()` now.
- [x] ~~**Artist bio schema mismatch**~~ — Fixed: collection config changed to `type: 'richText'`, all rendering uses `<RichText>` component, metadata uses `extractPlainText()`.
- [x] ~~**Migration script has brittle MongoDB driver path**~~ — Fixed: both scripts use `createRequire(import.meta.url)`.
- [x] ~~**`richTextHelpers.ts` is unused**~~ — Fixed: now imported in 4 files.
- [x] ~~**Duplicated `resolveType()` in UpcomingHappenings**~~ — Fixed: uses imported `resolveHappeningType` from `happeningTypeHelpers`.
- [x] ~~**HappeningTypes has no seed data**~~ — Fixed: migration script upserts Exhibition and Event type docs.

### Manual Testing

- [ ] Run `node scripts/migrate-happening-types.mjs` against dev DB — verify dry-run output, confirm, check results
- [ ] Run `node scripts/migrate-artist-bio.mjs` against dev DB (if not already run) — verify bio conversion
- [ ] Admin panel: Create/edit HappeningTypes, assign to happenings
- [ ] Admin panel: Edit artist bio in richText editor — verify it saves and renders correctly
- [ ] Homepage "On Now" section shows active date-range type happenings
- [ ] Homepage "Up Next" fallback when nothing is active
- [ ] Happenings list: date formatting for both date-range and datetime types
- [ ] Happening detail page: date display correct for both modes
- [ ] Happening detail page: meta description is plain text (not JSON)
- [ ] Artist detail page: bio renders as rich text (not `[object Object]`)
- [ ] Artist detail page: meta description is plain text extracted from bio
- [ ] Artists listing page: "Currently Showing" banner has plain text bio
- [ ] Artists listing page: directory subtitles show plain text bio excerpts
- [ ] UpcomingHappenings: type labels and "View [Type]" button text
- [ ] Test with a happening whose `type` is an unpopulated string ID — should gracefully fall back
- [ ] Verify existing happenings render correctly after migration

---

## 2. Media Improvements

WebP conversion at upload, `withoutEnlargement` resize option, Vercel Blob hostname allowlisted, Next.js Image quality reduced from 90 to 85.

### Known Issues

- [ ] **Double compression** — Images are now WebP quality 80 at upload (Sharp) then quality 85 at delivery (Next.js). Test for cumulative quality degradation on photographs with fine texture.
- [ ] **GIF handling** — Animated GIFs will be converted to WebP size variants, which may not preserve animation. Verify animated GIF behavior.
- [ ] **OG image `crop` to `position` fix** — The `og` image size changed from `crop: 'center'` (silently ignored in Payload 3) to `position: 'center'`. Verify OG images are now properly centered.
- [ ] **Existing media unaffected** — Only newly uploaded images get WebP. Old images stay in original format. Verify frontend handles a mix of old/new formats.

### Manual Testing

- [ ] Upload images in each format (JPEG, PNG, WebP, GIF) — verify all size variants are WebP
- [ ] Upload a small image (<500px wide) — verify `large`/`xlarge`/`og` variants are not upscaled
- [ ] Verify Vercel Blob images display without "un-configured host" errors
- [ ] Visual quality check on image-heavy pages (artist pages, exhibitions)
- [ ] Test OG image with social media debuggers (Twitter Card Validator, Facebook Sharing Debugger)
- [ ] Verify video uploads (mp4/webm) are unaffected by image optimization settings
- [ ] Confirm blur placeholder transitions still work

---

## 3. GDPR Cookie Consent & Accessibility

Cookie consent banner, privacy/cookies policy pages, focus traps, form field a11y, skip-to-content link, ESLint jsx-a11y plugin.

### Known Issues

- [ ] **Cookie `Secure` flag on localhost** — Cookie is set with `Secure`, which browsers reject over HTTP. Cookie banner may reappear on every local page load during dev.
- [ ] **Skip-to-content target includes the header** — `id="main-content"` wraps `<Header>` + `{children}` + `<Footer>`. Skip link doesn't actually skip the nav. Consider moving the ID below the header or adding `tabindex="-1"`.
- [ ] **`hasCookieConsent()` uses string `includes()`** — Could match substrings of other cookie names. The CookieConsent component uses regex. Should be consistent.
- [ ] **Cookie banner z-index vs newsletter modal** — Banner is `z-[9999]`, modal backdrop is `z-[9998]`. Both visible on first visit. Verify both are usable simultaneously.
- [ ] **`role="alert"` + `aria-live="assertive"` on form errors** — Redundant (role implies aria-live). May cause double-announce on some screen readers.
- [ ] **Aktiv Grotesk font loading** — Font referenced in CSS but no `@font-face` or import visible. Verify it's loaded in production, not just locally.
- [x] ~~**New ESLint rules may flag existing code**~~ — Fixed: GalleryNav a11y lint error resolved (added keyboard handler + role).

### Manual Testing

- [ ] **First-visit flow**: Cookie banner + newsletter modal both visible — test z-index stacking and interactability
- [ ] Cookie consent: Accept/Decline persists across page loads
- [ ] Newsletter signup without accepting cookies first — then clear localStorage and reload (does gate reappear?)
- [ ] Privacy page (`/privacy`) and Cookies page (`/cookies`) render correctly, links work
- [ ] Footer: Legal nav links (Privacy Policy, Cookie Policy) navigate correctly
- [ ] Footer newsletter form: consent checkbox required before submit, privacy link works without toggling checkbox
- [ ] Newsletter modal: focus trap (Tab cycles inside modal only), Escape dismisses, focus restores
- [ ] Mobile nav: focus trap (Tab cycles through nav items), Escape closes, focus restores to hamburger
- [ ] Skip-to-content link: Tab to it, activate, verify keyboard focus lands past the nav
- [ ] Form fields: trigger validation errors, verify screen reader announces errors
- [ ] Cookies page table: horizontal scroll on narrow viewports
- [ ] Verify no undisclosed third-party cookies (Vercel, Cloudflare Stream, etc.)
- [ ] Test with VoiceOver: cookie banner discoverability, form error announcements, modal dialog behavior
- [ ] CardTitle fix: verify cards with titles render children correctly (was previously broken)

---

## Pre-Deploy Gate

- [x] `pnpm build` succeeds
- [x] `pnpm test:pre-deploy` passes (lint + unit + integration)
- [x] `pnpm generate:types` — bio field generates as richText
- [ ] Run migration scripts against target environment before deploying
- [ ] Push to `preview` branch first, validate, then merge to `prod`
