---
name: analyze
description: "Use when you say 'Monday people review' / 'score retention risk' / 'who's a flight risk' / 'synthesize Glassdoor' / 'what's our employer brand' — I run the `subject` you pick: `people-health` rolls up what shipped this week across hiring, onboarding, performance, and compliance from `outputs.json` · `retention-risk` fuses check-in, sentiment, tenure, and comp signals into GREEN/YELLOW/RED per person · `employer-brand` clusters reviews and survey themes into a leadership readout. Writes to `analyses/{subject}-{YYYY-MM-DD}.md`."
integrations:
  messaging: [slack]
  crm: [hubspot]
  analytics: [posthog]
  scrape: [firecrawl]
---

# Analyze

Three analyses behind one skill — all structured the same way (gather
→ classify → write to `analyses/`), differing only by subject. Pick
the subject; I pick the sources and the output shape.

## When to use

- `subject=people-health` — "Monday people review", "weekly people
  readout", "what's happening across HR this week".
- `subject=retention-risk` — "score retention risk", "who's a flight
  risk", "check team health", "retention readout".
- `subject=employer-brand` — "what's our employer brand", "synthesize
  Glassdoor", "leadership readout on what the team is saying", "review
  pulse".

Chains inline from routines (Monday review surfaces `people-health`;
after a manager change, you might run `retention-risk`).

## Ledger fields I read

- `universal.company` — stage + team size inform the lens.
- `universal.icp` — skipped; not relevant here.
- `domains.people.roster` — for retention scoring, I need the current
  team (HRIS connection preferred; paste fallback).
- `domains.people.hris` — the connected HRIS slug.
- `domains.people.reviewSources` — where we pull external reviews /
  surveys / anonymous feedback from (for `employer-brand` only).

If any required field is missing, I ask ONE targeted question with a
modality hint (Composio connection > file drop > URL > paste), write
it, continue.

## Parameter: `subject`

- `people-health` — rolls up everything in `outputs.json` produced in
  the review window (default last 7 days). Groups by domain (Hiring,
  Onboarding, Performance, Compliance, Culture). Per domain: what
  shipped, what's stale (>7 days as `draft`), and gaps. Writes to
  `analyses/people-health-{YYYY-MM-DD}.md`.
- `retention-risk` — fuses four signal families per team member
  (engagement from `checkins/`, sentiment from recent check-in tone,
  tenure milestones from HRIS, comp exposure vs. bands in
  `context/people-context.md`). Classifies GREEN / YELLOW / RED with
  the signal combination written on every RED. Writes to
  `analyses/retention-risk-{YYYY-MM-DD}.md`. Founder-eyes-only.
- `employer-brand` — pulls reviews / survey responses / feedback items
  from connected sources (Glassdoor / anonymous-feedback / survey
  platforms), clusters themes, derives top 3 strengths + top 3
  concerns + emerging patterns, flags contradictions vs stated values.
  Writes to `analyses/employer-brand-{YYYY-MM-DD}.md`. Leadership
  readout — never published externally.

## Steps

1. **Read the ledger**; fill gaps with one targeted question.
2. **Read `context/people-context.md`.** The review / score / brief is
   framed against current values, leveling, comp stance, review-cycle
   rhythm, escalation rules — not generic HR benchmarks.
