# Client Feedback Checklist

## 1. Bulk image upload — images not showing up / disappearing
- [ ] **Confirm: is the client expecting bulk upload?** Payload only supports single-file upload natively — clarify if they need multi-file
- [ ] **Investigate disappearing images** — the Vercel Blob token (`BLOB_READ_WRITE_TOKEN`) falls back to empty string if missing; check it's set in all environments
- [ ] **Check for the `IMG_4556.jpeg` issue** — 1 media doc has no `url` field at all, which would appear "disappeared"
- [ ] **No upload error handling** — Media has no `afterChange` hook or error logging, so failed Blob uploads fail silently
- [ ] **Verify Blob images serve without "un-configured host" errors** (flagged in existing TODO)

## 2. Sharp image optimization — images too big
- [x] **2560px resize cap** is implemented (`beforeChange` hook in Media.ts)
- [x] **WebP variants** now configured for all 7 image sizes (quality 80)
- [x] **Just re-processed all 20 existing images** — all now have WebP variants
- [ ] **Clarify "too big"** — does the client mean file size (now addressed via WebP) or display dimensions? The original is still stored as JPEG; only variants are WebP
- [ ] **Note: originals are destructively resized** — no high-res archival copy is kept. Confirm this is acceptable

## 3. GDPR / accessibility requirements
- [x] **Cookie consent banner** — implemented with accept/decline
- [x] **Privacy policy** at `/privacy` — comprehensive, covers GDPR requirements
- [x] **Cookie policy** at `/cookies` — documents functional cookies only, no tracking
- [x] **No analytics/tracking scripts** — confirmed clean
- [x] **Skip-to-content link** — implemented
- [x] **Form accessibility** — labels, sr-only indicators present
- [ ] **Ask client: any specific GDPR/accessibility concerns?** Current implementation looks solid
- [ ] **Consider: automated accessibility testing** (Lighthouse CI / axe) not yet in pipeline
- [ ] **Video content** — if using Cloudflare Stream, captions/transcripts may be needed

## 4. End date — show time only for events
- [x] **Already implemented** via `dateDisplayMode` on HappeningTypes
- [x] `date-range` → "March 16–June 20" (exhibitions)
- [x] `datetime` → "March 28 from 7–9pm" (events/talks)
- [ ] **Verify with client** this matches their expectation — maybe they want something different?

## 5. Event type — add "Talk" or make editable
- [x] **"Talk" already exists** as a HappeningType (seeded with `datetime` display mode)
- [x] **HappeningTypes is fully admin-editable** — client can add/edit/delete types from `/admin`
- [ ] **Tell the client** they can manage types at Admin → Happening Types — they may not know this exists
