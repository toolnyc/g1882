# Image Display Diagnosis — Session 2

## Starting Point

Picked up from `.agents/docs/image-upload-session-review.md` which documented three outstanding issues:
1. Our Story images never display
2. Happenings images require refresh to show
3. Spaces in filenames still fail

## Root Cause Found

**All three image display issues share one root cause: `getMediaUrl` absolutizes relative URLs on the client, and the resulting absolute URL is rejected by Next.js Image optimization.**

### The Mechanism

`src/utilities/getMediaUrl.ts` behaves differently on server vs client:

- **Server** (`canUseDOM` false): returns relative URL as-is, e.g., `/api/media/file/image.jpg`
- **Client** (`canUseDOM` true): prepends `window.location.origin`, e.g., `https://preview.gallery1882.com/api/media/file/image.jpg`

`next.config.js` `remotePatterns` only allows:
1. The production hostname (from `VERCEL_PROJECT_PRODUCTION_URL`)
2. `*.blob.vercel-storage.com`

The preview hostname (`preview.gallery1882.com`) is NOT in `remotePatterns`. When the absolute URL hits Next.js Image optimization at `/_next/image?url=https://preview.gallery1882.com/...`, the server returns **400 `INVALID_IMAGE_OPTIMIZE_REQUEST`**.

### Verified with curl

```
# Relative URL through Next.js Image → 200 (works)
/_next/image?url=%2Fapi%2Fmedia%2Ffile%2Fwe3-...png&w=1920&q=85 → HTTP 200

# Absolute URL through Next.js Image → 400 (blocked)
/_next/image?url=https%3A%2F%2Fpreview.gallery1882.com%2Fapi%2Fmedia%2Ffile%2Fwe3-...png&w=1920&q=85 → HTTP 400 INVALID_IMAGE_OPTIMIZE_REQUEST
```

### How It Manifests Per Page

| Page | Component | URL source | Behavior |
|------|-----------|------------|----------|
| **Our Story** | `PhotoCarousel` via `dynamic()` (client-only) | Relative API path | **Always broken** — never server-rendered, always absolutized |
| **Homepage happening hero** | `CurrentExhibition` (`'use client'`) | Relative API path | **SSR works, hydration breaks it** — server renders correct relative URL, client hydration re-runs `resolveOptimizedUrl` producing absolute URL |
| **Homepage happening hero** | `CurrentExhibition` (`'use client'`) | Absolute Blob URL from DB | **Works** — Blob domain is in `remotePatterns` |
| **Happenings detail page** | Server component | Either | **Always works** — `getMediaUrl` runs on server, stays relative |

The "refresh fixes it" behavior on Happenings is the SSR/hydration cycle: server render produces correct HTML, then client hydration replaces it with the broken absolute URL. The brief working state is the server-rendered HTML before React hydrates.

## What We Investigated

### MongoDB Data Audit

Queried the `media` collection directly. 48 documents total:

- **40 with URL**: 19 have relative URLs (`/api/media/file/...`), 21 have absolute Blob URLs
- **8 without URL**: all client uploads (files uploaded directly to Blob from browser). These have `url: undefined` in MongoDB but Payload computes a URL at read time.

