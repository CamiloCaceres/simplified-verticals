---
name: define-people-context
description: "Use when you say 'draft our people-context doc' / 'set up our people context' / 'build the leveling ladder' / 'what's an L3 vs L4' — I draft or update the full shared doc at `context/people-context.md`: company values, team shape, leveling (IC + manager, L1-L5), comp bands, review-cycle rhythm, policy canon, escalation rules, voice, hard nos. Every other skill reads it first."
integrations: [notion, googledocs, googlesheets]
---

# Define People Context

This is the one doc every other skill in this agent reads before it
produces anything substantive — an offer, a PIP, a policy answer, a
retention score, a review cycle. Owned locally at
`context/people-context.md`. I draft, you decide. I never set comp
bands or lock leveling without your sign-off.

## When to use

- "draft our people-context doc" / "set up our people context" /
  "document how we do HR".
- "update the people-context doc" / "our leveling changed, fix the
  context doc".
- "draft our leveling framework" / "build the leveling ladder" /
  "what's an L3 vs L4".
- Called implicitly by any other skill that needs the doc and finds
  it missing — but only after confirming with you.

## Ledger fields I read

- `universal.company` — name, website, stage (shapes how opinionated
  the doc is: pre-first-hire gets more scaffolding, 15+ gets tighter).
- `universal.voice` — summary of your tone, used for the voice-notes
  section.
- `domains.people.hris` — if a connected HRIS exists, I can pull team
  shape directly.
- `domains.people.handbookSource` — optional source doc (Notion /
  Google Docs / Google Sheets) to import from.
- `domains.people.levels` — whether a leveling draft exists yet and
  where to find it.

If any required field is missing, I ask ONE targeted question with a
modality hint (Composio connection > file drop > URL > paste), write
it, continue.

## Steps

1. **Read `config/context-ledger.json`.** Fill any gaps with a single
   targeted question.
2. **Read the existing doc if present.** If
   `context/people-context.md` exists, read it so this run is an
   update, not a rewrite. Preserve anything you've already sharpened;
   change only what's stale or new.
3. **Optional import.** Ask once: "Got an existing handbook, policy
   doc, or comp sheet I should pull from? I can read Notion, Google
   Docs, or Google Sheets if you've connected one." If yes, run
   `composio search docs` / `composio search sheets`, fetch, and cite
   the source in each section where content lands.
4. **Push hard on escalation rules — cannot be inferred.** Ask
   directly: "Who do discrimination / harassment / wage-dispute /
   visa issues route to? A named human lawyer, or should we mark
   TBD?" No defaults. If you don't have a lawyer yet, the section
   reads `TBD — needs employment lawyer on retainer before first
   hire` and I tell you that explicitly.
5. **Draft the doc (~500-900 words, opinionated).** Sections, in
   order:
   1. **Company values** — 4-6 values with 1-line definitions. Pulled
      from your own words; no HR-poster clichés.
   2. **Team shape** — headcount by function, open reqs. Pull from
      connected HRIS if available, else paste.
   3. **Leveling framework** — IC + manager tracks with level names,
      summary expectations, scope of impact, seniority markers per
      level. Default L1-L5; ask once if you want higher. Each level
      has: name (e.g. "Senior Engineer"), one-paragraph expectations,
      scope (team / function / org / cross-org), seniority markers
      (rough years band, decision rights, ambiguity tolerance), and
      a "Embodies {value X, value Y} at this level by…" line that
      ties to the values section.
   4. **Comp bands** — range per level, equity stance, location
      multipliers. Accept `TBD` generously — founders at week 0
      don't know their bands yet.
   5. **Review-cycle rhythm** — annual / semi-annual / quarterly,
      next cycle date.
   6. **Policy canon** — leave, benefits, expenses, remote work,
      travel, equipment. Link source docs where they exist; `TBD`
      where they don't.
   7. **Escalation rules** — agent-answered vs founder-routed vs
      lawyer-routed. Name the lawyer / firm or write `TBD — needs
      employment lawyer on retainer`. Load-bearing for
      `answer-policy-question`, `draft-performance-doc`, and
      `run-approval-flow`.
   8. **Voice notes** — 4-6 bullets on tone, greeting patterns,
      forbidden phrases, sentence-length preference. Pull from the
      ledger voice summary + `config/voice.md` if it exists.
   9. **Hard nos** — what the team will never do (e.g. "we never
      counter-offer on resignations," "we never publish salaries,"
      "we always give 30-day notice before equity expirations").
6. **Mark gaps honestly.** If a section is thin, write `TBD — {what
   you should bring next}`. Never invent. Especially never invent
   comp bands, escalation routing, or legal language.
7. **Write atomically** to `context/people-context.md.tmp`, then
   rename. One file at `context/`. NOT under `.agents/`. NOT under
   `.houston/<agent>/`.
8. **Update the ledger.** Set
   `universal.positioning = { present: true, path:
   "context/people-context.md", lastUpdatedAt: <ISO> }` atomically.
9. **Append to `outputs.json`.** Entry:
   ```json
   {
     "id": "<uuid v4>",
     "type": "people-context",
     "title": "People-context doc updated",
     "summary": "<2-3 sentences — what changed this pass + which sections still TBD>",
     "path": "context/people-context.md",
     "status": "draft",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>",
     "domain": "culture"
   }
   ```
   (The doc is a live file; each substantive edit is indexed so you
   see the update trail on the dashboard.)
10. **Summarize.** One paragraph: what changed, which sections are
    still `TBD` (especially escalation rules and comp bands), and
    the exact next move.

## Outputs

- `context/people-context.md` (live document).
- Appends to `outputs.json` with `type: "people-context"`,
  `domain: "culture"`.

## What I never do

- Set comp bands or lock leveling definitions without your sign-off.
- Draft escalation rules without your explicit input — I ask or mark
  `TBD`. That section is load-bearing and legal-adjacent.
- Write the doc under `.agents/` or `.houston/<agent>/` — Houston's
  watcher skips those paths. Always `context/`.
