---
name: session-closeout
description: Gracefully exit unproductive sessions with a structured summary of attempts, blockers, and outstanding work. Use when a session has stalled, hit resource/time limits, or failed to solve the original problem—either on user request or agent self-detection.
---

# Session Closeout

End unproductive sessions cleanly by documenting what was attempted, what blocked progress, and what remains to be done. Outputs a summary doc to `.agents/docs/` that future agents can pick up without context loss.

## Quick start

1. Call this skill when: session is stalled, user says "wrap up" / "end session", time/token budget depleted, or problem proves harder than expected
2. Capture current state: run `git status`, `git diff --cached`, review recent commits
3. Draft summary with sections: Problem, Attempts, Root Causes, Blockers, Outstanding
4. Save to `.agents/docs/session-<ISO-date>-<brief-slug>.md`
5. Done—future agent reads the doc and continues

## Workflows

### User-initiated closeout

1. **User says "wrap up"** → Acknowledge, ask for a brief reason (optional)
2. **Gather session artifacts**:
   - What was the original problem statement?
   - Run `git status --porcelain` to see modified/untracked files
   - Run `git log --oneline -10` to see what was committed/attempted
   - Review `.claude/state/` for any sentinels or progress markers
3. **Compile summary** (see structure below)
4. **Write to `.agents/docs/`** with filename: `session-<YYYY-MM-DD>-<slug>.md`
5. **Confirm save** and hand off context

### Agent-initiated closeout (self-detected)

1. **Detect futility**: stuck in loop, same error recurring, progress stalled >5 attempts
2. **Don't panic**—this is normal. Log reason in summary
3. **Follow user-initiated steps 2–5** above
4. **Note in summary**: "Agent detected diminishing returns after N attempts"

## Summary Structure

```markdown
# Session Closeout — [Original Problem Title]

**Session Date**: YYYY-MM-DD HH:MM  
**Status**: Unresolved (give brief reason)  
**Next Agent**: [suggested handoff type, e.g., "research-agent for investigation" or "impl-agent for targeted fix"]

## Original Problem

[1–2 sentence summary of what was being solved]

## Attempts Made

- **Attempt 1**: [what was tried, result or why stopped]
- **Attempt 2**: [what was tried, result or why stopped]
- [... continue chronologically]

## Root Causes & Blockers

- **Blocker 1**: [specific issue preventing progress, e.g., "Payload hook timing conflict", "Type generation loop"]
- **Blocker 2**: [...]

## Outstanding Work

- [ ] [Concrete next task with context, e.g., "Verify whether beforeValidate runs before afterChange"]
- [ ] [Another task]
- [ ] [...]

## Artifacts for Next Agent

- **Modified files**: [list file paths with brief note, e.g., `src/collections/Media.ts (partial fix, needs hook refactor)`]
- **New branches**: [if any created but not merged]
- **Key commits**: [hash + message of any relevant commits, even if reverted]
- **Logs/errors**: [paste relevant error messages or Sentry links]
```

## Tips

- **Be honest**: If you hit a wall, say so. No shame in it.
- **Specificity matters**: "Type generation loop" is better than "TS errors"
- **Link artifacts**: Include file paths, git hashes, error codes so next agent has concrete starting points
- **Timestamp attempts**: Note rough times so future agent understands effort spent
- **Note assumptions**: If you made assumptions that turned out wrong, log them—saves future agent investigation time

## Advanced features

See [EXAMPLES.md](EXAMPLES.md) for realistic closeout docs from Gallery 1882 sessions.
