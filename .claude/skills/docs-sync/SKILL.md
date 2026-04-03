---
name: docs-sync
description: Update ARCHITECTURE.md, CLAUDE.md, and ADMIN-GUIDE.md to match current code.
---

# /docs-sync

Synchronize documentation with the current state of the codebase.

## Procedure

1. Read `ARCHITECTURE.md`, `CLAUDE.md`, and `ADMIN-GUIDE.md`
2. Scan the codebase for:
   - New files/directories not documented
   - Changed patterns or conventions
   - New environment variables
   - New dependencies
   - Changed CLI commands
3. Update each document to reflect current reality
4. Do NOT add speculative documentation — only document what exists

## Rules

- Keep the same document structure and style
- Only update sections that are actually stale
- If nothing changed, say so and exit
