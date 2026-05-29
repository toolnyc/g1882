# Issue Tracker

Issues for this project are tracked in **GitHub Issues** at [`toolnyc/g1882`](https://github.com/toolnyc/g1882/issues).

## How Agent Skills Use This

When you run skills like `to-issues`, `to-prd`, `triage`, or other engineering skills, they will:

- **Create issues** using the `gh` CLI (GitHub's command-line tool)
- **Read existing issues** to understand scope and dependencies
- **Apply labels** from the triage vocabulary (see `triage-labels.md`)
- **Link** issues in descriptions and cross-references

## Prerequisites

Ensure the `gh` CLI is installed and authenticated:

```bash
gh auth status
```

If not authenticated, run:

```bash
gh auth login
```

## Issue Workflow

1. **Create** — use `to-issues` or `to-prd` skill to batch-create issues from a plan or specification
2. **Triage** — use `triage` skill to move issues through `needs-triage` → `needs-info` → `ready-for-agent` → `ready-for-human` → `wontfix`
3. **Implement** — agents pick up `ready-for-agent` issues and create feature branches
4. **Review** — human reviewers check PRs; once merged, issues close automatically (add "Closes #123" to PR description)

## Repository Details

- **Owner**: `toolnyc`
- **Repo**: `g1882`
- **URL**: https://github.com/toolnyc/g1882
- **Default branch**: `main` (but work happens on `preview` and `prod`; see AGENTS.md for branching rules)
