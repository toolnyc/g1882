# Triage Labels

The `triage` skill uses five labels to move incoming issues through a workflow. This project uses the **standard vocabulary**:

| Label | Purpose | Next Steps |
|-------|---------|-----------|
| `needs-triage` | Maintainer hasn't reviewed yet; unclear scope or priority | Reviewer evaluates, asks clarifying questions, or applies `needs-info` |
| `needs-info` | Waiting on reporter for more context (repro steps, logs, use case) | Reporter responds → maintainer removes label and applies `ready-for-agent` or `ready-for-human` |
| `ready-for-agent` | Fully specified; an AI agent can pick it up with no human context | Agent implements; creates PR → human reviews and merges |
| `ready-for-human` | Requires human judgment or implementation skills agents lack | Human engineer implements |
| `wontfix` | Issue will not be actioned (duplicate, out-of-scope, or by design) | Close the issue |

## When Issues Land

New issues start with **no labels**. The first step in triage is to apply `needs-triage`. The `triage` skill automates this state machine.

## Custom Overrides

This project uses the **default label names** — no custom overrides. If you need to rename a label globally, update this file and re-run the setup skill.
