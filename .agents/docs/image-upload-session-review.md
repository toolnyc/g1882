# Image Upload Session Review

## Changes Attempted

- Investigated persistent upload/delete/reupload failures, background image processing, and `/api/payload-jobs/run` `401`s.
- Attempted fixes around:
  - Vercel Blob filename collision avoidance via `addRandomSuffix: true`.
  - Background job queue gating so image processing jobs are not repeatedly queued during status updates.
  - Cron auth extraction/hardening via `src/jobs/access.ts`.
  - Blob stale-CDN retry/download fallback logic.
  - Filename whitespace normalization in `Media.beforeValidate`.
- Added or attempted regression tests for:
  - media processing queue behavior
  - cron auth
  - Blob retry behavior
  - filename whitespace normalization
- Created a production data promotion checklist:
  - `.agents/docs/production-data-promotion-checklist.md`

## Scope Correction

Some cron/blob retry work was later identified as premature because Vercel cron will not run on preview deployments and the immediate goal became enabling safe client uploads before promoting preview data/storage to production.

Tracked cron/blob edits were reverted for:

- `src/jobs/access.ts`
- `src/plugins/blobFetchRetry.ts`
- `tests/unit/jobsAccess.unit.spec.tsx`

Remaining intended work was supposed to be limited to:

- the production promotion checklist
- filename-space upload handling

There may still be an untracked Blob retry test file from the over-scoped work:

- `tests/unit/blobFetchRetryPlugin.unit.spec.tsx`

## Validation Run

At different points, these passed locally:

```bash
pnpm test:pre-deploy
pnpm build
```

Known warnings were existing Next `<img>` lint warnings.

## Current Outstanding Behavior

### 1. Happenings Images Require Refresh

On first visit to Happenings, images may not appear until refreshing. Image delivery is also slow.

This suggests a client/render/cache mismatch rather than a pure upload failure, because the same images can eventually display after refresh.

Likely areas to inspect:

- image URL resolution in `resolveOptimizedUrl`
- fallback from optimized sizes to original Blob URL
- Next/Image caching behavior
- frontend cache/revalidation for Happenings
- whether initial render gets stale media relationship data without `sizes` or `url`

### 2. Our Story Images Never Display

Our Story page images show only alt text, for both old and new uploads.

This could be a lead.

### 3. Spaces in Filenames Still Fail

Uploads with spaces in filenames still error. Uploads without spaces work and can be used across the site.

This means the attempted server-side filename normalization is likely too late for client uploads. Payload/Vercel Blob client upload appears to upload/reconstruct using the original filename before `Media.beforeValidate` can safely normalize it.

Likely fix direction:

- normalize filename before or directly during the client upload handler
- add a custom admin/client upload component or handler that sanitizes `file.name`
- configure Payload upload parser/options if supported
- do not rely on server-side `beforeValidate` alone for client upload filenames with spaces

## Helpful Root-Bug Hypothesis

There may be two overlapping issues:

1. **Filename/Blob key issue**: client uploads with spaces or repeated filenames hit Vercel Blob/Payload reconstruction problems before collection hooks can normalize.
2. **Frontend media resolution issue**: some frontend routes/components are receiving media data that is stale, insufficiently populated, or not compatible with the current URL resolver, causing first-load image misses and Story image failures.

Next agent should start with focused repros for:

- upload `file with space.jpg`
- Our Story page image render path/data shape
- first-load Happenings media payload vs post-refresh payload
