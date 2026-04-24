---
name: analyze
description: "Use when you say 'Monday sales review' / 'mine my last calls' / 'run win-loss' / 'how's the pipeline' / 'how did that demo go' — I analyze the `subject` you pick: `sales-health` (weekly roll-up across all domains) · `call-insights` (cross-call synthesis with playbook-edit suggestions via Gong / Fireflies) · `win-loss` (cluster closed deals, propose edits) · `discovery-call` (talk-ratio + qual gaps + drafted followup) · `pipeline` (by-stage snapshot + leakiest transition). Writes to `analyses/{subject}-{YYYY-MM-DD}.md`."
integrations: [hubspot, salesforce, attio, gong, fireflies]
---

# Analyze

One skill for five analysis surfaces. The `subject` parameter picks
the scope; "next moves over dashboards" discipline is shared.

## Parameter: `subject`

- `sales-health` — the Monday readout. Aggregate every skill's output
  across last week from `outputs.json`. Group by domain (Playbook,
  Outbound, Inbound, Meetings, CRM, Retention). Flag stalled work +
  missed followups + slippage.
- `call-insights` — cross-N-call synthesis: pain language, objection
  frequency, win/loss patterns — with concrete playbook-edit
  suggestions.
- `win-loss` — cluster closed-won and closed-lost deals by reason.
  Find the 3 patterns that repeat. Propose playbook edits (ICP
  tightening, objection handbook additions, pricing adjustments).
- `discovery-call` — single-call deep read: talk-ratio (target 40%
  rep / 60% prospect), pain score, qual gaps vs the playbook's
  framework, risks / opportunities, a draft followup.
- `pipeline` — snapshot by stage + ARR + deal velocity + leakiest
  transition. Anchors the weekly forecast.

If the user's ask names the subject in plain English ("sales
review", "mine calls", "win-loss", "how did that call go", "pipeline
check"), infer. Otherwise ask ONE question naming the 5 options.

## When to use

- Explicit triggers listed in the description.
- Implicit: `capture-call-notes` chains into `analyze subject=
  discovery-call` to complete the post-call loop. The weekly routine
  "Monday sales review" fires `subject=sales-health`. `run-forecast`
  chains into `subject=pipeline` for the narrative layer.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `playbook` — from `context/sales-context.md`. Required for all
  subjects (qualification framework, deal stages, objection
  handbook ground every read).
- `domains.meetings.callRecorder` — `discovery-call` + `call-insights`
  need transcripts. If none connected, ask ONE question: "Paste the
  transcript — or connect Gong / Fireflies via Integrations."
- `domains.crm.slug` + `dealStages` — `win-loss` + `pipeline` need
  CRM access.

## Steps

1. **Read ledger + playbook.** Gather missing required fields (ONE
   question each, best-modality first). Write atomically.

2. **Branch on subject.**
   - `sales-health`: read `outputs.json` for the last 7 days (or
     user-specified window). Group by domain. Per domain, surface
     (a) what shipped (titles + paths), (b) what's stale (items
     `status: draft` > 7 days + no `updatedAt` in 3+ weeks), (c) the
     single most useful next move. End with **top 3 moves for the
     week** across domains.
   - `call-insights`: read `calls/*/notes-*.md` + `analysis-*.md`
     from the last N calls (default 10, user can override). Extract:
     top 5 pain phrases (verbatim, frequency-counted), top 5
     objections (frequency-counted + the current best reframe),
     win/loss themes (what landed vs what stalled). End with
     concrete playbook-edit suggestions: "add pain X to ICP",
     "rework objection Y handbook entry", "tighten qualification
     pillar Z". Save to `call-insights/{YYYY-MM-DD}.md`.
   - `win-loss`: pull closed-won + closed-lost deals from CRM (≥5 of
     each recommended; surface warning if fewer). Cluster by
     reason. Find 3 patterns. Propose playbook edits. Save to
     `analyses/win-loss-{YYYY-MM-DD}.md`.
   - `discovery-call`: read the latest `calls/{slug}/notes-*.md` (or
     ask for the call id). Compute talk-ratio from transcript if
     available (speaker labels), else estimate from note density.
     Score each qualification pillar 0-3 vs the playbook's
     framework. Surface risks (unanswered objections, missing
     stakeholder, stalled pillar) and opportunities (expansion
     signal, strong champion, timeline pressure). End with a
     drafted followup (hand off to `draft-outreach stage=followup`
     or draft inline). Save to
     `calls/{slug}/analysis-{YYYY-MM-DD}.md`.
   - `pipeline`: pull open-deal snapshot from CRM. Per stage:
     count, ARR, average time-in-stage, stage-to-next-stage
     conversion. Flag the leakiest transition. Compare against last
     week's snapshot if
     `pipeline-reports/*.md` exists. Save to
     `analyses/pipeline-{YYYY-MM-DD}.md` and mirror the raw table
     into `pipeline-reports/{YYYY-WNN}.md`.

3. **Write atomically.** Each subject writes to the path above with
   `*.tmp` → rename.

4. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "analysis" (or "call-analysis" for
   discovery-call, "pipeline-report" for pipeline),
   title: "{Subject} — {date}", summary: "<top finding + top move>",
   path, status: "ready", createdAt, updatedAt, domain: "<playbook
   (sales-health, win-loss, call-insights) | meetings
   (discovery-call) | crm (pipeline)>" }`.

5. **Summarize to user.** One paragraph: the single most important
   finding + the top next move. Path to the full artifact.

## What I never do

- Invent pipeline numbers, win/loss reasons, or call-insight
  patterns. Every finding ties to a real row or transcript passage.
- Ship a generic readout — every analysis ends with a concrete next
  move tied to an existing skill.
- Roll up across time windows that are too short to be meaningful
  (`win-loss` with <3 of either side; `call-insights` with <5 calls)
  — surface the warning instead.

## Outputs

- `sales-health`, `win-loss`, `pipeline` → `analyses/{subject}-{date}.md`
- `call-insights` → `call-insights/{YYYY-MM-DD}.md`
- `discovery-call` → `calls/{slug}/analysis-{YYYY-MM-DD}.md`
- `pipeline` also mirrors the table to `pipeline-reports/{YYYY-WNN}.md`
- Appends to `outputs.json`.
