---
name: draft-performance-doc
description: "Use when you say 'draft a PIP for {employee}' / 'someone flagged RED — what do I say' / '{employee} might be leaving' — I draft the `type` you pick: `pip` runs a MANDATORY escalation check (protected class + pretextual timing) BEFORE drafting a Context → Expectations → 30/60/90 Milestones → Support → Consequences plan · `stay-conversation` drafts a verbal 1:1 SCRIPT (Open → Listen → Surface → Ask → Propose) filtered against your hard nos. Writes to `performance-docs/{type}-{employee-slug}.md`. Never delivered without your sign-off."
integrations: [slack, gmail]
---

# Draft Performance Doc

Two of the most tone-sensitive artifacts this agent produces. Both
read voice and hard-no constraints from `context/people-context.md`
before drafting. Both end as files at the agent root — you deliver,
never me.

## When to use

- `type=pip` — "draft a PIP for {employee}", "performance improvement
  plan for {employee}", "{manager} flagged {employee} for performance
  concerns".
- `type=stay-conversation` — "draft a stay conversation for
  {employee}", "{employee} might be leaving", "someone flagged RED —
  what do I say", "retention conversation prep".

`stay-conversation` is also recommended by `analyze
subject=retention-risk` for every RED. `pip` is always triggered by
you — never implicitly.

## Ledger fields I read

- `universal.voice` — voice notes drive the tone of the draft. A PIP
  or stay script in the wrong voice lands harder or softer than
  intended.
- `domains.people.roster` — to resolve the employee slug. If the
  employee isn't on the roster, I ask to confirm name + role.

If any required field is missing, I ask ONE targeted question with a
modality hint (Composio connection > file drop > URL > paste), write
it, continue.

## Parameter: `type`

- `pip` — performance improvement plan. Runs the escalation check
  first, no exceptions. If a protected-class + pretextual-timing
  trigger fires, STOPS and writes an escalation note routing to a
  human lawyer. If clear, drafts a Context → Expectations → 30/60/90
  Milestones → Support → Consequences plan. Writes to
  `performance-docs/pip-{employee-slug}.md`.
- `stay-conversation` — a verbal 1:1 SCRIPT, not an email. Five
  sections: Open → Listen → Surface → Ask → Propose. Filtered against
  hard nos (e.g. counter-offer policy). Writes to
  `performance-docs/stay-conversation-{employee-slug}.md`.

## Steps

1. **Read the ledger** and fill gaps with ONE targeted question.
2. **Read `context/people-context.md`.** If missing or empty, tell
   you: "I need the people context first — run the
   define-people-context skill." Stop.
3. **Read optional `employee-dossiers/{employee-slug}.md`** if it
   exists. Pull tenure, role history, recent performance notes, prior
   manager feedback. If missing, note the gap and work from
   `checkins/` + your stated concerns.
4. **Read recent check-ins.** Last 4-6 `checkins/{YYYY-MM-DD}.md`
   files — pull every response from this employee (blockers,
   frustrations, themes).
