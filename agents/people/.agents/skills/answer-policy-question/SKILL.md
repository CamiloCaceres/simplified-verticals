---
name: answer-policy-question
description: "Use when you say 'does {employee} qualify for {benefit}' / 'can {employee} expense {item}' / 'what's our policy on {leave / remote / equipment}' — reads the policy canon AND escalation rules from `context/people-context.md`, classifies the question as direct / ambiguous / escalation, and drafts the reply (or escalation note) accordingly. Never answers legal-sensitive escalation categories on its own."
integrations: [notion, googledocs]
---

# Answer Policy Question

## When to use

- Explicit: "does {employee} qualify for {PTO / leave / parental /
  bereavement / remote}", "can {employee} expense {X}", "what's our
  policy on {topic}", "is this covered".
- Implicit: routed from a helpdesk-channel watcher (Slack listener,
  Gmail filter) when a team member asks an HR question.
- Frequency: as often as team members ask. The classifier runs
  every time.

## Steps

1. **Read people-context doc.** Read
   `context/people-context.md`. If missing or empty, tell
   the user: "I need your people-context doc first — run the define-people-context skill." Stop.
2. **Read the escalation rules section specifically** from
   `context/people-context.md`. These define which categories route to a
   human lawyer / founder (typically: discrimination, harassment,
   wage disputes, visa legal opinions, protected-class performance
   actions). Hold this list explicitly in scope before classifying.
3. **Classify the incoming question into exactly one of three
   buckets:**

   - **Direct answer** — the question is covered by the policy canon
     in `context/people-context.md` (leave · benefits · expenses · remote ·
     travel · equipment) AND does NOT match any escalation category.
     → Proceed to Step 4 to draft the reply.
   - **Ambiguous** — the policy canon is silent or unclear on this
     question, and the question does NOT match an escalation
     category. → Draft a recommended answer AND flag as "needs
     founder review" before sending. Do not ship without founder
     sign-off.
   - **Escalation required** — the question matches one of the
     escalation rules (discrimination, harassment, wage disputes,
     visa law, protected-class performance actions, or anything
     else defined in the `context/people-context.md` escalation section).
     → **DO NOT draft a policy answer.** Skip to Step 6 — draft
     the escalation note instead.

   Record the chosen bucket. Every output in `policy-answers/` and
   every `outputs.json` entry carries this classification.

4. **For direct answers — read voice + draft the reply.** Read
   `config/voice.md` if it exists AND the voice-notes section of
   `context/people-context.md`. Draft the reply in that voice, citing the
   specific policy section (e.g. "Per our PTO policy in
   context/people-context.md § Policy canon — 15 days accrued after 90-day
   probation…"). Keep it direct, no hedging.
5. **For ambiguous answers — draft + flag.** Same voice. Draft a
   recommended answer that names the unclear policy area, proposes
   an interpretation, and opens with a clear "Founder review
   needed before sending — the policy canon is silent on {X}."
6. **For escalations — draft the escalation note, not the answer.**
   Write a short note routing the question to the named human per
   the escalation rules (founder / human lawyer). The note states:
   (a) the category that triggered escalation, (b) a one-line
   paraphrase of the question (redact sensitive personal details
   where possible), (c) explicit instruction to NOT respond to the
   asker directly until the named human has reviewed. No policy
   drafting. No legal opinion.
7. **Write** the artifact atomically to
   `policy-answers/{slug}.md` (`*.tmp` → rename). Frontmatter or
   top-of-file header records:
   - `classification: direct | ambiguous | escalation`
   - `asker: {name}` (if known)
   - `question: {one-line paraphrase}`
   - `routedTo: {founder | human-lawyer | —}` (for
     ambiguous/escalation)
8. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "policy-answer", title, summary, path, status:
   "draft", createdAt, updatedAt }`. The `summary` leads with the
   classification bucket ("ESCALATION — visa-law question routed to
   human lawyer per people-context § Escalation rules"). Write
   atomically.
9. **Summarize to user** — one paragraph naming the classification
   bucket, the path to the artifact, and what happens next
   (send after sign-off / wait for founder review / wait for
   lawyer). Never imply the reply has been sent.

## Hard rules

- **Never draft a policy answer for an escalation-category question.**
  Even if the answer seems obvious. Route it.
- **Never send a reply without founder sign-off** when classification
  is `ambiguous` or `escalation`.
- **Never invent the policy canon.** If it's silent, say so and
  classify `ambiguous`.
- **Never reveal one employee's confidential data to another**
  without explicit authorization.

## Outputs

- `policy-answers/{slug}.md` (with classification recorded at top).
- Appends to `outputs.json` with type `policy-answer` and the
  classification bucket in the summary.
