---
name: triage-bug-report
description: "Use when you paste a raw bug report (Sentry alert, user email, Slack message, error text, screenshot) and want it turned into a structured ticket — I produce reproduction steps (where inferable), severity tied to your severity rules, route (hotfix / current sprint / backlog / close-as-not-a-bug / needs-more-info), and an issue description ready to paste into Linear, Jira, or GitHub Issues. Writes to `bug-triage/{slug}.md`. Never files or closes tickets."
integrations: [sentry, linear, jira, github]
---

# Triage Bug Report

A single raw report → a structured ticket. I never file or close the
ticket — the output is markdown you paste into your tracker.

## When to use

- User: "triage this bug" / "here's a bug report" / "is this P0?" /
  "is this a hotfix?" / "how should I file this?"
- User forwards a Sentry alert, user email, Slack snippet, screenshot
  description, or error trace.

## Steps

1. **Read engineering context** —
   `context/engineering-context.md`. If missing or
   empty, say: "I need the engineering context doc first. Run the
   `define-engineering-context` skill (5 minutes), then come back."
   Stop.
2. **Read `domains.triage.severityRules` from the context ledger
   (`config/context-ledger.json`).** If missing, ask ONE question:
   "I need your severity rules before I can assign P0/P1/P2/P3.
   Paste them, or accept the documented defaults (P0=outage,
   P1=broken feature, P2=degraded with workaround, P3=cosmetic) and
   we move on." Write them into the ledger atomically and continue.
3. **Optionally read**: `runbooks/` — if a
   runbook exists for the affected system, reference it in the route
   recommendation. Graceful on miss.
4. **Parse the report.** Extract: observed behavior, expected
   behavior (if stated), affected surface (endpoint / page / job),
   environment (browser / OS / plan tier / version, if known), first
   seen timestamp (if known), user / customer (if shared), error
   text / stack trace (if included). Mark anything missing as
   UNKNOWN — don't fabricate.
5. **Draft reproduction steps** if the report has enough detail.
   Numbered, terse, imperative ("1. Open /settings. 2. Click
   Export."). If steps can't be inferred, write `**Repro:** needs
   more info — {specific thing missing, e.g. 'which browser',
   'which plan tier'}` and route as `needs-more-info`.
6. **Assign severity.** Apply `config/severity-rules.md` line by
   line. State the severity AND the one-sentence rationale naming the
   rule that triggered ("P1 per rule 'broken feature with no
   workaround' — checkout page errors on submit with no fallback
   path"). Never invent severity without the rules doc.
7. **Pick a route.** One of:
   - `hotfix` — severity P0, or P1 touching a sensitive area per the
     engineering context.
   - `current sprint` — severity P1 with a workaround, or P2 on a
     high-priority surface.
   - `backlog` — severity P2/P3 not on the critical path.
   - `close as not-a-bug` — expected behavior, user misconfiguration,
     feature request in disguise. State why.
   - `needs-more-info` — repro or severity inputs are missing.
8. **Draft the paste-ready issue description.** Format suited to the
   user's tracker (from `config/issue-tracker.json`) — Linear and
   GitHub Issues share a Markdown-friendly shape; Jira gets sections
   with `h3.` headings if specified. Include: title (≤80 chars,
   action-verb-led), summary (2-3 sentences), reproduction steps,
   expected vs. actual, severity + route, affected surface, and any
   artifact links (Sentry URL, Slack permalink) if the user shared
   them.
9. **Write** `bug-triage/{slug}.md` atomically (`.tmp` → rename). Slug
   is short kebab-case derived from the issue (e.g.
   `login-500-safari-ios.md`). Front-matter: `severity`, `route`,
   `affectedSurface`, `reporter` (if known), `firstSeen` (if known).
10. **Append to `outputs.json`** — type `"bug-triage"`, status
    `"draft"`, 2-3-sentence summary naming severity + route + the
    surface. Read-merge-write atomically.
11. **Summarize to user** — one paragraph: "Triaged as {severity} /
    {route}. Reasoning: {one line}. Paste-ready description is at
    {path}. **I have not filed, edited, or closed a ticket — that's
    you.**" Offer one next step ("Want me to run
    `score-ticket-priority` on this too?").

## Hard nos

- Never file the ticket in the tracker. Never close an existing
  ticket. Never assign severity without reading
  `config/severity-rules.md` first.
- Never invent reproduction steps. If the report is thin, mark it
  `needs-more-info` and name what's missing.

## Outputs

- `bug-triage/{slug}.md`
- Appends to `outputs.json` with `{ id, type: "bug-triage", title,
  summary, path, status: "draft", createdAt, updatedAt }`.
