# CLAUDE.md

## Primary instruction source: [AGENTS.md](./AGENTS.md)

Read and follow all instructions in AGENTS.md. It is the single source of truth for project context, conventions, observability patterns, and deployment workflow shared across all AI coding tools.

## Quick Reference

| Resource | Location |
|----------|----------|
| Full instructions | [AGENTS.md](./AGENTS.md) |
| Architecture docs | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Skills | `.claude/skills/` |
| Hooks | `.claude/hooks/` |
| Sentinels | `.claude/state/` |
| Knowledge base | `/Users/pete/Dropbox/Notes/Obsidian/Clients/Gallery 1882/` |

## Build Gate System

Sentinel files in `.claude/state/` track workflow state. Soft warnings only — no hard blocks.

- **verify-passed**: Set by `/verify`. Cleared on source edits. Commit/push warns if unset.
- **types-current**: Cleared when collection schemas change. Reminds to run `pnpm generate:types`.
- **design-checked**: Cleared when TSX files change. Reminds to run `/design-check`.

## Session Workflow

1. Work on the task
2. Run `/verify` before committing (lint + tests + build)
3. Run `/session-close` at end of significant sessions (captures learnings to Obsidian vault)
