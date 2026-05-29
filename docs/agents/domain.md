# Domain Documentation Layout

This project uses a **single-context** layout: one global `CONTEXT.md` and one `docs/adr/` directory at the repo root.

## Structure

```
/
├── CONTEXT.md          # Domain language, key concepts, vocabulary
├── docs/
│   └── adr/            # Architecture Decision Records
│       ├── 001-*.md
│       ├── 002-*.md
│       └── ...
└── ...
```

## How Agent Skills Use These

Skills like `improve-codebase-architecture`, `diagnose`, `tdd`, and others read from these files to:

1. **Learn domain language** — understand Gallery 1882's business concepts (collections, events, exhibitions, etc.)
2. **Respect past decisions** — before suggesting refactors, check ADRs to avoid re-debating settled architecture choices
3. **Maintain consistency** — use terminology from `CONTEXT.md` in code, comments, and PR descriptions

## CONTEXT.md

Start with Gallery 1882's domain context:

- **What is the project?** — A Chesterton, IN art gallery website (already in AGENTS.md; elaborate if needed)
- **Key business concepts** — Collections, exhibitions, events, artists, visitors, admin workflows
- **Technical patterns** — Payload CMS collections, versioning/drafts, revalidation hooks, Vercel Blob storage
- **Data models** — How galleries, exhibitions, artworks relate
- **User roles** — Admin, visitor, curator (if applicable)
- **External systems** — Payload CMS, Vercel, Sentry, Axiom, Resend email

Create `CONTEXT.md` by describing the gallery's domain in your own words. See Matt Pocock's template format for reference.

## docs/adr/

Add Architecture Decision Records as you make significant choices:

- **Naming**: `001-use-payload-cms.md`, `002-vercel-blob-for-images.md`, etc.
- **Format**: Decision, context, consequences, alternatives considered
- **When to add**: After settling a major architectural question (tech choice, data model change, integration pattern)

Example header:

```markdown
# ADR 001: Use Payload CMS as Embedded Headless CMS

**Status**: Accepted  
**Date**: 2025-01-15  
**Context**: Gallery needs admin interface for managing exhibitions, events, artists.  
**Decision**: Adopt Payload CMS embedded (not headless); admin at `/admin`.  
**Consequences**: Next.js + Payload are tightly coupled; easier local dev, but harder to separate later.  
**Alternatives**: Headless Strapi, Contentful, custom API.
```

## Multi-Context (Monorepo)

If this becomes a monorepo later (e.g., separate frontend and CMS packages), create:

```
/
├── CONTEXT-MAP.md      # Index of all contexts
├── frontend/
│   ├── CONTEXT.md
│   └── docs/adr/
├── cms/
│   ├── CONTEXT.md
│   └── docs/adr/
└── ...
```

For now, use single-context.
