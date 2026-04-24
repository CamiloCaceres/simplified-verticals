---
name: compliance-calendar
description: "Use when you say 'build the compliance calendar' / 'what's coming up in HR compliance' / 'what I-9 / W-4 / visa renewals are due' — scans your connected HRIS plus the review-cycle rhythm and visa statuses, produces a living calendar at `compliance-calendar.md`, and logs each substantive update to `outputs.json`."
integrations: [notion, googlesheets]
---

# Compliance Calendar

## When to use

- Explicit: "build the compliance calendar", "what's coming up in
  HR compliance", "what I-9 / W-4 / visa renewals are due", "refresh
  the compliance calendar".
- Implicit: routed monthly, or when a new hire completes onboarding
  (new I-9 deadline), or when a visa date is recorded.
- Frequency: on-demand, plus monthly refresh.

## Steps

1. **Read people-context doc.** Read
   `context/people-context.md` for the review-cycle
   rhythm (annual / semi-annual / quarterly, next cycle date) and
   any policy-refresh cadence. If missing or empty, tell you:
   "I need the people-context doc first — run the
   define-people-context skill." Stop.
2. **Read the ledger.** `config/context-ledger.json` (HRIS is
   read-only — never modify records). If the HRIS isn't connected,
   ask ONE targeted question with a modality hint ("Connect your
   HRIS — Gusto, Deel, Rippling, or Justworks — in the Integrations
   tab so I can pull start dates, work-authorization status, and
   vesting schedules").
3. **Discover tools via Composio.** Run `composio search hris` for
   the read-only profile slug and `composio search calendar` for
   the calendar tool used to push reminders if the user wants them.
4. **Scan employee records (read-only).** For each employee, pull:
   - Start date (I-9 3-day rule reference).
   - W-4 last-refreshed date.
   - Work-authorization / visa expiration (if applicable).
   - Equity vesting start + cliff date + acceleration terms (if
     applicable).
   - Review-cycle anchor date relative to the rhythm in
     people-context.
5. **Produce calendar entries for each category:**
   - **I-9 deadlines** — 3-day rule. Flag anyone still in the
     3-day window.
   - **W-4 refresh timing** — annual refresh anchors.
   - **Visa expirations** — 90 / 60 / 30 day warnings per employee.
   - **State registration requirements** — per-state obligations
     triggered by new-state hires.
   - **Review-cycle dates** — derived from the rhythm in
     people-context.
   - **Equity vesting cliffs** — notify 30 days pre-cliff.
   - **PTO policy refresh dates** — annual / fiscal refresh.
6. **Update the living doc.** Write the full refreshed calendar
   atomically to `compliance-calendar.md` at the agent root
   (NOT in a subfolder) — write `compliance-calendar.md.tmp`, then
   rename over the existing file. Structure: one section per
   category above, entries sorted by date ascending, each entry
   carrying `{ employee-slug (if applicable), due-date, days-out,
   action }`. Include a top-of-file "Refreshed: {timestamp}" line.
7. **Append to `outputs.json`** — read existing array, add a new
   entry for this refresh: `{ id, type: "compliance", title:
   "Compliance calendar refresh {YYYY-MM-DD}", summary, path:
   "compliance-calendar.md", status: "ready", createdAt,
   updatedAt }`. Each substantive refresh is a NEW outputs.json
   entry — the file at the agent root is overwritten, but the
   outputs log is append-only so the dashboard shows a history.
   Write atomically.
8. **Summarize to user** — one paragraph: count of entries in each
   category, the nearest-term action, and the path to
   `compliance-calendar.md`. Offer to push date reminders to the
   connected calendar tool.

## Never invent

Every entry ties back to a real HRIS record or a real people-context
anchor. If a field is missing, mark TBD — don't guess a date.

## Never mutate

HRIS / payroll records are read-only from this agent's side. This
skill reads, scans, and produces a markdown calendar — never writes
back to the HRIS.

## Outputs

- `compliance-calendar.md` at the agent root (living doc, updated
  atomically in place).
- Appends to `outputs.json` with type `compliance` per refresh —
  so the dashboard shows a history of refreshes even though the
  calendar file is overwritten.
