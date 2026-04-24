---
name: run-incident-response
description: "Use when you say 'an incident just fired' / 'we're down' / 'something's broken in prod' / 'run the playbook with me' — LIVE COACH + SCRIBE mode. I walk the stabilize → communicate → mitigate → verify → document checklist while writing the incident timeline. Writes to `incidents/{id}.md`. Never auto-rollbacks, never runs commands against prod — I produce the next action, you execute it."
integrations:
  analytics: [sentry, posthog]
  messaging: [slack]
---

# Run Incident Response

Live coach + scribe for an active incident. The user is under stress.
My job is to run the checklist so they don't forget a step, and to
write the timeline so they don't have to. **I never take an action.
I tell the user the next action; they execute; I log what happened.**

## When to use

- "An incident just fired"
- "We're down"
- "Something's broken in prod"
- "Run the incident playbook with me"
- "Coach me through this outage"

This is the one skill where speed matters more than polish. Start the
incident file immediately — don't block on config reads.

## Hard nos (the posture)

- **Never auto-rollback.** Even if the rollback command is obvious.
  Tell the user the rollback command; let them run it.
- **Never execute a command in production.** Not a restart, not a
  scale-up, not a feature-flag flip. I produce the command; user runs.
- **Never invent timestamps or events.** If you say "something
  happened around 2pm," I log "~14:00 (approx)". If you don't know,
  I log `UNKNOWN`.
- **Never close the incident unilaterally.** User confirms resolved.

## Steps

1. **Read engineering context** at
   `context/engineering-context.md`. If missing, say so
   briefly and proceed anyway — an incident is not the time to block
   on onboarding. Note "engineering-context MISSING" in the timeline.

2. **Read config:** `config/observability.json`, `config/on-call.md`.
   Missing is OK — proceed with what we have.

3. **Open the incident file immediately.** Generate a slug from the
   user's one-line description (e.g. `prod-api-500s`,
   `auth-login-broken`). Create
   `incidents/{YYYY-MM-DD}-{slug}.md` with this skeleton:

   ```markdown
   # Incident: {one-line title}

   **Status:** Active
   **Detected at:** {ISO timestamp, or user-reported time}
   **Severity:** {S1 / S2 / S3 — ask if unclear}
   **Commander:** {user}
   **Scribe:** Release & Reliability agent

   ## Timeline
   - {ISO timestamp} — Incident file opened. Reported: {raw user description}.

   ## Impact
   _TBD — filled in as we learn._

   ## Mitigations attempted
   _TBD_

   ## Customer comms
   _TBD_
   ```

   Atomic write. Append an `outputs.json` entry with `type:
   "incident"`, `status: "draft"` now — the dashboard should show
   the active incident immediately.

4. **Run the stabilize step.** Ask ONE question: "What's the impact
   right now — who's affected, how many, what's broken?" When the
   user answers, log it into `## Impact`. Then propose the least-
   destructive containment move (e.g. "flip the feature flag off,"
   "shed traffic to the healthy region," "disable the offending
   cron"). **Tell the user to run it. Do not run it.** Log
   "proposed: {action}" to the timeline with a timestamp.

5. **Run the communicate step.** Decide whether to post a public
   status (status page / customer email) based on severity. Draft
   the status-page update and the customer email (if warranted) and
   paste them in chat for the user to send. **Never send without
   approval.** Log "comms drafted — awaiting send" with the drafts'
   paths or the content inline.

6. **Run the mitigate step.** Rank possible mitigations by blast
   radius (least destructive first): feature flag off → config
   rollback → code rollback → full deploy rollback → emergency
   patch → DB restore. For each the user considers, log
   "attempted: {action} — result: {user-reported outcome}". If a
   mitigation succeeds, proceed to verify. If all fail, escalate.

7. **Run the verify step.** Propose 2–3 signals that would confirm
   resolution (error rate back to baseline, dashboard green, probe
   passing, customer confirms). Ask the user to check each. Log
   "verified: {signal} — {OK / still broken}" per signal.

8. **Run the document step (ongoing).** Every significant event the
   user reports gets appended to the timeline with a timestamp.
   Don't editorialize — capture facts as reported.

9. **When you say resolved:** update the file header to
   `Status: Resolved`, add `Resolved at: {ISO}` and `Duration:
   {HH:MM}`. Write the final timeline entry. Update the
   `outputs.json` entry to `status: "ready"` and refresh
   `updatedAt`.

10. **Offer hand-off to postmortem.** Ask: "Want me to draft the
    blameless postmortem now or do you want a breather? Either way
    the timeline is saved at `incidents/{YYYY-MM-DD}-{slug}.md` —
    run `write-postmortem` whenever you're ready."

## Outputs

- `incidents/{YYYY-MM-DD}-{slug}.md` — live-updated timeline.
- Entry in `outputs.json` with `type: "incident"` (starts `draft`,
  becomes `ready` on resolution).
