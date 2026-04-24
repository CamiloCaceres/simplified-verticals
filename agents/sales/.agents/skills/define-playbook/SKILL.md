---
name: define-playbook
description: "Use when you say 'write my sales playbook' / 'draft the playbook' / 'our ICP changed' / 'let's lock pricing' — I interview you briefly and write the full playbook (ICP, buying committee, qualification framework, pricing stance, deal stages, objection handbook, competitors, primary first-call goal) to `context/sales-context.md`. Every other skill reads it first — until it exists, they stop and ask for it."
integrations: [googledocs, notion]
---

# Define Playbook

This skill OWNS `context/sales-context.md`. No other skill writes it.
This skill creates or updates it. Its existence is what unblocks every
other skill in this agent.

## When to use

- "write my sales playbook" / "draft the playbook" / "let's do the
  playbook".
- "update the playbook" / "our ICP changed, fix the playbook" /
  "update pricing stance".
- Called implicitly by any other skill that needs the playbook and
  finds it missing — but only after confirming with the user.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `universal.company` — name, website, 30s pitch, stage. Required.
  If missing, ask ONE question with a modality hint ("paste your
  homepage URL — or connect HubSpot and I'll pull the company
  record").
- `universal.icp` — industry, roles, pains, triggers. If thin, the
  playbook section will say `TBD` honestly; don't invent.
- `domains.crm.slug` + `dealStages` — used to seed the Deal stages
  section. Ask ONE question if missing: "Which CRM — HubSpot,
  Salesforce, Attio, Pipedrive, Close? Or paste your stage list."
- `domains.meetings.qualificationFramework` — MEDDPICC / BANT /
  custom. Ask if missing.

## Steps

1. **Read the ledger + existing playbook.** If
   `context/sales-context.md` exists, read it so this run is an
   update, not a rewrite. Preserve anything the founder has already
   sharpened; change only what's stale or new.

2. **Mine recent calls if available.** Read
   `calls/*/analysis-*.md` and `call-insights/*.md`. Pull objection
   patterns and verbatim pain phrases directly into the handbook;
   don't paraphrase.

3. **Push for verbatim customer language.** Before drafting, ask the
   founder for 2-3 verbatim customer quotes (a pain named, a phrase
   they used about the category, an objection heard). If
   `call-insights/` has entries, mine those first. No marketer-speak
   paraphrases.

4. **Draft the playbook (~500-800 words, opinionated, concrete).**
   Structure, in this order:

   1. **Company overview** — one paragraph: what we make, who it's
      for, what makes it worth building now.
   2. **ICP** — industry, size, region, stage. Name **1-2 anchor
      accounts** (real closed-won or target).
   3. **Buying committee** — champion (title + motivations),
      economic buyer (title + what wins them), blocker (who kills
      deals + why), influencers.
   4. **Disqualifiers** — 3-5 hard nos. If we see X, we walk.
   5. **Qualification framework** — MEDDPICC / BANT / the founder's
      own list. Write out the questions this agent asks to score
      each pillar.
   6. **Pricing stance** — model, bands (if disclosed), discount
      policy, minimum viable terms, the non-negotiable line.
   7. **Deal stages + exit criteria** — what moves a deal from
      Stage N → N+1. Concrete: "Stage 2 exits when champion has
      confirmed pain AND identified the economic buyer by name."
   8. **Objection handbook** — top 5 objections + the founder's
      best current response. Prefer verbatim call-derived phrasing
      over marketing-speak.
   9. **Top 3 competitors** — named, with a one-line "they're
      strong at X, we beat on Y" for each.
   10. **Primary first-call goal** — the single ask every
       discovery call lands on. Concrete: "Next step is a technical
       validation with their eng lead in the next 7 days."

5. **Mark gaps honestly.** If a section is thin (no call data yet,
   no anchor account named), write `TBD — {what the founder should
   bring next}` rather than guessing. Never invent.

6. **Write atomically.** Write to `context/sales-context.md.tmp`,
   then rename to `context/sales-context.md`. Single file. NOT under
   `.agents/`. NOT under `.houston/<agent>/`.

7. **Update the ledger.** Set
   `universal.playbook = { present: true, path:
   "context/sales-context.md", lastUpdatedAt: <ISO> }` and any
   `universal.icp` / `domains.crm.dealStages` /
   `domains.meetings.qualificationFramework` fields the interview
   newly captured. Atomic read-merge-write of
   `config/context-ledger.json`.

8. **Append to `outputs.json`.** Read existing array, append:

   ```json
   {
     "id": "<uuid v4>",
     "type": "playbook",
     "title": "Sales playbook updated",
     "summary": "<2-3 sentences — what changed this pass>",
     "path": "context/sales-context.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>",
     "domain": "playbook"
   }
   ```

   (The playbook itself is a live file, but each substantive edit
   is indexed so the founder sees the update on the dashboard.)

9. **Summarize to user.** One paragraph: what you changed, what's
   still `TBD`, and the exact next move (e.g. "run `profile-icp`
   for {segment} to fill the buying-committee section"). Remind
   them every other skill now has the context it needs.

## What I never do

- Invent ICP, pricing, competitors, or objections. Thin sections get
  marked `TBD` — never guessed.
- Overwrite sharpened sections on an update pass — preserve what
  the founder has already tightened.
- Write the playbook anywhere except `context/sales-context.md`.

## Outputs

- `context/sales-context.md` (at the agent root — live document).
- Updates `config/context-ledger.json`.
- Appends to `outputs.json` with `type: "playbook"`,
  `domain: "playbook"`.
