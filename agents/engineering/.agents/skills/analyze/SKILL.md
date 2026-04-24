---
name: analyze
description: "Use when you say 'Monday engineering review' / 'weekly PR health' / 'what shipped this week' / 'technical competitor pulse' / 'what did {competitor} ship' — I run the `subject` you pick: `engineering-health` rolls up everything this agent produced in the last 7 days (Shipped / In Progress / Blocked / Decisions Needed) · `pr-velocity` pulls the last 7 days of PRs from GitHub or GitLab and computes five DORA-lite metrics · `competitors` fetches engineering blogs, GitHub org activity, changelogs, and API diffs via Exa, Perplexity, or Firecrawl. Writes to `reviews/`, `pr-velocity/`, or `competitor-watch/`."
integrations:
  dev: [github, gitlab]
  search: [exa, perplexityai]
  scrape: [firecrawl]
---

# Analyze

One skill for three analysis subjects. The `subject` parameter picks
the probe; grounding against the engineering context and "never
invent metrics" discipline are shared.

## Parameter: `subject`

- `engineering-health` — weekly rollup across everything this agent
  produced. Reads `outputs.json`, windows last 7 days, writes a
  4-section narrative (Shipped / In Progress / Blocked / Decisions
  Needed) to `reviews/{YYYY-MM-DD}.md`.
- `pr-velocity` — DORA-lite on the last 7 days of PRs. Five metrics:
  PRs merged, median cycle time, largest PR size, reviewer
  concentration, open-to-merge age. Writes to
  `pr-velocity/{YYYY-Www}.md`.
- `competitors` — engineering-focused competitor watch.
  Single-competitor teardown (deep) or N-competitor weekly digest
  (broader, shorter). Writes to
  `competitor-watch/{slug}.md` or `competitor-watch/weekly-{YYYY-MM-DD}.md`.

If the user names the subject in plain English, infer it. If
ambiguous, ask ONE question naming the 3 options.

## When to use

- Explicit: "Monday review", "how's engineering doing", "weekly PR
  health", "cycle time", "technical pulse", "teardown of
  {competitor}".
- Implicit (by routine): Monday engineering health review and
  Friday PR velocity readout can fire this skill automatically.
- Per-subject cadence: engineering-health weekly, pr-velocity
  weekly, competitors weekly (digest) or on demand (teardown).

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `universal.engineeringContext` — required for all subjects. If
  missing: "want me to draft your engineering context first? (one
  skill, ~5m)" and stop.
- `universal.priorities` — all subjects use it to frame relevance.
- `domains.reliability.cicd.provider` — used by `pr-velocity` to
  find the connected code host (GitHub / GitLab / etc.). Ask ONE
  question if missing.
- `domains.development.sensitiveAreas` — used by `pr-velocity` to
  flag large PRs touching them, and by `competitors` to rank
  threats.

## Steps

1. **Read ledger + engineering context.** Gather missing required
   fields per subject (ONE question each, best-modality first).
   Write atomically.

2. **Discover tools via Composio.** For `pr-velocity` and
   `competitors`, run `composio search code-hosting` and
   `composio search web-scrape` / `composio search web-search`.
   If a required category has no connection, name it and stop.

