# Domain Knowledge: g1882

## Purpose
Gallery 1882 web presence (events, exhibitions, artist management).

## Audience
Non-technical gallery staff.

## Business Context
The site needs to be self-sufficient for staff. Duplicated editing fields and unclear content locations are the current primary blockers.

## Technical Context
Payload CMS 3 (Embedded) with MongoDB and Vercel Blob. Stability of the admin panel is mission-critical given past issues with blank create pages.

## Risks
- Regression of existing business logic (e.g., `isActive` hook)
- Admin UI bloat if not carefully organized
- Sync issues between `preview` and `prod` databases

## Dependencies
- Stable `preview` branch for all changes
- MongoDB write access
- Vercel Blob storage