5. **Branch on `type`:**

   - **If `type = pip` — run the escalation check first:**
     1. Read the escalation-rules section of
        `context/people-context.md`. Note every trigger listed. The
        canonical set: protected class (race, gender, age 40+,
        pregnancy, disability, religion, national origin, sexual
        orientation, veteran status — confirm the jurisdiction's
        list in the context doc); protected activity within the
        trigger window (medical-leave request, pregnancy disclosure,
        accommodation request, whistleblower / good-faith complaint,
        union activity, workers' comp claim); timing trigger (concerns
        arising or escalating within 30-90 days of protected activity
        — window defined in the doc).
     2. Assess: ask you directly (or read the dossier if present) for
        the employee's protected-class status, recent protected
        activity, and timeline of when concerns were first documented
        vs. when activity occurred. Do NOT guess — if unknown, ask
        and explain: "I need this to run the escalation check —
        nothing is drafted until it clears."
     3. If ANY trigger matches: STOP. Do NOT draft the PIP. Write an
        **escalation note** (not a PIP) to
        `performance-docs/pip-{employee-slug}.md`: "This case needs a
        human lawyer before any PIP is written because: {specific
        trigger}. The match: {class/activity} + {timing}." Add a
        short paragraph on why (retaliation claims hinge on
        pretextual timing; a fair PIP in this window still creates
        risk). Append to `outputs.json` with `type: "performance-doc"`,
        `escalation: "needs-lawyer"`. Summarize: "Escalation
        triggered — stopped. Do not draft or deliver a PIP until a
        lawyer has reviewed. Specific trigger: {trigger}." Stop.
     4. If clear, read leveling + voice notes from the context doc
        and draft the PIP with this structure:
        - **Context** — what's specifically underperforming, with
          concrete examples dated and sourced. Evidence-first. Never
          invent — if an example can't be sourced, leave it out.
        - **Expectations** — what "meeting the bar" looks like at
          this level, pulled from the leveling framework. Each
          expectation observable and measurable.
        - **Milestones** — 30 / 60 / 90-day checkpoints. Each names
          the measurable criteria the employee must demonstrate by
          that date. Tied to expectations, not vibes.
        - **Support** — what you and the manager will provide:
          weekly 1:1s, feedback cadence, training budget, pairing
          with a senior, clearer project scope. A PIP without real
          support is paper.
        - **Consequences** — what happens if milestones aren't met
          at 30 / 60 / 90. Plainly stated in your voice — neither
          softened nor threatening.

   - **If `type = stay-conversation`:**
     1. Read the retention-score reasoning. If
        `analyses/retention-risk-{...}.md` flagged this employee RED,
        read the reasoning block. The script surfaces themes the
        signals revealed — never the signals literally (employees
        don't need to hear "your commit cadence dropped"; they need
        to hear "I've sensed something is off").
     2. Draft the script in five sections:
        - **Open** — warm, specific, your voice. One or two
          sentences that land the purpose without ambushing.
        - **Listen** — 3-4 open-ended questions designed to get them
          talking first. What's going well. What's frustrating. What
          they'd change.
        - **Surface** — what you've noticed, framed as observation
          not accusation. Draw from check-in themes and dossier
          history. Never cite engagement signals literally.
        - **Ask** — the direct question: "What would make you want
          to stay here for another year?" (or the equivalent in your
          voice). One clear ask.
        - **Propose** — concrete levers: scope change, title change,
          project move, manager change, comp review. Filter every
          lever against hard nos in `context/people-context.md` — if
          "we never counter-offer on resignations" is written, comp
          is off the table; redirect to scope / title / project.
     3. Header at the top of the file: "**This is a script for a
        verbal 1:1, not an email. Do not send.**"

6. **Write atomically** to the per-type path (`*.tmp` → rename).
7. **Append to `outputs.json`** with:
   ```json
   {
     "id": "<uuid v4>",
     "type": "performance-doc",
     "title": "<type> — <employee>",
     "summary": "<2-3 sentences>",
     "path": "performance-docs/<type>-<employee-slug>.md",
     "status": "draft",
     "escalation": "drafted | blocked-on-escalation | needs-lawyer | n/a",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>",
     "domain": "performance"
   }
   ```
   `escalation` is `n/a` for stay-conversations.
8. **Summarize.** One paragraph covering the key elements + path.
   - For `pip`: include the Context summary, 30/60/90 at a glance,
     escalation classification. Close: "This is a draft. PIPs are
     never delivered without your sign-off and, ideally, a second set
     of eyes. Read, tell me what to change, flip status to `ready`
     after sign-off."
   - For `stay-conversation`: "This is a prompt for a verbal 1:1 —
     don't send it. Read before your next 1:1 and adapt in the
     moment."

## Outputs

- `performance-docs/pip-{employee-slug}.md` (`type=pip`).
- `performance-docs/stay-conversation-{employee-slug}.md`
  (`type=stay-conversation`).
- Appends to `outputs.json` with `type: "performance-doc"`,
  `domain: "performance"`.

## What I never do

- Draft a PIP without running the escalation check first. No
  exceptions.
- Write a stay conversation as an email. It's verbal by design. If
  you ask for an email version, I decline and explain why.
- Recommend a counter-offer unless `context/people-context.md`
  explicitly allows it.
- Invent examples, dates, or quotes for a PIP Context section.
  Invented evidence destroys both legal and human legitimacy.
- Flip any `performance-doc` to `ready` automatically — you sign off.
