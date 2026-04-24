---
name: review
description: "Use when you say 'Monday review' / 'weekly readout' / 'help-center digest' / 'prep QBR for {account}' — I produce the `scope` you pick: `weekly` (rollup across domains + next moves) · `help-center-digest` (volume, themes, unresolved high-priority) · `qbr` (4-section review: wins / asks-shipped / friction / next). Writes to `reviews/` · `digests/` · `qbrs/`."
integrations:
  docs: [googledocs, notion]
  messaging: [slack]
---

# Review

One skill for every rollup / readout / review ask. Branches on
`scope`.

## When to use

- **weekly** — "Monday review" / "weekly support readout" / "how
  was the support week?" / on the Monday cron routine.
- **help-center-digest** — "weekly help-center digest" / "what
  happened in docs this week?" / on the Sunday cron routine.
- **qbr** — "prep the QBR for {account}" / "outline for my check-in
  with {customer}."

## Ledger fields I read

- `universal.positioning` — for product surface + plan-tier map.
- `domains.success.qbrSegment` — segment worth running QBRs for.
- `domains.quality.reviewCadence` — weekly vs biweekly vs monthly.

If any required field is missing, ask ONE targeted question, write
it, continue.

## Parameter: `scope`

- `weekly` — rollup across all domains. Volume, top themes,
  unresolved high-priority, churn flags that opened, promises due
  this week, next moves grouped by domain. Writes to
  `reviews/{YYYY-MM-DD}.md`.
- `help-center-digest` — docs-specific rollup. Ticket volume, top
  3 themes from `patterns.json`, unresolved high-priority items,
  feature-request velocity, churn flags. Writes to
  `digests/{YYYY-MM-DD}.md`.
- `qbr` — per-account quarterly review. 4 sections: wins (what
  they've achieved), asks-shipped (their requests I shipped),
  friction (still-open pains), next moves (renewal / expansion /
  investment). Writes to `qbrs/{account}-{YYYY-MM-DD}.md`.

## Steps

1. **Read `context/support-context.md`.** If missing, stop.
2. **Read the ledger.** Fill gaps.
3. **Branch on `scope`:**
   - `weekly`: read `outputs.json` filtered to the last 7 days.
     Group by `domain`. For each domain: count + 1-line headline +
     1 unresolved. Read `followups.json` filtered to due this week.
     Read `churn-flags.json` filtered to opened this week. End with
     "2–3 things I recommend you do this week" across the whole
     agent.
   - `help-center-digest`: read `conversations.json` counts for
     the window, `patterns.json` top 3 themes, `requests.json`
     velocity, `known-issues.json` state changes. Surface the
     single most useful docs gap to write next.
   - `qbr`: chain `customer-view view=timeline` for the account.
     Read `requests.json` + `bug-candidates.json` + `followups.json`
     filtered to this account. Structure the doc as wins /
     asks-shipped / friction / next moves, each section grounded
     in the timeline + request IDs.
4. **Write the artifact** atomically.
5. **Append to `outputs.json`** with `type` =
   `weekly-review` | `help-center-digest` | `qbr`,
   `domain: "quality"` (for `weekly` / `help-center-digest`) or
   `domain: "success"` (for `qbr`), title, summary, path.
6. **Summarize to me**: the 2-minute scan. For `weekly` / `digest`,
   always surface — a quiet week is also news.

## Outputs

- `reviews/{YYYY-MM-DD}.md` (for `scope = weekly`)
- `digests/{YYYY-MM-DD}.md` (for `scope = help-center-digest`)
- `qbrs/{account}-{YYYY-MM-DD}.md` (for `scope = qbr`)
- Appends to `outputs.json`.

## What I never do

- Invent numbers to pad a quiet week. If volume's low, write it.
- Include "next moves" without grounding them in a specific output
  or ticket id.
