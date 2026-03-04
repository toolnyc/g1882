# Manual Verification Checklist

## Image resize cap
- [ ] Upload a large image (5000px+) in admin — confirm it saves successfully without timing out
- [ ] Check the uploaded media dimensions are capped at 2560px max
- [ ] Verify all 7 image variants (thumbnail through og) generated correctly
- [ ] Upload a small image (<2560px) — confirm it's unchanged

## Talk happening type
- [ ] Run the migration script (`node scripts/migrate-happening-types.mjs`) against your dev database — confirm Talk appears alongside Exhibition and Event
- [ ] In admin, create a new Happening — confirm "Talk" is available in the type dropdown
- [ ] Verify Talk happenings display with datetime format (not date-range)

## Seed pipeline
- [ ] Run the seed from admin (or however you trigger it) — confirm no errors
- [ ] Verify seeded happenings have proper type relationships (not raw strings) in the admin panel
- [ ] Check that Exhibition, Event, and Talk all exist in the Happening Types collection after seeding
