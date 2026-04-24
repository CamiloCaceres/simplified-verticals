---
name: coordinate-interviews
description: "Use when you say 'schedule {candidate}'s loop' / 'coordinate the panel for {candidate}' / 'set up interviews' — proposes a schedule via your connected calendar (Google Calendar or Outlook), runs the prep-interviewer skill per panelist, and appends schedule plus briefs to `interview-loops/{candidate-slug}.md`. You approve and send."
integrations:
  calendar: [googlecalendar]
  inbox: [outlook]
---

# Coordinate Interviews

## When to use

- Explicit: "schedule {candidate}'s loop", "coordinate the panel for
  {candidate}", "set up interviews for {candidate}", "book the loop".
- Prerequisite: a candidate record exists and has passed screening.
- Single invocation per candidate loop.

## Steps

1. **Read people-context doc** at
   `context/people-context.md`. If missing or empty, tell
   the user: "I need your people context first — run the define-people-context skill." Stop.
2. **Read the candidate record** at
   `candidates/{candidate-slug}.md`. If missing, tell you to
   run `screen-resume` or `score-candidate` first and stop.
3. **Ask for the panel + window** if not already provided — ONE
   question: "Who's on the panel (emails or names) and what's the
   target window (e.g. 'next Tue-Thu afternoons')? Also — expected
   duration per interview (30 / 45 / 60 min)?"
4. **Discover the calendar tool via Composio.** Run `composio search
   calendar` to find the calendar slug (Google Calendar / Outlook).
   If no calendar is connected, tell you which category to link
   from Integrations and stop.
5. **Check free/busy.** Execute the tool slug to pull free/busy for
   every panelist + the candidate (if their availability was
   shared). Identify non-conflicting slots in the target window that
   fit the duration. Surface conflicts explicitly.
6. **Propose the schedule.** Lay out the loop as a block of
   back-to-back or spaced interviews, one per panelist, each with
   proposed start / end / timezone. If the candidate needs breaks
   between interviews, add them.
7. **Draft invites (never send).** For each slot, draft the invite
   text: title, attendees, duration, location / video link
   placeholder, description (1-2 sentences tying to the role and
   this panelist's focus). Save the drafts inline — do not execute
   any `send` / `create_event` mutation without the founder's
   explicit confirmation.
8. **Run `prep-interviewer` per panelist.** Call it once per
   interviewer so every panelist's brief is appended to
   `interview-loops/{candidate-slug}.md`.
9. **Write the schedule block.** Append a dated
   `## Loop scheduled — {YYYY-MM-DD}` section to
   `interview-loops/{candidate-slug}.md` with the proposed schedule
   table, draft invites, and any conflicts flagged. Atomic write
   (`*.tmp` → rename).
10. **Append to `outputs.json`** — `{ id, type: "loop-scheduled",
    title, summary, path: "interview-loops/{candidate-slug}.md",
    status: "draft", createdAt, updatedAt }`, write atomically.
11. **Summarize to user** — one paragraph: proposed schedule,
    conflicts flagged, reminder that invites are drafts, path to the
    loop file. End with: "Reply `send invites` after reviewing and
    I'll execute the calendar mutation."

## Never invent

- Never send a calendar invite without the founder's explicit
  approval. Drafts only.
- Never invent panelist availability — if free/busy is not readable
  (private calendar, no connection), surface that and ask the user
  to confirm availability manually.
- Never infer timezone; ask if unclear.

## Outputs

- `interview-loops/{candidate-slug}.md` — schedule + invites
  appended. Per-interviewer briefs appended via `prep-interviewer`.
- Appends to `outputs.json` with type `loop-scheduled`.
