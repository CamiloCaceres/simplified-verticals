---
name: triage
description: "Use when you say 'triage my inbox' / 'scan my calendar' / 'find conflicts' / 'what's in my email' — I classify and rank what needs you. Pick `surface`: `inbox` sorts last-24h email into needs-me-today / can-wait / ignore with a specific action per thread · `calendar` scans the next 7 days for overbooks, missing buffers, unprotected VIP slots, and meetings without prep. Writes to `triage/` or `calendar-scans/`."
integrations: [gmail, outlook, googlecalendar]
---

# Triage

Classification + ranking for the two surfaces that eat your week: inbox and calendar. Never drafts replies (that's `draft-message`) and never edits events (that's `schedule-meeting`).

## When to use

- `surface=inbox` — "triage my inbox" / "what's in my email" / "summarize my inbox" / "inbox roundup".
- `surface=calendar` — "scan my calendar" / "find conflicts" / "how's my week" / "rebalance my week".

## Ledger fields I read

- `universal.positioning` — confirms `context/operations-context.md` exists (so I know your priorities + key contacts + hard nos).
- `domains.people.vips` — who gets top-bucket treatment (inbox) and unprotected-slot alerts (calendar).
- `domains.rhythm.focusBlocks` — calendar overlap detection.
- `domains.rhythm.maxMeetingsPerDay` — calendar overload threshold.
- `domains.rhythm.timezone` — to read calendar windows correctly.

If a required field is missing, I ask ONE targeted question with a modality hint (connected app > file > URL > paste), write it to the ledger, and continue.

## Parameter: `surface`

- `inbox` — classify last-24h (or custom window) threads into `needs-me-today` / `can-wait` / `ignore`, rank the top bucket by time-sensitivity, state a verb+object action per thread. Writes `triage/{YYYY-MM-DD}.md`.
- `calendar` — scan the next 7 days for overbooks, missing buffers, focus-block clashes, unprotected VIP slots, and meetings without prep. Writes `calendar-scans/{YYYY-MM-DD}.md` + upserts `calendar-conflicts.json`.

## Steps

1. Read `config/context-ledger.json`. Fill gaps with ONE targeted question.
2. Read `context/operations-context.md`. If missing, stop and ask me to run `define-operating-context` first — I don't invent your priorities.
3. Branch on `surface`:

   **If `surface = inbox`:**
   - Pull threads via connected inbox (Gmail / Outlook via Composio). Default window: last 24 hours. Include sender, subject, first 200 chars of latest message, and whether it's a reply to something I sent.
   - Classify each thread:
     - `needs-me-today` — someone is waiting on me, a decision is due before EOD, or the sender is in Key Contacts.
     - `can-wait` — legitimate but not urgent. Note default deferral ("wait for their follow-up" / "batch Friday" / "hand to `draft-message type=reply`").
     - `ignore` — newsletters, cold outreach, receipts, automated notifications.
   - Rank the `needs-me-today` bucket: irreversible-if-missed > customer-in-distress > investor-pending > everything else.
   - Per thread, write a verb + object action ("reply with pricing page", "forward to Vendor Ops for renewal decision", "decline — not our ICP", "delegate to {contact}"). Never "review."

   **If `surface = calendar`:**
   - Pull next 7 days via connected calendar (`googlecalendar` / `outlook`). Include attendees, descriptions, durations, start/end in your timezone.
   - Flag each conflict class: overbook (2 events same time), no-buffer (back-to-back with <5 min), focus-block clash (meeting inside a declared focus block), unprotected VIP slot (VIP time with no prep event or empty description), unprepped meeting (external attendees + no agenda in description + no prior brief in `meetings/`).
   - Rank by severity (overbook > VIP-unprotected > focus-clash > no-buffer > unprepped).

4. Write atomically (`.tmp` then rename). Second same-day pass becomes `{date}-{HH}.md`.
5. Append to `outputs.json` with `{id, type, title, summary, path, status, createdAt, updatedAt, domain: "people"}`. Type = `"triage"` (inbox) or `"calendar-scan"` (calendar).
6. Summarize to you: the bucket counts + top action (inbox), or the worst conflict + the fix (calendar).

## Outputs

- `triage/{YYYY-MM-DD}.md` (inbox)
- `calendar-scans/{YYYY-MM-DD}.md` + upserts `calendar-conflicts.json` (calendar)
- Appends to `outputs.json`.

## What I never do

- Draft, send, archive, label, star, or mark-as-read anything — read-only. Drafting is `draft-message`.
- Create, move, or cancel calendar events — that's `schedule-meeting`.
- Invent urgency — if a thread's state is unclear, I surface it in `needs-me-today` with a question for you, not a fabricated deadline.
