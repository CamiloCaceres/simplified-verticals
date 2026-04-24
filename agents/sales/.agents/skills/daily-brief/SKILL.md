---
name: daily-brief
description: "Use when you say 'brief me for today' / 'what's on today' / 'morning brief' — I produce today's calendar (from your connected Google Calendar), approvals queue (drafts in `outputs.json` awaiting your sign-off), and the top 3 moves for the day. Writes to `briefs/{YYYY-MM-DD}.md`."
---

# Daily Brief

A one-screen morning brief. The founder reads it with coffee and
knows exactly where to start.

Derived from Gumloop templates #25 (Personal Assistant) and #29 (Brief
me for my upcoming day on Google Calendar), generalized to any
connected calendar.

## When to use

- "brief me for today" / "brief me for the day" / "morning brief".
- "what's on today".
- Scheduled: morning routine (user-configured in the Routines tab).

## Steps

1. **Read the playbook.** Load `context/sales-context.md`. If missing, warn
   the user but continue — the brief is still useful without it.

2. **Pull today's calendar.** `composio search calendar` → list events
   for today. For each event, capture: time, title, attendees,
   description. Flag any with "discovery" / "demo" / "QBR" / "renewal"
   in the title as needing AE or CSM prep. If there's an existing AE
   `call-prep.md` for that meeting, link to it.

3. **Build the approvals queue.** Read each other agent's
   `outputs.json` and filter `status: "draft"` created in the last
   48 hours. Group by agent, show title + path.

4. **Identify top-3 moves.** Read yesterday's activity across agents:
   - Any replies classified `INTERESTED` awaiting SDR draft approval?
   - Any deals that moved stage yesterday and need an AE follow-up?
   - Any customer health flipped to YELLOW/RED overnight?
   - Any leads that hit the stall threshold overnight?

   Pick the 3 highest-leverage. Each gets a one-line description and
   a copyable prompt to the right agent.

5. **Format the brief (one screen, 5 sections max):**

   1. **Today's meetings** — time · title · prep status.
   2. **Approvals queue** — N drafts awaiting sign-off, grouped by agent.
   3. **Top-3 moves** — each a copyable one-liner.
   4. **Watch list** — stalled deals, red customers, high-value leads
      past stall threshold.
   5. **Yesterday in numbers** — leads added, calls held, deals
      progressed.

6. **Write atomically.** Write to `briefs/{YYYY-MM-DD}.md.tmp`, then
   rename. Overwrite any prior same-day brief (one brief per day).

7. **Append to `outputs.json`** (or update the existing same-day
   entry):

   ```json
   {
     "id": "<uuid v4>",
     "type": "brief",
     "title": "Daily brief — {YYYY-MM-DD}",
     "summary": "<one-line summary of the 3 moves>",
     "path": "briefs/{YYYY-MM-DD}.md",
     "status": "ready",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

8. **Summarize to user.** The 3 moves inline in chat + the path. If
   any meeting needs prep and doesn't have an AE artifact, suggest
   running `@ae prepare-call` now.

## Outputs

- `briefs/{YYYY-MM-DD}.md`
- Appends (or updates) `outputs.json` with `type: "brief"`.
