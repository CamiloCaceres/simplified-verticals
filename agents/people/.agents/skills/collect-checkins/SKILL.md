---
name: collect-checkins
description: "Use when you say 'collect this week's check-ins' / '1:1 status across the team' / 'who's been quiet' — pulls the roster from your connected HRIS, sends the check-in prompt to each member via your connected Slack channel, collects responses, and writes a dated report at `checkins/{YYYY-MM-DD}.md` with themes plus who's quiet plus flagged responses."
integrations:
  messaging: [slack, discord]
---

# Collect Check-ins

## When to use

- Explicit: "collect this week's check-ins", "1:1 status across the
  team", "who's been quiet", "run the weekly check-in".
- Implicit: called by the analyze skill with subject=people-health to pull
  fresh check-in state before the Monday readout.
- Frequency: typically matches `config/context-ledger.json` (check-in rhythm) cadence
  (weekly / biweekly / monthly). Safe to run ad-hoc.

## Steps

1. **Read people-context doc:**
   `context/people-context.md`. If missing or empty, tell
   the user: "I need the people-context doc first — run the define-people-context skill." Stop.
2. **Read config:** `config/context-ledger.json`. If either is missing, ask ONE
   targeted question naming the best modality ("Is your HRIS
   connected — I can pull the roster directly — or should I take a
   pasted list?"). Write to config and continue.
3. **Resolve the roster.** If `source: "connected-hris"`, run
   `composio search hris` to discover the tool slug and execute the
   roster-fetch action. If pasted, use `members[]` from
   `config/context-ledger.json` (roster).
4. **Resolve the check-in prompt.** Use `defaultPrompt` from
   `config/context-ledger.json` (check-in rhythm) if set; otherwise read the
   check-in-prompt section of `context/people-context.md`; otherwise fall
   back to a neutral default ("1. Wins this week. 2. Blockers or
   frustrations. 3. Anything you want me to know.").
5. **Send the prompt.** Run `composio search chat` to discover the
   chat tool slug and send the prompt per the configured channel
   (channel post, DM-per-person, or email). If no chat connection
   exists, tell you which category to link from the Integrations
   tab and stop.
6. **Collect responses** over the configured window. Read replies
   from the same channel / thread / DM. If responses are not
   retrievable programmatically, ask you to paste the thread
   export.
7. **Summarize.** Per team member: responded / not-responded, and
   pull out themes into three buckets — wins · blockers · concerns.
   Flag members with 2+ consecutive missed cycles as "quiet".
   Flag any response whose wording triggers the escalation-rules
   section of `context/people-context.md` (e.g. harassment, discrimination,
   wage dispute) — these escalate to the founder, never summarized in
   public view.
8. **Write** to `checkins/{YYYY-MM-DD}.md` atomically
   (`*.tmp` → rename). Structure: Response rate → Quiet members →
   Themes (wins · blockers · concerns) → Escalation-flagged responses
   (founder-eyes-only note, not the response body) → Recommended
   next actions.
9. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "checkin", title, summary, path, status: "ready",
   createdAt, updatedAt }`, write atomically.
10. **Summarize to user** — one paragraph with response rate,
    quiet-member count, top themes, and the path to the full report.
    If any response was escalation-flagged, say so and recommend the
    founder review directly — do not summarize the content.

## Never invent

Never fabricate a check-in response or theme. If a member didn't
respond, mark them "quiet" — do not imagine what they would have
said. If responses are sparse, surface that honestly.

## Outputs

- `checkins/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with type `checkin`.
