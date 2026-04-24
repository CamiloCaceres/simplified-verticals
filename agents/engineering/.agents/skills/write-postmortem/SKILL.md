---
name: write-postmortem
description: "Use when you say 'write the postmortem for {incident}' / 'draft a blameless postmortem' / 'write up the {incident} postmortem' — I read the incident timeline + linked logs from Sentry, PostHog, or Datadog and draft a blameless postmortem with Summary, Impact, Timeline, Root cause, Contributing factors, What went well, What went poorly, Action items (each with owner + due date). Writes to `postmortems/{id}.md`."
integrations:
  analytics: [sentry, posthog]
  dev: [linear, jira]
---

# Write Postmortem

Turns a resolved incident into a blameless postmortem the founder can
share with their team, investors, or customers. Grounds every claim
in the incident timeline or linked observability logs — never invents
events.

## When to use

- "Write the postmortem for {incident}"
- "Draft a blameless postmortem"
- "Write up the {incident-slug} postmortem"
- After `run-incident-response` hands off on resolution.

## Principles

- **Blameless language throughout.** No "Alice broke X" — "the change
  to X did not anticipate Y." Focus on systems and decisions, not
  individuals.
- **Evidence or UNKNOWN.** Every timeline entry, every root-cause
  claim, must cite the timeline or a log source. If the agent can't
  see the evidence, mark `UNKNOWN` and ask the user to paste.
- **Action items have owners and due dates.** An action item without
  an owner is decoration.

## Steps

1. **Read engineering context** at
   `context/engineering-context.md`. If missing, tell
   the user to run `define-engineering-context`
   first and stop.

2. **Read config:** `config/observability.json`. If no observability
   is connected, proceed but flag which sections will be thinner.

3. **Locate the incident.** Ask the user for the incident slug or
   read the most recent `incidents/*.md`. If the file isn't
   `Status: Resolved`, ask the user to confirm the incident is
   actually resolved before writing a postmortem.

4. **Pull supporting logs.** Run `composio search observability` to
   find connected providers. For the time window of the incident,
   fetch: error-rate time-series, top error messages, trace samples
   on impacted endpoints, any alerts that fired. If a provider isn't
   connected, mark those sections `logs UNKNOWN` and ask the user to
   paste relevant dashboards or export a snippet.

5. **Draft the postmortem** in this structure:

   ```markdown
   # Postmortem: {incident title}

   **Incident:** {incident-slug}
   **Date:** {YYYY-MM-DD}
   **Duration:** {HH:MM}
   **Severity:** {S1 / S2 / S3}
   **Status:** Resolved
   **Author:** Release & Reliability agent

   ## Summary
   {2-3 sentences describing what happened in plain language.}

   ## Impact
   - Affected: {users / services / regions}
   - Duration: {from first impact to full recovery}
   - Magnitude: {error rate, revenue at risk, support tickets, etc.}

   ## Timeline
   {Chronological list from the incident timeline, one line per
   significant event with timestamp. Preserve the scribed entries
   verbatim — don't re-write them.}

   ## Root cause
   {Technical cause, stated in blameless language. Cite the change /
   config / dependency that introduced the failure.}

   ## Contributing factors
   - {Factor 1 — e.g. missing test coverage on X path.}
   - {Factor 2 — e.g. alert threshold too high to catch early.}
   - {Factor 3 — e.g. runbook didn't cover this failure mode.}

   ## What went well
   - {e.g. "Detection was fast — alert fired within 2 minutes."}
   - {e.g. "Rollback procedure worked on first attempt."}

   ## What went poorly
   - {e.g. "Status page not updated until 20 minutes in."}
   - {e.g. "Affected customer didn't get a proactive email."}

   ## Action items

   | # | Action | Owner | Due | Links |
   |---|--------|-------|-----|-------|
   | 1 | {specific, testable action} | {person} | {YYYY-MM-DD} | {ticket / PR} |
   | 2 | {...} | {...} | {...} | {...} |
   ```

6. **Write** atomically to `postmortems/{incident-slug}.md`
   (`*.tmp` → rename). Use the same slug as the incident file so the
   pair is obvious.

7. **Append to `outputs.json`** — new entry `{ id, type:
   "postmortem", title, summary, path, status: "draft", createdAt,
   updatedAt }`. Draft status until the user signs off.

8. **Summarize to user** — one paragraph covering root cause, top
   action item, anything marked UNKNOWN that needs filling in, and
   the path to the postmortem. Offer to update the `outputs.json`
   status to `"ready"` once they've reviewed.

## Outputs

- `postmortems/{incident-slug}.md`
- Appends to `outputs.json` with `type: "postmortem"`.
