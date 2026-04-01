---
name: verify
description: Run lint, tests, and build. Fix any failures. Set verify-passed sentinel.
---

# /verify

Run the full quality gate: lint → unit tests → integration tests → build.
Fix any failures before re-running. Loop until all pass.

## Procedure

1. Clear the `verify-passed` sentinel (start fresh)
2. Run `pnpm lint:fix` — fix any ESLint/TypeScript errors
3. Run `pnpm test:unit` — fix any failing unit tests
4. Run `pnpm test:int` — fix any failing integration tests
5. Run `pnpm build` — fix any build errors
6. If any step failed and was fixed, re-run ALL steps from the top
7. When all pass: set `verify-passed` sentinel

## Rules

- Never skip tests or disable ESLint rules to make them pass
- Never add `@ts-ignore` or `@ts-expect-error` to bypass type errors
- If a test is genuinely wrong, fix the test — but explain why
- If build fails due to type errors, run `pnpm generate:types` first
- Report what was fixed at the end

## Sentinel Lifecycle

- **Clears:** `verify-passed` (at start)
- **Sets:** `verify-passed` (on success)
