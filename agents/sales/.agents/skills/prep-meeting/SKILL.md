---
name: prep-meeting
description: "Use when you say 'prep me for my {discovery / demo} with {Acme}' / 'prep the QBR for {customer}' — I prep the `type` you pick: `call` (pre-call one-pager: goal · attendees · question bank prioritized on the weakest qualification pillar · objections · exit criteria · landmines) · `qbr` (QBR pack: outcomes shipped with numbers · usage trend via PostHog · open asks · risks · next-quarter goal · renewal runway). Writes to `deals/{slug}/call-prep-{date}.md` or `customers/{slug}/qbr-{YYYY-QN}.md`."
integrations: [hubspot, salesforce, attio, googlecalendar, gong, fireflies, posthog]
---

# Prep Meeting

One skill for two meeting-prep shapes. The `type` parameter picks the
structure; playbook-grounding and "no generic templates" discipline
are shared.

## Parameter: `type`

- `call` — the pre-call one-pager (discovery / demo / followup /
  late-stage call). Meeting goal · attendees · question bank ·
  objections · exit criteria.
- `qbr` — the Quarterly Business Review pack for an existing
  customer. Outcomes shipped · usage trend · open asks · risks ·
  next-quarter goal.

If the user's ask names the type in plain English ("call prep",
"QBR"), infer. Otherwise ask ONE question naming the 2 options.

## When to use

- Explicit triggers listed in the description.
- Implicit: `daily-brief` detects an imminent meeting with no prep
  and chains here for `type=call`; the customer-retention routine
  chains here for `type=qbr` before the renewal window.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `playbook` — from `context/sales-context.md`. Required.
  `type=call` needs qualification framework + deal stages + objection
  handbook + primary first-call goal. `type=qbr` needs success-metric
  definition + renewal pricing stance.
- `domains.crm.slug` — deal / customer record. Ask ONE question if
  missing.
- `domains.meetings.callRecorder` — used to pull prior call
  transcripts for `type=call`.
- `domains.retention.productUsage` — used for `type=qbr` usage trend.

## Steps

1. **Read ledger + playbook.** Gather missing required fields (ONE
   question each, best-modality first). Write atomically.

2. **Branch on type.**
   - `call`:
     1. Read the deal row in `deals.json` and any prior call notes
        in `calls/{slug}/`. Read any account brief in
        `accounts/{slug}/brief-*.md` (chain into `research-account
        depth=full-brief` if missing and user approves).
     2. Pull meeting details from Google Calendar (via Composio) if
        a meeting time is specified. Capture attendees (title +
        role, enrich via LinkedIn if thin).
     3. Compile the one-pager:
        - **Meeting goal** — pulled from the playbook's primary
          first-call goal, adjusted for stage (discovery / demo /
          late-stage).
        - **Attendees** — name, title, 1-line profile + their likely
          motivation at this meeting.
        - **Context recap** — 2-3 bullets from the account brief +
          any prior call analysis.
        - **Question bank** — 5-8 questions drawn from the playbook's
          qualification framework. Prioritize the pillar weakest on
          the current deal state (if we have prior call analyses,
          reference them).
        - **Likely objections** — top 2 from the playbook's objection
          handbook + the current best reframe per.
        - **Exit criteria** — what has to be true at call-end for
          this deal to advance a stage (from the playbook's deal-
          stages + exit-criteria section).
        - **Landmines to avoid** — anything from `call-insights/*.md`
          flagged as a loss pattern for this segment.
     4. Save to `deals/{slug}/call-prep-{YYYY-MM-DD}.md` (atomic
        `*.tmp` → rename). Create `deals/{slug}/` if missing.
     5. Update `deals.json` row — set `lastCallPrepAt`.
   - `qbr`:
     1. Read the customer row in `customers.json` and any prior QBR
        (`customers/{slug}/qbr-*.md`) to make this an update, not a
        rewrite.
     2. Pull usage trend via PostHog / Mixpanel / Amplitude (if
        connected). Pull billing state via Stripe. Pull open
        support tickets if a ticket tool is connected.
     3. Compile the QBR pack:
        - **Outcomes shipped** — against the success metric locked
          at kickoff (from `customers/{slug}/onboarding-plan.md` if
          it exists). Show the numbers.
        - **Usage trend** — quarter-over-quarter. Cite the metric
          source.
        - **Open asks** — their open feature requests + support
          escalations.
        - **Risks** — any yellow/red drivers from the latest `score
          subject=customer-health` run.
        - **Next-quarter goal** — one concrete outcome, tied to the
          product roadmap if visible.
        - **Renewal runway** — days to renewal + pricing stance
          reminder (from the playbook).
     4. Save to `customers/{slug}/qbr-{YYYY-QN}.md`.
     5. Update `customers.json` row — set `lastQbrAt`.

3. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "call-prep" (for call) | "qbr-prep" (for
   qbr), title, summary: "<meeting goal | top risk + top outcome>",
   path, status: "ready", createdAt, updatedAt, domain:
   "<meetings | retention>" }`.

4. **Summarize to user.** The meeting goal (or top outcome for qbr)
   + the top 3 questions (or top risk for qbr) inline. Path to full
   prep.

## What I never do

- Invent attendees, usage numbers, or prior-call facts. Every row
  cites a source.
- Ship a generic discovery-call template — every question bank is
  prioritized against the deal's current qualification state.
- Write the QBR as a dashboard — it's a narrative with 3 risks and
  3 wins, not a graph.

## Outputs

- `call` → `deals/{slug}/call-prep-{YYYY-MM-DD}.md`; updates
  `deals.json`.
- `qbr` → `customers/{slug}/qbr-{YYYY-QN}.md`; updates
  `customers.json`.
- Appends to `outputs.json`.
