---
name: find-leads
description: "Use when you say 'find me leads in {segment}' / 'give me 20 in {segment}' / 'surface leads I can reach out to this week' — I surface net-new leads from your connected sources or public intent signals (CRM lookalikes, LinkedIn threads, recent-funding feeds, Google Maps for local biz, Reddit / community posts), quick-score against the playbook's disqualifiers, and save GREEN / YELLOW leads with the trigger signal cited. Writes to `leads/batches/{segment-slug}-{YYYY-MM-DD}.md` and `leads.json`."
integrations: [hubspot, salesforce, attio, linkedin, exa, firecrawl]
---

# Find Leads

Surface net-new leads in a segment.

## When to use

- "find me {N} leads in {segment}".
- "surface leads I can reach out to this week".
- "compile leads from {LinkedIn post / subreddit / event}".
- Scheduled: weekly prospecting routine.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `playbook` — from `context/sales-context.md`. Required for ICP
  + disqualifiers. If missing: "want me to draft your playbook
  first? (`define-playbook`, ~5m)" and stop.
- `universal.icp` — industry, roles, pains, triggers,
  disqualifiers. Used to quick-score candidates.
- `domains.outbound.sources` — if missing, ask ONE question naming
  the best modality ("Which source — your connected CRM for
  lookalikes of closed-won, a LinkedIn post URL, a recent-funding
  feed, Google Maps, or a subreddit?").

## Steps

1. **Read the ledger + playbook.** Gather missing required fields
   (ONE question each, best-modality first). Write atomically.

2. **Pick a source.** Based on the segment + the user's intent, ask
   which source (unless they named one):
   - **Connected CRM** — expand from lookalike of closed-won.
   - **LinkedIn comment thread** — paste a post URL; compile
     commenters.
   - **Search engine / funding feed** — recent-funding or
     recent-hire signals in the segment.
   - **Google Maps** — for local-biz segments.
   - **Subreddit / community** — recent high-engagement posts.

3. **Pull candidates.** Via `composio search <category>` per picked
   source. Cap at ~3× the requested count to allow filtering.

4. **Per-candidate quick-score** — apply the playbook's hard
   disqualifiers. Drop RED. For each surviving candidate, capture:
   - Company + LinkedIn / website URL.
   - Primary contact name + title + LinkedIn (if available).
   - The trigger signal that surfaced them (hiring post, Series B,
     commented on X thread, 4.8-star review — cite specifically).
   - Quick fit: GREEN / YELLOW (don't score RED — we dropped them).

5. **Write the batch file** to `leads/batches/{segment-slug}-{YYYY-
   MM-DD}.md` (atomic `*.tmp` → rename) — query, source, date, lead
   list with trigger signals cited.

6. **Append to `leads.json`.** For each surviving candidate, append
   a new row with `status: "new"`, `source` (the slug of this
   search), `fitScore` (GREEN/YELLOW). Don't duplicate — check
   existing rows by company + name. Read-merge-write atomic.

7. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "lead-batch",
     "title": "Leads — {segment}",
     "summary": "<N leads surfaced from {source}. Top signal: {signal}.>",
     "path": "leads/batches/{segment-slug}-{date}.md",
     "status": "ready",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>",
     "domain": "outbound"
   }
   ```

8. **Summarize to user.** The top 3 leads inline + the full file
   path. Suggest: "`research-account depth=enrich-contact` on #1
   next?" or "`score subject=icp-fit` in bulk across these?".

## What I never do

- Invent leads, names, titles, or trigger signals. Every lead ties
  to a real tool response or URL observation.
- Contact anyone or push leads into your CRM without your approval.
- Hardcode tool names — Composio discovery at runtime only.

## Outputs

- `leads/batches/{segment-slug}-{YYYY-MM-DD}.md`
- Appends to `leads.json` (new rows only).
- Appends to `outputs.json` with `type: "lead-batch"`,
  `domain: "outbound"`.
