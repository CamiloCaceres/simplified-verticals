---
name: triage-tech-debt
description: "Use when you say 'rank the tech debt' / 'what's rotting' / 'refresh the debt list' / 'tech debt review' — I maintain a single running `tech-debt.md` at the agent root with area, problem, impact (1-5), effort (S/M/L/XL), and suggested next step per entry, sorted by impact / effort (highest value first). Read-merge-write — never wholesale-overwrite."
integrations: [github, gitlab]
---

# Triage Tech Debt

## When to use

- Explicit: "rank the tech debt", "what's rotting", "refresh the
  tech-debt list", "triage debt", "top tech-debt items".
- Implicit: after a new audit or a rough week of incidents, the
  user asks "what do we fix next".
- Run as often as weekly or as rarely as quarterly — the doc is a
  living inventory, not a point-in-time report.

## Steps

1. **Read engineering context**:
   `context/engineering-context.md`. If missing,
   tell the user to run `define-engineering-context` first and stop.
   Impact scoring depends on knowing the actual stack and current
   priorities.
2. **Read config**: `config/stack.json` and
   `config/sensitive-areas.md`. Debt in sensitive areas auto-scores
   at least impact 3 (medium-high) — regressions here are costly.
3. **Read existing `tech-debt.md` at the agent root** if it exists.
   Parse every existing entry into an in-memory list (preserve `id`,
   `createdAt`). If the file doesn't exist, start fresh.
4. **Gather new debt candidates.** Sources, in order:
   - Recent `architecture-audits/*.md` — high/medium findings that
     aren't yet in the debt list.
   - Recent `pr-reviews/*.md` — `merge-with-changes` / `hold`
     patterns that recur across PRs.
   - Anything the user named directly in this conversation.
   - Optional: `composio search issue-tracker` to read any tickets
     tagged `tech-debt` / `refactor` / `chore`.
5. **Score each entry** on impact (1-5) and effort (S / M / L / XL).
   Impact considers: user-facing risk, blast radius, blocks-other-work,
   sensitivity. Effort is engineering-hours gut feel.
6. **Merge, dedupe, sort.** For each new candidate, check if it's
   already in the list (by area + problem). If yes, update (refresh
   `updatedAt`, adjust impact/effort if changed). If no, add with
   a new `id` and `createdAt`. Sort the final list by
   `impact / effort-weight` descending — the
   highest-value-per-hour items first. Effort weights: S=1, M=2,
   L=4, XL=8.
7. **Write `tech-debt.md`** at the agent root atomically (`*.tmp`
   → rename). Structure:
   - Header with last-updated date.
   - A markdown table OR section-per-entry. Each entry carries:
     `id` (short), `area`, `problem`, `impact`, `effort`,
     `suggested next step`, `createdAt`, `updatedAt`.
   - A "Top 3 next week" callout at the top — the three highest
     impact-per-effort items.
8. **Append to `outputs.json`** — if no `tech-debt` entry exists,
   create one. If it exists, update `updatedAt` and refresh
   `summary` (total items + top 3).
   `{ id, type: "tech-debt", title: "Tech Debt Inventory", summary,
   path: "tech-debt.md", status: "ready", createdAt, updatedAt }`.
9. **Summarize to user** — the top 3 next week, the count of new
   items merged in, and the path.

## Never invent

Every debt item ties to a real file, system, PR, or incident. If
an item is speculative, mark it as such and drop the impact score.
Never wholesale-overwrite `tech-debt.md` — always read-merge-write.

## Outputs

- `tech-debt.md` (at agent root, living doc)
- Updates `outputs.json` with type `tech-debt` (single entry,
  updated in place).
