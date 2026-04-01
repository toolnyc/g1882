---
name: session-close
description: End-of-session ritual. Capture learnings, update docs, clear sentinels.
---

# /session-close

Wrap up the current session by capturing what was done, what was learned,
and updating documentation if needed.

## Procedure

1. Check `git diff --stat HEAD` to see what changed
2. Summarize what was built or fixed in this session
3. Review if any new conventions emerged:
   - If yes, update the Active Conventions table in CLAUDE.md immediately
   - If any skill procedures are now inaccurate, fix them
4. Check if ARCHITECTURE.md needs updates (new files, changed patterns)
5. Clear all sentinels
6. Write a session summary (output to the user)

## Session Summary Format

```
## Session Summary — YYYY-MM-DD

### What was done
- [bullet points]

### Files changed
- [key files, not exhaustive]

### New conventions (if any)
- [convention]: [why]

### Open items
- [anything left unfinished]
```

## Sentinel Lifecycle

- **Clears:** All sentinels
