---
name: manage-crm
description: "Use when you say 'sweep CRM hygiene' / 'what's my pipeline by stage' / 'route new inbounds' / 'queue a task for {deal}' — I run the `action` you pick on your connected CRM (HubSpot / Salesforce / Attio / Pipedrive / Close): `clean` (detect dupes + missing fields + stage mismatches · diff list awaits per-row approval) · `query` (natural-language → read-only answer + the query I ran) · `route` (GREEN → assign, YELLOW → nurture, RED → drop) · `queue-followup` (push a task into Linear / Notion / Asana-style). Writes to `crm-reports/{action}-{date}.md`."
integrations: [hubspot, salesforce, attio, pipedrive, close, linear, notion]
---

# Manage CRM

One skill for four CRM actions. The `action` parameter picks the
operation; "read-first, mutate-only-with-approval" discipline is
shared.

## Parameter: `action`

- `clean` — hygiene sweep: dupes, missing required fields, stage
  mismatches (e.g. deal in Stage 3 with no champion captured). Writes
  a diff list. Mutates only on explicit user approval per row.
- `query` — natural-language question → read-only CRM query → answer
  + the query it ran. "How many deals are in Stage 2?" / "Show me
  deals closing this month." / "Who owns Acme?"
- `route` — read the latest lead scores, apply the playbook's routing
  policy (default: GREEN → assign to owner, YELLOW → nurture queue,
  RED → drop). Writes routing decisions; mutates CRM owner fields
  only on approval.
- `queue-followup` — push a task into your connected task tool
  (Linear / Notion / Asana-style). Task content: who, what, when,
  linked deal / lead.

If the user's ask implies the action ("clean up the CRM", "what's
my pipeline", "route leads", "queue a followup"), infer. Otherwise
ask ONE question naming the 4 options.

## When to use

- Explicit triggers listed in the description.
- Implicit: after `score subject=lead` completes, chain into
  `action=route`. After `analyze subject=discovery-call` or
  `draft-outreach stage=followup`, chain into `action=queue-followup`
  for the next step.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `domains.crm.slug` — required for all actions. Ask ONE question if
  missing: "Which CRM — HubSpot, Salesforce, Attio, Pipedrive, Close?
  Open Integrations to connect."
- `domains.crm.dealStages` + `ownerMap` — `clean` + `route` use them.
- `domains.crm.leadRouting` — defines the routing policy (default
  "green-ae-yellow-sdr-red-drop").
- `playbook` — from `context/sales-context.md`. Required for `clean`
  (stage-exit-criteria drives stage-mismatch detection) and `route`
  (ICP grounds the RED drop).

## Steps

1. **Read ledger + playbook.** Gather missing required fields (ONE
   question each, best-modality first). Write atomically.

2. **Discover the CRM slug via Composio.** `composio search crm` →
   pick the connected one. If none, name the category to link and
   stop.

3. **Branch on action.**
   - `clean`:
     1. Pull the full contact + deal list via CRM read tools.
     2. Detect issues:
        - **Dupes** — contacts with matching email domain + last name
          + first-name fuzzy; deals with same account + overlapping
          amount.
        - **Missing required fields** — per the playbook's
          qualification framework (e.g. Stage-3 deal with no
          champion captured).
        - **Stage mismatches** — deal in Stage N but exit criteria
          for Stage N-1 not met; stale deals (no activity >30 days
          in active stages).
     3. Write the diff list to `crm-reports/clean-{YYYY-MM-DD}.md` —
        one section per issue type, each row with a **recommended
        mutation** and the command to approve (per row, not
        blanket). Nothing is mutated yet.
     4. Present the top 10 issues inline + the path. Wait for
        explicit approval per row before executing mutations via
        `composio <crm> <action>`.
   - `query`:
     1. Parse the user's question into a structured query
        (entity + filters + grouping).
     2. Run the query read-only via the connected CRM.
     3. Return the answer + the query it ran (so the user can
        adjust). Save to `crm-reports/query-{YYYY-MM-DD}.md` with
        the question, the query, the answer table. Don't mutate.
   - `route`:
     1. Read the latest `scores/lead-*.md` (or run `score
        subject=lead` first if stale) and
        `leads.json`.
     2. Apply the routing policy:
        - **GREEN** → assign to the default owner from
          `ownerMap` (or ask once if missing).
        - **YELLOW** → nurture queue (surface for `draft-outreach
          stage=cold-email` later).
        - **RED** → drop (with the disqualifier cited).
     3. Write the routing decisions to
        `crm-reports/route-{YYYY-MM-DD}.md`. Present the top 10
        inline + the counts per bucket. Wait for approval before
        mutating CRM owner fields.
   - `queue-followup`:
     1. Parse the ask: who, what action, when. Pull the deal / lead
        reference if named.
     2. Discover the task tool via `composio search task`. If none,
        ask once which one to use.
     3. Push the task via the tool's create-task slug. Capture the
        task URL.
     4. Log to `tasks/{YYYY-MM-DD}.md` (append — this is a running
        log, not a per-task file).

4. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "crm-sweep" (clean) | "crm-query"
   (query) | "routing-decision" (route) | "task-queued"
   (queue-followup), title, summary, path, status: "ready" (or
   "draft" for clean / route until mutations approved), createdAt,
   updatedAt, domain: "crm" }`.

5. **Summarize to user.** The top finding + the next required
   approval (for clean / route) or confirmation (for query /
   queue-followup). Never mutate without explicit per-row approval.

## What I never do

- Mutate CRM records (stage change, owner reassign, contact delete)
  without explicit per-row approval.
- Invent a CRM field or a deal — every row cites the real record ID
  pulled from the connected CRM.
- Query anything outside the read-only scope the user authorized.
- Push a task to an unconnected tool — always discover via
  Composio.

## Outputs

- `clean` → `crm-reports/clean-{YYYY-MM-DD}.md`
- `query` → `crm-reports/query-{YYYY-MM-DD}.md`
- `route` → `crm-reports/route-{YYYY-MM-DD}.md`
- `queue-followup` → append to `tasks/{YYYY-MM-DD}.md`
- Appends to `outputs.json`.
