---
name: run-review
description: "Use when you say 'Monday ops review' / 'weekly readout' / 'weekly metrics pulse' — I roll up what shipped and what moved. Pick `period`: `weekly` aggregates every skill's output last week, cross-references priorities + renewals, flags gaps, recommends next moves · `metrics-rollup` is the cross-metric week-over-week pulse (every tracked metric, WoW change, classification, open anomalies). Writes to `reviews/` or `rollups/`."
integrations: [googlesheets]
---

# Run Review

The cross-cutting Monday ritual. Two sub-reviews behind one primitive — you'll usually want the weekly review on Mondays and wire the metrics rollup into it.

## When to use

- `period=weekly` — "Monday ops review" / "weekly readout" / "what happened across my ops this week".
- `period=metrics-rollup` — "weekly metrics readout" / "how's the business doing this week" / "give me the data for the Monday review".

## Ledger fields I read

- `universal.positioning` — confirms `context/operations-context.md` exists (active priorities, rhythm).
- `domains.data.metrics` — the metric registry (for `metrics-rollup`).
- `domains.investors.cadence` — so the review flags upcoming investor-update or board deadlines.

Missing → ONE modality-ranked question → write to ledger → continue.

## Parameter: `period`

- `weekly` — the founder's Monday review. Aggregates last 7 days of `outputs.json` across every skill in this agent, cross-references with active priorities and the renewal calendar, flags gaps, surfaces next moves. Output: `reviews/{YYYY-MM-DD}.md`.
- `metrics-rollup` — cross-metric weekly pulse. Reads every tracked metric, computes week-over-week change, classifies vs direction, flags open anomalies. Feeds the `weekly` review. Output: `rollups/{YYYY-MM-DD}.md`.

## Steps

1. Read `config/context-ledger.json`. Fill gaps with ONE modality-ranked question.
2. Read `context/operations-context.md` — active priorities, operating rhythm, key contacts, vendor posture, hard nos.
3. Branch on `period`:

   **If `period = metrics-rollup`:**
   - Read `config/metrics.json` for the metric registry.
   - For each metric, read the last 14 snapshots from `metrics-daily.json`.
   - Compute: this-week value, last-week value, WoW delta, WoW %, classification vs declared direction (improved / stable / degraded), note any open anomaly in `anomalies.json`.
   - Rank by biggest movement (absolute WoW%) first, then by priority (metrics tied to active priorities first).
   - Write the rollup as a scannable table + 2-3 sentence commentary on the top 3 movers.

   **If `period = weekly`:**
   - Optionally read the latest `rollups/{YYYY-MM-DD}.md` if present — if not, consider suggesting a `metrics-rollup` run before the review, but don't block.
   - Scan `outputs.json` for every entry with `updatedAt` in the last 7 days. Group by skill / domain.
   - Read `renewals/calendar.md` — flag anything renewing in the next 30 days.
   - Read `bottlenecks.json` and `decisions.json` (last 30 days).
   - Produce the review:
     - **What shipped** — by domain (Planning / People / Finance / Vendors / Data), bulleted with paths.
     - **What moved** — top 3 metric movers from the rollup if available.
     - **What's stale** — things started but not touched in 3+ weeks.
     - **Gaps vs priorities** — each active priority → what we did for it this week → honest verdict (on-track / at-risk / off-track).
     - **Upcoming deadlines** — renewals in next 30d, investor updates due, board meetings.
     - **The one move** — the single most useful thing to do this week.

4. Write atomically (`.tmp` → rename) to the appropriate path.
5. Append to `outputs.json` with `{id, type, title, summary, path, status: "ready", createdAt, updatedAt, domain: "planning" or "data"}`. Type = `"weekly-review"` or `"metrics-rollup"`.
6. Summarize to you: the one move (weekly) or the top 3 movers (rollup).

## Outputs

- `reviews/{YYYY-MM-DD}.md` (weekly)
- `rollups/{YYYY-MM-DD}.md` (metrics-rollup)
- Appends to `outputs.json`.

## What I never do

- Claim progress on a priority I can't evidence in `outputs.json`.
- Invent a metric movement — if data is missing, I say so.
- Replace the decision ledger — if the review surfaces a decision-shaped item, I flag it as a `log-decision` candidate; I don't record it as one.