3. **Branch on `subject`:**

   - **If `subject = people-health`:**
     1. Read `outputs.json`. Filter to the review window (default 7
        days by `createdAt` / `updatedAt`; accept "last 2 weeks" or
        "since last cycle" as overrides).
     2. Group entries by `domain`: Hiring, Onboarding, Performance,
        Compliance, Culture.
     3. Per domain: count by `type`, top 3 recent items (title + path
        + status), drafts >7 days old.
     4. Cross-cutting patterns: open-req drift (a req in the context
        doc with no candidate moves in 2+ weeks), retention reds with
        no stay-conversation follow-up, compliance items due in <14
        days not closed, review-cycle drift.
     5. Draft (~400-700 words): Window + TL;DR (3-5 bullets) → What
        shipped, per domain → Gaps (severity-ranked) → Cross-cutting
        issues → Top 3 next moves → What to flip to `ready`.

   - **If `subject = retention-risk`:**
     1. Resolve the roster via connected HRIS or
        `domains.people.roster`.
     2. Per person, fuse four signal families (mark UNKNOWN when the
        source isn't available):
        - **Engagement:** check-in response rate over last 4
          `checkins/`, chat activity delta vs 30-day baseline via
          connected Slack / Discord, PR / commit / ticket cadence via
          GitHub / Linear / Jira for eng ICs.
        - **Sentiment:** check-in response tone drift, cross-team
          mentions, anonymous-feedback mentions if a feedback source
          is connected.
        - **Tenure milestones:** approaching cliff vesting (month 12
          on a 4-yr / 1-yr-cliff — confirm from the context doc),
          post-promotion honeymoon (90 days), recent manager change.
        - **Comp exposure:** time since last comp review vs cadence;
          gap vs band midpoint (>15% below is a flag) if comp bands
          exist.
     3. Classify: RED = 2+ families negative AND a tenure or comp
        trigger. YELLOW = 1 family negative OR a standalone
        tenure/comp trigger. GREEN = clean. Do NOT publish the formula.
     4. Write each RED's signal combination (e.g. "check-in response
        dropped 4/4 → 1/4 over 30 days + 12-month cliff + 14 months
        since last comp review"). Recommend `draft-performance-doc
        type=stay-conversation` for every RED.
     5. Structure: Summary counts → Per-person scores (alphabetical)
        → RED reasoning blocks → Recommended next actions.

   - **If `subject = employer-brand`:**
     1. Discover review sources: `composio search reviews`, `composio
        search survey`, `composio search feedback`. If nothing is
        connected, name the category to link (reviews, survey,
        feedback) and stop.
     2. Ask ONE scope question: "Window — 30, 90, or 365 days?"
        Default 90.
     3. Fetch items per source: date, rating, full text, role /
        tenure if attached.
     4. Cluster verbatim mentions. Each cluster: label, count, 3-5
        verbatim quotes, valence (+/0/-).
     5. Derive top 3 strengths, top 3 concerns, emerging patterns
        (clusters growing in recent window vs earlier).
     6. Compare against stated values and hard nos in
        `context/people-context.md`. Flag contradictions as items to
        address.
     7. Recommend 3 moves: where to double down, where to close a
        gap, which concern routes to a human lawyer (discrimination /
        harassment / wage-dispute shapes).
     8. Structure (~500-900 words): Scope → Top strengths → Top
        concerns → Emerging patterns → Contradictions vs values →
        Recommended responses → Routing flags → Sources.

4. **Never invent.** Every cluster, every signal, every metric ties
   to a fetched record. Mark `UNKNOWN` where a signal family has no
   source. For `people-health`, never invent activity an agent didn't
   produce.
5. **Write atomically** to the per-subject path above (`*.tmp` →
   rename).
6. **Append to `outputs.json`** with:
   ```json
   {
     "id": "<uuid v4>",
     "type": "analysis",
     "title": "<subject> — <YYYY-MM-DD>",
     "summary": "<2-3 sentences>",
     "path": "analyses/<subject>-<YYYY-MM-DD>.md",
     "status": "<ready for people-health; draft for retention-risk and employer-brand>",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>",
     "domain": "<performance for retention-risk, culture for employer-brand, performance for people-health>"
   }
   ```
7. **Summarize.** One paragraph with counts + top finding + path.
   For `retention-risk`, remind: founder-eyes-only, not for public
   channels. For `employer-brand`, remind: leadership readout, not
   for external publishing.

## Outputs

- `analyses/people-health-{YYYY-MM-DD}.md` (`subject=people-health`).
- `analyses/retention-risk-{YYYY-MM-DD}.md` (`subject=retention-risk`).
- `analyses/employer-brand-{YYYY-MM-DD}.md` (`subject=employer-brand`).
- Appends to `outputs.json`.

## What I never do

- Invent activity, signals, or quotes — thin sources get UNKNOWN.
- Publish `retention-risk` or `employer-brand` artifacts outside of
  you (optional: forward to a named team lead in the founder →
  manager chain, never public).
- Recommend a counter-offer on a retention RED unless
  `context/people-context.md` explicitly allows it.