3. **Branch on subject.**

   - `engineering-health`:
     - Read `outputs.json` at the agent root.
     - Filter to the review window (default 7 days; honor the
       user's "last 2 weeks" / "since the launch").
     - Group by `domain` (planning / triage / development /
       reliability / docs). For each domain compute: count by
       `type`, notable shipped items (top 3 by recency, title +
       path + status), stale drafts (status "draft", >7 days
       idle), gaps (e.g. an incident without a postmortem, a new
       feature without a tutorial or changelog, a design-doc with
       no release plan).
     - Cross-cutting: release-plan drift (open
       `release-plans/{slug}.md` whose dependent artifacts are
       missing), un-actioned competitor threats, feature-fit
       verdicts that never landed on the roadmap, roadmap items
       with zero activity.
     - Write a 4-section narrative to `reviews/{YYYY-MM-DD}.md`:
       Window + TL;DR · Shipped · In Progress · Blocked ·
       Decisions Needed (prioritized, each with a paste-ready
       follow-up prompt). Close with a per-domain table: domain ·
       outputs shipped · drafts open · last activity · status
       (active / quiet / missing).

   - `pr-velocity`:
     - Pull last 7 days of merged + currently-open PRs from the
       connected code host via the discovered slug.
     - Compute: (1) PRs merged, (2) median cycle time open→merge,
       (3) largest PR size in lines changed, (4) reviewer
       concentration (share on top reviewer), (5) open-to-merge
       age of currently-open PRs.
     - On the first run, establish a rolling baseline in
       `pr-velocity/baseline.json` across the last 4 weeks of
       history (or whatever's available). Compare every subsequent
       run against it.
     - One-line diagnosis per anomaly (cycle-time ≥ 50% over
       baseline, largest PR > 1000 lines, reviewer concentration
       > 80%, open PR > 14 days old). Flag any large PR touching
       `sensitiveAreas` as "review escalate". Write to
       `pr-velocity/{YYYY-Www}.md`.

   - `competitors`:
     - Determine mode: single competitor → teardown; N competitors
       or "weekly pulse" → digest. Default to top 3 from the
       engineering context doc or ledger.
     - Gather per competitor (last 7 days for digest, 30 days for
       teardown): engineering blog posts (title + 1-line summary +
       URL + date), GitHub org releases + notable commits + star
       delta, public changelog, API diffs (OpenAPI or versioned
       REST/GraphQL docs). Optional: conference talks, job-post
       hints.
     - For each signal ask: does this threaten a top-3 priority?
       does it expose a gap we should press? is it parity we need
       to match?
     - Teardown structure (~500-800 words): summary · what's new ·
       engineering-blog claims · GitHub activity · API / schema
       diffs · technical threats (ranked) · opportunities
       (ranked) · recommended moves (3 one-week actions tagged
       with the in-agent skill that owns each —
       `[plan-roadmap]` / `[draft-design-doc]` /
       `[draft-runbook]` / etc.) · sources.
     - Digest structure (~300-500 words): headline table
       (competitor · top signal · threat? · opportunity?) ·
       per-competitor bullets · cross-cutting pattern · 3 recommended
       moves tagged with the owning in-agent skill · sources.

4. **Never invent metrics, commit counts, or competitor moves.**
   Every claim ties to a URL + timestamp, a real API response, or
   is marked `UNKNOWN`.

5. **Write** atomically to the target path (`*.tmp` → rename).
   Paths:
   - `engineering-health` → `reviews/{YYYY-MM-DD}.md`.
   - `pr-velocity` → `pr-velocity/{YYYY-Www}.md`.
   - `competitors` → `competitor-watch/{competitor-slug}.md`
     (teardown) or `competitor-watch/weekly-{YYYY-MM-DD}.md`
     (digest).

6. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type, title, summary, path, status, createdAt,
   updatedAt, domain }`. Type: `"review"` for engineering-health,
   `"pr-velocity"` for pr-velocity, `"competitor"` for competitors.
   Domain: `"planning"` for engineering-health + competitors,
   `"development"` for pr-velocity. Status `"ready"` for reviews and
   velocity, `"draft"` for competitor teardowns.

7. **Summarize to user.** One paragraph: biggest finding +
   decision needed + path. For `engineering-health`, lead with the
   single biggest decision. For `pr-velocity`, lead with the one
   anomaly or "all green vs baseline." For `competitors`, lead with
   the biggest technical threat + the one move this week.

## What I never do

- Invent metrics. If tracking data is thin, mark UNKNOWN — no
  DORA-dashboard fabrication.
- Invent competitor commit counts, release dates, or API diffs.
  Every claim → URL + timestamp or UNKNOWN.
- Overwrite `reviews/` / `pr-velocity/` / `competitor-watch/` —
  every run writes a new dated file.
- Hardcode tool names — Composio discovery at runtime only.

## Outputs

- `reviews/{YYYY-MM-DD}.md` (engineering-health)
- `pr-velocity/{YYYY-Www}.md` + `pr-velocity/baseline.json` (pr-velocity)
- `competitor-watch/{competitor-slug}.md` or
  `competitor-watch/weekly-{YYYY-MM-DD}.md` (competitors)
- Appends an entry to `outputs.json` per run.
