---
name: analyze
description: Use when the user says "analyze the funnel / content gap / this week's marketing health" — I compute the numbers via Composio (posthog / mixpanel / firecrawl / semrush) or paste, flag the biggest drop / gap / hole, and recommend 2-3 concrete next moves. Writes to `analyses/{subject}-{YYYY-MM-DD}.md` — a ranked action list, not a dashboard.
integrations: [posthog, mixpanel, firecrawl, semrush]
---

# Analyze

One skill for three analysis subjects. The `subject` parameter picks
the lens; "never invent numbers" is shared across all.

## Parameter: `subject`

- `funnel` — stage-by-stage conversion from PostHog / GA4 / Mixpanel
  (or paste), the one drop-off that matters most, and 2-3
  experiments ranked by expected lift × effort.
- `content-gap` — crawl competitor via Firecrawl / Semrush, compare
  to our content, rank gaps by volume × fit / difficulty, produce a
  first-draft brief per top gap.
- `marketing-health` — weekly rollup of what THIS agent shipped
  (blog posts / campaigns / emails / social / page rewrites) by
  grouping `outputs.json` by type, flag gaps ("no drip in 3 weeks"),
  recommend next moves per domain.

If the user names the subject in plain English ("weekly funnel
review", "where are we leaking", "what are we missing vs Ramp",
"Monday marketing review"), infer it. If ambiguous, ask ONE question
naming the 3 options.

## When to use

- Explicit: "weekly funnel review", "analyze the signup funnel",
  "content gap vs {competitor}", "where can we out-rank {X}",
  "Monday marketing review", "weekly readout".
- Implicit: typically scheduled (weekly / Monday) by a routine.
- Cadence: `funnel` weekly, `content-gap` monthly max per
  competitor, `marketing-health` weekly.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `positioning` — required for `content-gap` (competitor list,
  differentiators, fit scoring) and `marketing-health` (framing
  against current positioning + primary CTA). Useful for `funnel`
  (grounding biggest-leak hypotheses). If missing: "want me to
  draft your positioning first? (one skill, ~5m)" and stop.
- `domains.paid.analytics`, `domains.paid.primaryConversion` —
  required for `funnel`. If missing, ask ONE question naming the
  best modality ("connect GA4 / PostHog / Mixpanel via Composio, or
  paste stage-by-stage counts").
- `domains.seo.domain` — required for `content-gap` (our site to
  compare against). Ask if missing.

## Steps

1. **Read ledger + positioning.** Gather missing required fields
   (ONE question each, best-modality first).
2. **Branch on subject.**
   - `funnel`: source numbers in priority order:
     - a) Connected analytics via Composio — run `composio search`
       for the provider in `domains.paid.analytics`, execute the
       funnel / query tool by slug, pull stage counts for the last
       7 days and the prior 7 days.
     - b) Otherwise ask the user to paste `stage | count | period`.
     - c) If neither, stop — don't make up numbers.
     Define stages: use ledger-captured stages if present; else
     propose 4-6 based on primary conversion (e.g. for signup:
     `visit → signup_started → signup_completed → activation_event
     → retained_day_7`), confirm with user on first run, write to
     ledger. Compute per-stage rates + WoW deltas + absolute drop
     counts. Name the **biggest leak** (highest absolute drop AND
     lowest conversion vs. reasonable benchmarks — B2B SaaS:
     visit→signup 2-5%, signup→activation 30-60%, activation→
     day-7 retention 40-70%). Recommend 2-3 experiments ranked by
     (impact × effort): stage targeted + hypothesis (can hand to a
     dedicated A/B spec skill) + effort (this-week /
     this-month / larger) + expected directional lift tied to a
     real mechanism (no magic numbers).
   - `content-gap`: resolve competitor domain(s) — user-named or
     top 1-3 from positioning. Run `composio search web-scrape` /
     `composio search seo` to crawl competitor: ranking keywords,
     top pages by estimated traffic, topic clusters owned. Crawl
     OUR content via connected CMS or `domains.seo.domain` posts
     list. For each competitor-owned topic / keyword record:
     do we cover it (yes / partial / no), search volume (from
     keyword tool), estimated difficulty (relative), positioning
     fit (yes / neutral / off-brand). Rank opportunities by
     `(volume × fit) / difficulty`. Surface top 10 with
     recommended next-action (new post → hand to `write-content`
     channel=blog / refresh existing / skip + why).
   - `marketing-health`: read THIS agent's `outputs.json` (single
     file — we're one agent now, not five). Filter to the review
     window (default last 7 days by `createdAt` / `updatedAt`;
     honor user's "last 2 weeks", "since launch"). Group by
     `type` — blog-post, linkedin-post, x-thread, newsletter,
     community-reply, page-copy, audit, campaign, competitor-
     brief, analysis. Per group compute: count, notable shipped
     (top 3 by recency with title + path + status), drafts still
     open (status = "draft") stale >7 days, gaps — what's MISSING
     that the solo-founder stack expects (no blog this week, no
     campaign brief this week, no newsletter, no welcome sequence
     drafted, social frequency below plan). Look for cross-cutting
     patterns: launch drift (open launch campaign with dependent
     pieces not shipped), unactioned competitor signals,
     positioning drift from recent analyses.
3. **Draft the analysis** (markdown, ~400-700 words for health /
   funnel, longer for content-gap):
   - `funnel` → top-line conversion + funnel diagram (simple text) +
     biggest leak with the number + experiments ranked + status
     (ready, not draft — it's a factual rollup).
   - `content-gap` → Executive summary + Top 10 opportunities table
     + topic-by-topic detail + skip list with reasons.
   - `marketing-health` → Window + TL;DR (3-5 bullets) + What
     shipped by domain + Gaps (severity-ranked) + Cross-cutting
     issues + 3-5 recommended next moves tagged with the in-agent
     skill that executes them (e.g. `[write-content:newsletter]`,
     `[plan-campaign:lifecycle-drip]`, `[audit:landing-page]`) +
     What to flip to ready (stale drafts awaiting sign-off). Status
     `ready`.
4. **Write** atomically to `analyses/{subject}-{YYYY-MM-DD}.md`
   (`*.tmp` → rename). Content-gap uses
   `analyses/content-gap-{competitor-slug}-{YYYY-MM-DD}.md`.
5. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "analysis", title, summary, path,
   status: "ready", createdAt, updatedAt }`.
6. **Summarize to user.** One paragraph:
   - `funnel` → top-line conversion + biggest leak with the number
     + one experiment to run this week + path.
   - `content-gap` → top 3 opportunities with a one-line recommended
     post title each + path.
   - `marketing-health` → "{N} outputs this week across {domains}.
     Biggest gap: {gap}. Biggest next move: {move}. Full review:
     {path}."

## What I never do

- Invent funnel numbers, competitor traffic estimates, or
  engagement stats. Data unreachable → say so and stop (funnel) or
  mark TBD (content-gap).
- Inflate gaps where our coverage is actually fine.
- Promise a lift percentage — experiments come with MDE + mechanism
  caveats.
- Hardcode tool names. Composio discovery at runtime only.

## Outputs

- `analyses/{subject}-{YYYY-MM-DD}.md`
- Appends an entry to `outputs.json` with type `analysis`.