The 8 missing-URL documents:
- 6 from 2026-05-21 (today's test uploads)
- 1 from 2026-04-04 (the homepage hero video `to-process-compressed-crf23.mp4`)
- 1 from 2026-02-03 (`IMG_4556.jpeg`)

### Payload Computes URLs at Read Time

Despite `url: undefined` in MongoDB, the Payload REST API returns computed URLs:

```
GET /api/media/69d183715672667b563a44a2
→ url: "/api/media/file/to-process-compressed-crf23.mp4"  (computed from filename)

GET /api/globals/our-story?depth=1
→ photos[0].image.url: "/api/media/file/we3-...png"  (computed from filename)
```

The `url` field is virtual/computed by Payload's core upload handling, not stored in MongoDB.

### File Handler Works (GET, not HEAD)

The `blobFetchRetryPlugin` static handler at `/api/media/file/{filename}` works correctly for GET requests:

```
GET /api/media/file/to-process-compressed-crf23.mp4 → 200 (serves 18.4MB video from Blob)
GET /api/media/file/we3-...png → 200 (serves 1MB image from Blob)
HEAD /api/media/file/* → 404 (HEAD requests not properly handled, but irrelevant)
```

Files are resolved from Blob by filename. The handler is functional.

### Blob Storage Verification

Checked which files exist in Vercel Blob (`gallery1882-dev-blob`):

```
Client uploads (no URL in DB): all exist in Blob (200)
Old server uploads: mixed — some exist, some 404 (IMG_4836.jpeg, IMG_4543.jpeg)
Blob uploads with URLs: all exist (200)
```

The Blob store hostname is `80m7kpvsp5xv42jx.public.blob.vercel-storage.com`.

### Homepage Hero Video

The video `to-process-compressed-crf23.mp4` has `url: undefined` in MongoDB but plays on the homepage because:
1. It's rendered in a `<video><source>` tag (plain HTML, not Next.js Image)
2. `remotePatterns` doesn't apply to `<video>` elements
3. The relative URL `/api/media/file/to-process-compressed-crf23.mp4` resolves correctly in the browser
4. The `blobFetchRetryPlugin` serves it from Blob

## Thumbnail / Background Processing Issues

### Synchronous Thumbnail Generation Is Broken for Client Uploads

The Media collection config defines one synchronous `imageSizes`:
```js
imageSizes: [{ name: 'thumbnail', width: 300, formatOptions: { format: 'webp', options: { quality: 90 } } }]
```

Payload generates this during upload. For client uploads, the thumbnail metadata IS stored in the DB:
```json
"sizes": { "thumbnail": { "width": 300, "height": 441, "mimeType": "image/webp", "filesize": 31690, "filename": "we3-...-300x441.webp" } }
```

But the thumbnail file is **lost in Blob** because:
1. Cloud-storage plugin's `handleUpload` uploads it with `addRandomSuffix: true`
2. Blob stores it under a different name (with random suffix)
3. `handleUpload` updates `data.filename` (main doc's filename), NOT `data.sizes.thumbnail.filename`
4. Since both main file and thumbnail upload run via `Promise.all`, there's a race on `data.filename`
5. The main file wins the race, so `data.filename` is correct, but the thumbnail's actual Blob filename is lost

Verified: `HEAD https://...blob.../we3-...-300x441.webp` → 404 (file doesn't exist under that name)

### Background Job Never Runs on Preview

The `generateImageSizes` job is triggered by `afterChange` and processed by Vercel cron (`vercel.json`: `*/1 * * * *` on `/api/payload-jobs/run`). **Vercel cron only runs on the production deployment**, so on preview, jobs queue but never execute. All 8 client uploads have `processingStatus: 'pending'`.

### Synchronous Thumbnail Is Redundant

The background job generates 7 sizes including its own `thumbnail` (300x300 cover crop) which overwrites the synchronous one. The synchronous `imageSizes` config is both broken (for client uploads) and redundant (overwritten by cron job). Could be removed.

## Changes Made (Local Only, Not Deployed)

### `disablePayloadAccessControl: true`

Changed `src/payload.config.ts`:

```js
// Before:
vercelBlobStorage({
  collections: { media: true },
  ...
})

// After:
vercelBlobStorage({
  collections: { media: { disablePayloadAccessControl: true } },
  ...
})
```

This activates the cloud-storage plugin's `afterRead` hook on the `url` field, which dynamically generates absolute Blob URLs (`https://...blob.vercel-storage.com/filename`) from the stored filename. This means:

- Payload API returns absolute Blob URLs instead of relative `/api/media/file/` paths
- `getMediaUrl` passes absolute URLs through unchanged (no absolutization issue)
- Blob domain IS in `remotePatterns`, so Next.js Image allows it
- Bypasses the broken file handler for images entirely

**Status**: Lint passes, 157 unit tests pass, build succeeds. NOT comitted or deployed to preview yet.

### What This Fix Does NOT Address

1. **The `getMediaUrl` absolutization bug** — the underlying issue where `getMediaUrl` converts relative URLs to absolute same-origin URLs on the client. This affects any client component using `getMediaUrl` or `resolveOptimizedUrl` with relative URLs. The `disablePayloadAccessControl` fix sidesteps it by making URLs absolute Blob URLs from the start, but the bug in `getMediaUrl` remains.

2. **Filename space sanitization** — `sanitizeUploadFilename` in `beforeValidate` runs after client uploads are already in Blob. With absolute Blob URLs, spaces get `%20`-encoded which works, but filenames in the DB may not match Blob keys exactly.

3. **Old media with relative URLs** — 19 documents have relative URLs like `/api/media/file/IMG_4836.jpeg`. With `disablePayloadAccessControl: true`, the `afterRead` hook generates Blob URLs from the filename. Some of these files exist in Blob (work), some don't (404). The ones that 404 were already broken on Vercel serverless anyway.

4. **The `/api/media/file/` handler** — still works for GET requests but HEAD returns 404. This is a minor issue since browsers use GET, but could affect monitoring/health checks.

## Recommended Fix Strategy

### Fix 1: `getMediaUrl` — Stop absolutizing on the client

The core bug. In `src/utilities/getMediaUrl.ts`, relative URLs should stay relative on the client when they'll be used with Next.js Image. Relative URLs work correctly in `<Image src="/api/media/file/...">` because Next.js treats them as same-origin.

### Fix 2: `disablePayloadAccessControl: true` (already applied locally)

Makes Payload return absolute Blob CDN URLs. This is the correct architectural choice regardless — images should be served directly from Blob CDN, not routed through a serverless function. It also fixes the 8 client-upload documents that have no stored URL.

### Fix 3 (optional): Remove synchronous `imageSizes`

The `imageSizes: [{ name: 'thumbnail', ... }]` in Media upload config is both broken (lost in Blob for client uploads) and redundant (background job regenerates it). Removing it eliminates orphaned Blob files and wasted processing.

## Key Code Paths

| File | Role |
|------|------|
| `src/utilities/getMediaUrl.ts` | **The bug** — absolutizes relative URLs on client |
| `src/utilities/resolveOptimizedUrl.ts` | Picks best size, falls back to `getMediaUrl(media.url)` |
| `src/utilities/mediaHelpers.ts` | `resolveMediaUrl` — used by homepage for video/images |
| `src/components/PhotoCarousel/index.tsx` | Our Story carousel (client-only via `dynamic()`) |
| `src/components/CurrentExhibition/index.tsx` | Homepage happening hero (`'use client'`) |
| `src/collections/Media.ts` | Upload config, hooks, synchronous thumbnail |
| `src/payload.config.ts` | Vercel Blob plugin config (changed locally) |
| `src/plugins/blobFetchRetry.ts` | Static file handler (serves from Blob) |
| `src/jobs/generateImageSizes.ts` | Background job for deferred sizes |
| `next.config.js` | `remotePatterns` — production hostname + Blob only |

## Database Quick Reference

```
Total media: 48
With absolute Blob URL: 21 (work everywhere)
With relative URL: 19 (work in server components only)
Without URL: 8 (Payload computes relative URL at read time, same as above)
Processing pending: most client uploads + some older ones
Processing failed: several April 6 WOBS images
Processing complete: none visible in current data
```

Blob store: `gallery1882-dev-blob`, region GLE, created 12/12/25, 111MB storage.
