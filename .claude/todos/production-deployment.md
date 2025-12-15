# Production Deployment Checklist

## Session Summary (2025-12-15)
- Fixed homepage unit tests by adding `getCachedGlobal` mock
- Fixed TypeScript type errors with `FormattedHappening` type
- Successfully deployed to preview environment
- Production deployment blocked by uninitialized MongoDB database

## Next Steps

### 1. Initialize Production MongoDB Database
- [ ] Create new MongoDB database for production environment
- [ ] Configure database with same structure as preview
- [ ] Test database connection

### 2. Update Vercel Production Environment Variables
- [ ] Set `DATABASE_URI` to production MongoDB connection string
- [ ] Verify all other production env vars are configured:
  - `PAYLOAD_SECRET`
  - `NEXT_PUBLIC_SERVER_URL`
  - `BLOB_READ_WRITE_TOKEN`
  - `CRON_SECRET`
  - `RESEND_API_KEY` (if using)

### 3. Deploy to Production
- [ ] Run sanity check: `pnpm test:pre-deploy`
- [ ] Build locally: `pnpm build`
- [ ] Deploy to production: `vercel --prod`
- [ ] Monitor deployment logs for any errors

### 4. Post-Deployment Setup
- [ ] Access `/admin` on production site
- [ ] Create first admin user
- [ ] Optionally seed initial content or migrate from preview
- [ ] Verify all pages load correctly
- [ ] Test newsletter gate functionality
- [ ] Check that all environment-specific features work

## Notes
- Preview deployment working at: https://gallery1882-n7oh8xwhc-gallery-1882.vercel.app
- Latest commit: 9993f3a - "Refactor homepage with client components and improve newsletter gate"
