---
name: draft-onboarding-plan
description: "Use when you say 'draft the onboarding plan for {new hire}' / 'first 90 days for {new hire}' / '{new hire} starts Monday — get them ready' — reads leveling and voice from `context/people-context.md`, then produces a Day 0 / Week 1 / 30-60-90 plan plus welcome Slack and welcome email drafts at `onboarding-plans/{employee-slug}.md`."
integrations: [slack, gmail, notion]
---

# Onboard New Hire

## When to use

- Explicit: "draft the onboarding plan for {new hire}", "first 90
  days for {new hire}", "{new hire} starts {date} — get them ready",
  "prep onboarding for {new hire}".
- Implicit: routed from Recruiter after `draft-offer` → offer
  accepted, or after a new hire is confirmed.
- Frequency: once per new hire.

## Steps

1. **Read people-context doc.** Read
   `context/people-context.md` for values, leveling
   framework, voice notes, and any hard nos on onboarding. If
   missing or empty, tell the user: "I need your people-context doc
   first — run the define-people-context skill." Stop.
2. **Read config.** `config/context-ledger.json` (HRIS) for the HRIS (read-only —
   the agent never modifies HRIS records) and `config/context-ledger.json` (helpdesk channel)
   for the welcome-channel target. If core details about the new
   hire are missing (start date, role, level, manager, location,
   remote vs in-office), ask ONE targeted question covering all
   gaps. Best modality first (HRIS record > pasted offer letter >
   paste).
3. **Discover tools via Composio.** Run `composio search hris`,
   `composio search chat`, `composio search inbox`, and
   `composio search calendar` to find the tool slugs for reading
   the hire's HRIS profile, drafting welcome messages, and
   scheduling calendar blocks. If a needed category is missing,
   name which category to link from the Integrations tab and
   continue with the rest.
4. **Compose the plan** with these sections:
   - **Day 0 prep** — accounts to provision (email, Slack, tooling
     by role), equipment to ship + tracking, buddy assignment,
     calendar blocks for Week 1, welcome-message queue.
   - **Week 1** — welcome-packet contents, intro meetings (founder,
     team, cross-functional), tooling walkthrough, read-me docs,
     first shadow tasks.
   - **Day 30 milestones** — deliverables + check-in prompts pulled
     from the leveling-framework expectations for this level/track.
   - **Day 60 milestones** — expanded deliverables + first solo
     ownership.
   - **Day 90 milestones** — full ownership + first review anchor
     point.
5. **Draft the welcome Slack message + welcome email.** Read voice
   notes from `context/people-context.md` (and `config/voice.md` if
   present). Match the tone fingerprint. Include the buddy intro,
   the Day-1 calendar link, and a one-line "here's what matters in
   your first week."
6. **Write** the plan atomically to
   `onboarding-plans/{new-hire-slug}.md` (`*.tmp` → rename).
   Include the welcome Slack + welcome email at the bottom under
   clearly labeled sections so the founder can lift them verbatim.
7. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "onboarding-plan", title, summary, path, status:
   "draft", createdAt, updatedAt }`. Write atomically.
8. **Summarize to user** — one paragraph with the start date, the
   Day-0 checklist length, and the path to the artifact. Note that
   the welcome messages are drafted but not sent — founder sends
   after review.

## Never invent

Every milestone and expectation ties back to the leveling framework
in `context/people-context.md`. If the level isn't defined, mark TBD and
ask — don't guess a rubric.

## Outputs

- `onboarding-plans/{new-hire-slug}.md` (plan + welcome drafts).
- Appends to `outputs.json` with type `onboarding-plan`.
