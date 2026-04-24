---
name: prep-package
description: "Use when you say 'prep the Q{N} board pack' / 'draft the monthly investor update' / 'assemble the {quarter} investor letter' — I draft the package you need. Pick `type`: `board-pack` is the standard 8-section deck (TL;DR, business update, metrics, OKRs, wins, challenges, asks, appendix) · `investor-update` is the monthly or quarterly CEO-voice narrative grounded in OKR movement, decisions, and metrics. Both flag every TBD."
integrations: [googledocs, notion, googledrive]
---

# Prep Package

One skill for the two big founder-voice artifacts — the board pack and the investor update. Both are opinionated assembly jobs on data you already have: OKRs, decisions, metrics, wins, challenges.

## When to use

- `type=board-pack` — "prep the Q{N} board pack" / "build the {yyyy-qq} board pack" / board meeting is 2+ weeks out per your investor cadence.
- `type=investor-update` — "draft the monthly investor update" / "write the Q{N} investor letter" / update is due per cadence.

## Ledger fields I read

- `universal.company` — name, website, 30s pitch, stage (sets the update's framing).
- `universal.voice` — so the CEO-voice narrative sounds like you.
- `universal.positioning` — confirms `context/operations-context.md` exists.
- `domains.investors.cadence` — monthly / quarterly / both; investor list + preferred format.
- `domains.investors.reportingPeriod` — anchors the timeframe for metric pulls.

Missing fields → ONE targeted question with modality hint (connected app > file > URL > paste) → write to ledger → continue.

## Parameter: `type`

- `board-pack` — 8-section deck draft for a quarterly board meeting. Output: `board-packs/{yyyy-qq}/board-pack.md` (+ optional mirror to a Google Doc via Composio if connected).
- `investor-update` — CEO-voice narrative for a monthly or quarterly update. Output: `investor-updates/{yyyy-qq}/update.md`.

## Steps

1. Read `config/context-ledger.json`. Fill gaps with ONE modality-ranked question.
2. Read `context/operations-context.md` — active priorities, operating rhythm, hard nos, voice notes. This anchors what "progress" means.
3. Gather source data:
   - Latest OKR snapshot from `okr-history.json` (produced by `track-okr`). Compute movement vs prior period.
   - Decisions logged in `decisions.json` + per-decision notes in `decisions/{slug}/` within the reporting period.
   - Metric values from `metrics-daily.json` (produced by `track-metric`) and `rollups/` (from `run-review period=metrics-rollup`).
   - Weekly reviews in `reviews/` for the period.
   - Open anomalies from `anomalies.json`.
   - Bottlenecks from `bottlenecks.json`.

4. Branch on `type`:

   **If `type = board-pack`:**
   - Draft the 8-section pack:
     1. **TL;DR** — one page, 3-5 bullets: biggest movement, biggest ask, biggest risk.
     2. **Business update** — narrative, 300-500 words. What shipped, what matters, what's next.
     3. **Metrics** — table of tracked metrics with current / prior-period / direction / commentary.
     4. **OKRs** — KR-level status (on-track / at-risk / off-track) with root cause for off-track.
     5. **Wins** — 3-5 specific wins, each with a metric or decision anchor.
     6. **Challenges** — 2-4 specific challenges, each with a hypothesis and what we're trying.
     7. **Asks** — explicit asks of the board (intros, advice, decisions).
     8. **Appendix** — links to decision records, detailed queries, weekly reviews.
   - Flag every field I couldn't fill with `TBD — {what you need to bring}`. Never invent numbers.

   **If `type = investor-update`:**
   - Draft the CEO-voice narrative (~600-900 words):
     - Opening: one paragraph, stage + what's true today.
     - Highlights: 3-5 bullets of what moved (metric / decision / launch).
     - Lowlights: 1-2 honest items with what we're doing about them.
     - KR status block: one-line per KR with direction.
     - Asks: 2-3 specific things — intros, advice, sounding-board time.
     - Closing: one paragraph, next-period focus.
   - Voice-match against `config/voice.md` + priorities from `context/operations-context.md`.
   - Flag every TBD.

5. Write atomically (`.tmp` → rename) to the appropriate path.
6. If Google Docs (`googledocs`) or Notion (`notion`) is connected and you've opted in, mirror the draft into your preferred format with a link back.
7. Append to `outputs.json` with `{id, type, title, summary, path, status: "draft", createdAt, updatedAt, domain: "planning"}`. Type = `"board-pack"` or `"investor-update"`.
8. Summarize: the path + a list of every TBD I flagged + the one thing you should review first (e.g. "Challenges section — the hypothesis on pricing-page drop is mine, not yours; sanity-check it before sending").

## Outputs

- `board-packs/{yyyy-qq}/board-pack.md` (+ optional Google Doc mirror).
- `investor-updates/{yyyy-qq}/update.md` (+ optional Google Doc mirror).
- Appends to `outputs.json`.

## What I never do

- Send, publish, or share. Drafts only — you review, edit, and send.
- Invent metrics, quotes, or movement I don't have evidence for. TBD is not a failure mode, it's the honest state.
- Promise outcomes. "We'll hit {KR} by {date}" → only if you said it.
- Touch investor records in a CRM.
