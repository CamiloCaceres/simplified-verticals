---
name: build-battlecard
description: "Use when you say 'they're looking at {competitor}' / 'build a battlecard for {Acme} vs {competitor}' — I research the competitor via Firecrawl + Exa (positioning, pricing, weaknesses, recent reviews) and produce a per-prospect card: 3-criterion grid anchored in what this prospect cares about, 3 trap-set questions, 3 rebuttals, 2 proof points. Writes to `battlecards/{competitor-slug}-{prospect-slug}.md`."
---

# Build Battlecard

NOT a generic comparison sheet. A per-prospect card anchored in what
THAT prospect actually cares about.

## When to use

- User: "they're evaluating us against {competitor}" / "build me a
  battlecard for the Acme deal vs {competitor}" / "how do I beat
  {competitor} for this one".
- Called inline by `draft-outreach` or `analyze subject=discovery-call`
  when a competitor is named in the transcript.

## Steps

1. **Identify the prospect + competitor.** Load the lead row in
   `leads.json` and `calls/{slug}/notes-*.md` if a call exists — the
   prospect's specific evaluation criteria and stated pains are the
   anchor.
2. **Read our product + positioning.** `context/sales-context.md` for
   what we claim — especially the "Top 3 competitors" and "Category &
   differentiators" sections. If that section is thin, ask once:
   "What's your honest top-3 differentiator vs {competitor}? And your
   biggest weakness? (I'll roll it into the playbook — paste, or
   point me at a Notion / Google Doc URL.)"
3. **Research the competitor.** Run `composio search` for available
   research tools. Pull:
   - Their marketing-page positioning (one-line pitch, top 3 claims)
   - Public pricing shape (tiers, model)
   - Recent reviews in the last 6 months (G2 / Capterra / Reddit /
     forum threads — via any connected web-search tool)
   - Known weaknesses (complaints about {X}, performance gripes,
     missing features)
   Capture sources + dates.
4. **Research the prospect's use case.** From the dossier and call
   notes, summarize in 2 lines: what they actually need this tool to
   do, and which 3 criteria they care most about.
5. **Build the comparison grid** — for THEIR top 3 criteria only (not
   a 30-row feature matrix). For each: us vs them, honest verdict
   (WE-WIN / THEY-WIN / TIE), one-sentence why.
6. **Trap-set questions.** 3 questions the user can ask in the next
   call that will surface the competitor's weaknesses naturally — not
   gotchas, genuine discovery. Each tied to a known competitor pain
   point.
7. **Objection rebuttals.** Anticipate 3 objections the competitor's
   rep would raise about us; draft a 2-sentence rebuttal for each,
   anchored in our differentiators (no false claims).
8. **Proof points to cite.** 2-3 customer stories from the playbook's
   anchor accounts section that match this prospect's profile. If the
   playbook's anchor accounts are thin, ask once for a Notion / Google
   Doc URL listing top-cited wins and fold them into the playbook on
   the next `define-playbook` run.
9. **Write** to `battlecards/{competitor-slug}-{prospect-slug}.md`
   with: prospect + competitor header, criteria grid, trap-set
   questions, objection rebuttals, proof points, research-sources
   footer.
10. **Append to `outputs.json`** — read-merge-write atomically:
    `{ id (uuid v4), type: "battlecard", title: "{Prospect} vs
    {Competitor}", summary, path, status: "draft", createdAt,
    updatedAt, domain: "meetings" }`.
11. **Hand off to user:** "Battlecard ready — 3-criterion grid,
    3 trap-set questions, 3 rebuttals, 2 proof points. Want me to
    weave it into your follow-up draft with `draft-outreach
    stage=followup`?"

## Honesty rule

Never fabricate "they're weak at {X}" without a cited source. If a
claim has no source, mark it "(hypothesis — verify)" so the user
doesn't accidentally repeat it as fact. Fabricated battlecards blow
up in demos.

## Outputs

- `battlecards/{competitor-slug}-{prospect-slug}.md`
- Appends to `outputs.json` with `type: "battlecard"`,
  `domain: "meetings"`.
