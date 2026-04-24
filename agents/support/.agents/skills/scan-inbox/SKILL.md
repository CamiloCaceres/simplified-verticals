---
name: scan-inbox
description: "Use when you say 'morning brief' / 'what's on my plate' / 'what's breaching SLA' / 'what's stale?' — I produce the `scope` you pick: `morning-brief` (ranked 'start here' digest) · `sla-breach` (threads within 2h of breach or already past) · `stale-threads` (quiet >48h with you as last responder). Writes to `briefings/` · `sla-reports/` · `stale-rescues/`. A 2-minute scan, not a dashboard dump."
integrations: [gmail, outlook, intercom, help_scout, zendesk]
---

# Scan Inbox

One skill for every "what do I need to look at right now?" ask.
Branches on `scope`.

## When to use

- **morning-brief** — "morning brief" / "what's on my plate?" /
  "where do I start?"
- **sla-breach** — "what's breaching SLA?" / "what's overdue?" /
  called automatically inside `morning-brief`.
- **stale-threads** — "what's waiting on me?" / "anything stale?"
  — threads > 48h mid-resolution where the ball is in your court.

## Ledger fields I read

- `universal.positioning` — to read SLA tiers + VIP list from
  `context/support-context.md`.
- `domains.inbox.channels` — to know which inboxes to scan.
- `domains.inbox.slaTargets.firstResponseHours` /
  `resolutionHours` — the thresholds; default to
  `context/support-context.md#sla` if ledger entry missing.

If any required field is missing, ask ONE targeted question with a
modality hint, write it, and continue.

## Parameter: `scope`

- `morning-brief` — top 5–10 items ranked by (VIP × SLA-at-risk ×
  unblocking-engineering). Each item: 1-line headline + next
  action. Writes to `briefings/{YYYY-MM-DD}.md`.
- `sla-breach` — open conversations within 2 hours of breach OR
  already breached, with customer tier, time remaining, and the
  exact next action. Writes to `sla-reports/{YYYY-MM-DD}.md`.
- `stale-threads` — conversations quiet > 48h with me as last
  responder, grouped by "customer replied and I missed it" vs "I
  owe them something." Writes to
  `stale-rescues/{YYYY-MM-DD}.md`.

## Steps

1. **Read `context/support-context.md`.** If missing, stop and
   tell me to run `define-support-context` first.
2. **Read the ledger.** Fill gaps.
3. **Read `conversations.json`** for all open / waiting items.
4. **Branch on `scope`:**
   - `morning-brief`: compute a rank per thread = tier_weight ×
     sla_risk × content_urgency. Cap at 10 items. For each, add a
     one-line next action ("draft the reply," "escalate to
     engineering," "close — nothing to do"). Include a one-line
     summary of `followups.json` due today.
   - `sla-breach`: filter `conversations.json` to open items whose
     `firstResponseAt` or `lastActivityAt` plus the SLA window is
     < 2h from now. For each, list: customer, tier, time left,
     next action.
   - `stale-threads`: filter to conversations quiet > 48h. Group
     by "their turn" vs "my turn" — only the "my turn" group is
     actionable. For each, suggest: nudge draft (chain
     `draft-reply`) or close with one-line explanation.
5. **Write the artifact** atomically. Append to `outputs.json` with
   `type` = `morning-brief` | `sla-report` | `stale-rescue`,
   `domain: "inbox"`.
6. **Summarize to me**: the 2–3 things that actually need me today.

## Outputs

- `briefings/{YYYY-MM-DD}.md` (for `scope = morning-brief`)
- `sla-reports/{YYYY-MM-DD}.md` (for `scope = sla-breach`)
- `stale-rescues/{YYYY-MM-DD}.md` (for `scope = stale-threads`)
- Appends to `outputs.json` with `domain: "inbox"`.

## What I never do

- Overrank items to make the brief look busy — if it's a quiet day,
  say so in one line.
- Use hardcoded SLA thresholds — always read from
  `context/support-context.md#sla` or the ledger.
