# Production Data Promotion Checklist

Goal: promote the current preview MongoDB database and Vercel Blob store to production, then rebuild preview as a clean sandbox.

## 1. Decide Deployment Target

- Confirm the Vercel Production Branch.
- If production should deploy from `preview`, update the Vercel Production Branch to `preview`.
- Otherwise merge/push the final launch code to the current Production Branch.
- Confirm the commit being deployed includes the latest upload, Blob, and cron fixes.

## 2. Freeze Content

- Tell client/users to pause admin edits and uploads.
- Record the current preview URL, production URL, and latest successful deployment IDs.
- Avoid deleting media during the promotion window.

## 3. Back Up Current Data

- Back up/export the current preview MongoDB database.
- Save the current preview `DATABASE_URI` in a secure location.
- Save the current preview `BLOB_READ_WRITE_TOKEN` in a secure location.
- Save the current production `DATABASE_URI` and `BLOB_READ_WRITE_TOKEN` for rollback.

## 4. Audit Preview Before Promotion

- Review published homepage/global settings.
- Review published artists, happenings, posts, categories, and happening types.
- Remove or unpublish test content that should not go live.
- Confirm admin users are correct.
- Review media library for obvious junk or broken uploads.
- Confirm contact info, hours, rental/contact forms, social links, SEO defaults, and site settings.
- Check for drafts and decide whether they are acceptable to leave as drafts.

## 5. Validate Preview Media Health

- Run the media audit endpoint or dry-run script if available.
- Confirm media documents point to the current preview Blob store hostname.
- Confirm key frontend pages render images.
- Confirm admin thumbnails render for representative images.
- Do not copy Blob files to a new store unless also running a Mongo URL rewrite migration.

## 6. Promote Preview Stores to Production

In Vercel Production environment variables, set:

```txt
DATABASE_URI=<current preview MongoDB URI>
BLOB_READ_WRITE_TOKEN=<current preview Blob token>
CRON_SECRET=<production cron secret>
NEXT_PUBLIC_SERVER_URL=https://<production-domain>
```

Also verify production values for:

```txt
PAYLOAD_SECRET
PREVIEW_SECRET
SENTRY_DSN
NEXT_PUBLIC_SENTRY_DSN
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
RESEND_API_KEY
RESEND_AUDIENCE_ID
RESEND_FROM_EMAIL
```

## 7. Redeploy Production

- Trigger a fresh production redeploy after env var changes.
- Confirm Vercel deployed the intended branch and commit.
- Confirm runtime logs show the expected deployment/environment.

## 8. Production Smoke Test

- Load homepage.
- Load artists index and representative artist detail pages.
- Load happenings index and representative happening detail pages.
- Load news/posts if used.
- Confirm images render from the promoted Blob store.
- Log into `/admin`.
- Upload a small test image with a simple filename.
- Upload a test image with spaces in the filename after the filename-safety fix is deployed.
- Delete and reupload an image with the same filename.
- Confirm `/api/payload-jobs/run` no longer returns `401`.
- Confirm uploaded image `processingStatus` reaches `complete`.
- Confirm Sentry has no new upload/job exceptions.

## 9. Rebuild Preview as a Sandbox

- Create a new preview MongoDB database.
- Create a new preview Vercel Blob store.
- Update Vercel Preview env vars:

```txt
DATABASE_URI=<new preview MongoDB URI>
BLOB_READ_WRITE_TOKEN=<new preview Blob token>
CRON_SECRET=<optional preview secret>
NEXT_PUBLIC_SERVER_URL=<preview URL if needed>
```

- Redeploy preview.
- Confirm preview admin is isolated from production data.
- Confirm production no longer shares its data stores with preview.

## 10. Rollback Plan

- If production breaks, restore the old production `DATABASE_URI` and `BLOB_READ_WRITE_TOKEN`.
- Redeploy production.
- Do not delete, rotate, or overwrite the promoted preview stores until production has been verified.

## 11. Post-Launch Cleanup

- Keep the promoted production MongoDB and Blob store credentials in the production environment only.
- Remove any temporary test uploads created during smoke testing.
- Verify scheduled jobs for image processing are healthy.
- Document the final production and preview data-store mapping in the private project notes.
