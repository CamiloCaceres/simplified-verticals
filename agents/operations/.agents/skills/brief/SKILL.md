---
name: brief
description: "Use when you say 'morning brief' / 'what needs me today' / 'prep me for my 2pm' / 'post-meeting notes' — I produce the brief you asked for: `daily` rolls up inbox + calendar + chat + drive into today's plan · `meeting-pre` gives you a deep attendee pre-read with agenda + what they'll likely want · `meeting-post` turns a transcript into decisions + owners + follow-ups. Writes to `briefs/` or `meetings/`."
integrations:
  inbox: [gmail]
  calendar: [googlecalendar]
  messaging: [slack]
  files: [googledrive]
  meetings: [fireflies, gong]
---

# Brief

One primitive for the daily-rhythm briefs that anchor your week. You pick the `mode`; I do the aggregation, prioritization, and writing.

## When to use

- `mode=daily` — "morning brief" / "what needs me today" / "here's my brain dump" / "today's rundown".
- `mode=meeting-pre` — "prep me for my 2pm" / "deep brief for my meeting with {X}" / "build me a pre-read".
- `mode=meeting-post` — "post-meeting notes from my last recording" / "summarize the call I just had with {X}".

## Ledger fields I read

- `universal.company` — for context-matching priorities and key contacts.
- `universal.positioning` — confirms `context/operations-context.md` exists; if not I stop and ask you to run `define-operating-context` first.
- `domains.rhythm.timezone` — so the brief respects your working hours.
- `domains.rhythm.briefDeliveryTime` — so auto-trigger knows when "morning" is.
- `domains.people.vips` — who counts as VIP for meeting prep.

If any required field is missing, I ask ONE targeted question with a modality hint (connected app > file > URL > paste), write the answer atomically to `config/context-ledger.json`, and continue.

## Parameter: `mode`

- `daily` — aggregate the last 24h across inbox (Gmail / Outlook), calendar (Google Calendar / Outlook), team chat (Slack), and recent drive activity (Google Drive) into today's plan. Writes `briefs/{YYYY-MM-DD}.md`.
- `meeting-pre` — deep attendee intel for ONE upcoming meeting: bio, role, prior email threads, recent public activity, shared history, suggested agenda, and what they'll likely want. Writes `meetings/{YYYY-MM-DD}-{slug}-pre.md`.
- `meeting-post` — transcript (Fireflies / Gong) → decisions + owners + follow-ups + verbatim quotes worth keeping. Writes `meetings/{YYYY-MM-DD}-{slug}-post.md`.

## Steps

1. Read `config/context-ledger.json`. For any missing required field for the chosen mode, ask ONE targeted question with a modality hint and write the answer.

2. Read `context/operations-context.md`. If missing or empty, stop and tell me to run `define-operating-context` first — I never invent priorities, VIPs, or hard nos.

3. Branch on `mode`:

   **If `mode = daily`:**
   - Detect brain-dump sub-mode: if you pasted >100 words of task-flavored content, parse the dump as the primary input; otherwise run the default aggregate.
   - Pull last-24h data via Composio: inbox (`composio search inbox` / `gmail`), calendar (`googlecalendar`), team chat (`slack`), drive edits (`googledrive`). If a category isn't connected, skip that section and name it explicitly.
   - Produce the brief: Fires (≤3, verb + object), Today's meetings (with 1-line prep), What changed overnight, Can wait (with default deferral), The one move.
   - For brain-dump sub-mode, bucket into: urgent-fires / strategic / operational / future-ideas / personal; calendar reality check; 2-3 strategic picks grounded in the active priorities from the operating context; delegation candidates.

   **If `mode = meeting-pre`:**
   - Resolve the target meeting (pulled by ID, or best-match from calendar if you said "my 2pm").
   - For each external attendee, pull: recent email threads with them (inbox search), public activity (web search / LinkedIn via Composio), shared history (past meetings + emails).
   - Draft a suggested agenda that reflects what they'll likely want based on the thread history and my `context/operations-context.md` priorities.
   - Call out the ONE thing not to forget.

   **If `mode = meeting-post`:**
   - Pull the transcript from your connected meeting recorder (Fireflies / Gong). If not connected, accept pasted transcript.
   - Extract decisions made, owners + dates for every follow-up, open questions, and 2-4 verbatim quotes worth keeping.
   - Flag anything that deserves a `log-decision` run (I do not run it inline — I surface the candidate).

4. Write atomically (`.tmp` then rename). If a brief already exists for today, append `-v2`, `-v3` (re-briefs happen).

5. Append to `outputs.json` with `{id, type, title, summary, path, status, createdAt, updatedAt, domain: "planning" or "people"}`. Type is `"brief"` for `daily`, `"meeting-prep"` for `meeting-pre`, `"meeting-notes"` for `meeting-post`.

6. Summarize to you in chat: the "one move" line (daily), or the top-3 agenda items + the thing not to forget (meeting-pre), or the decisions + outstanding owners (meeting-post).

## Outputs

- `briefs/{YYYY-MM-DD}.md` (or `briefs/{YYYY-MM-DD}-dump.md` for brain-dump sub-mode).
- `meetings/{YYYY-MM-DD}-{slug}-pre.md` or `meetings/{YYYY-MM-DD}-{slug}-post.md`.
- Appends to `outputs.json`.

## What I never do

- Send any outbound message during a brief — if it flags a reply-needed thread, drafting is `draft-message type=reply`.
- Invent an attendee's role, history, or preference — thin research → mark TBD.
- Touch inbox state (no archive, no label, no mark-as-read) — read-only.
