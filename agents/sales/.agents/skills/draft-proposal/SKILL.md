---
name: draft-proposal
description: "Use when you say 'draft a proposal for {Acme}' / 'one-pager proposal for {Acme}' — I read the deal history across all call notes, lift their verbatim problem statement and success metric, and draft the one-pager (problem → approach → scope in + out → pricing within your playbook's stance → terms → success metrics → timeline → next step). Any exception to the pricing stance gets flagged for your approval. Writes to `deals/{slug}/proposal-v{N}.md`."
---

# Draft Proposal

A one-pager proposal. Not a statement of work — a tight, one-page
document the champion can forward to the economic buyer and procurement.

## When to use

- "draft a proposal for {Acme}".
- "one-pager proposal for {Acme}".
- "I need to send {Acme} a quote / scope".

## Steps

1. **Read the playbook.** Load `context/sales-context.md`.
   Required. Without it, stop.

2. **Read pricing.** From the playbook's pricing-stance section.
   Know the bands, the discount policy, and the non-negotiable.
   **Never draft below the non-negotiable.** If the deal requires
   that, write UNKNOWN and flag for approval.

3. **Read the deal history** — all call notes and analyses under
   `calls/` filtered by `dealSlug`. Extract: their problem
   statement (verbatim), their success metric (verbatim), their
   stakeholders, their timeline.

4. **Draft the proposal (~300–450 words):**

   1. **Problem statement** — in THEIR words, cite which call.
   2. **Proposed approach** — one paragraph, concrete. No buzzwords.
   3. **Scope** — what's in: bulleted. What's explicitly OUT:
      bulleted. The out-of-scope list is as important as the in —
      prevents scope creep.
   4. **Pricing** — the proposed band, assumptions it rests on
      (user count, volume, term), and any discount applied (within
      policy). Show the math.
   5. **Terms** — minimum viable terms from the playbook, adjusted
      only within the discount policy.
   6. **Success metrics** — how we'll both know this worked. Pulled
      from call notes; this is the metric they already told us
      mattered.
   7. **Timeline** — kickoff, value-in-{N}-weeks milestones.
   8. **Next step** — who signs, who legal-reviews, and target close
      date (pulled from `close-plan.md` if it exists).

5. **Sanity-check against the playbook.** Any commitment outside the
   pricing stance or terms gets flagged inline with `FLAG: needs
   approval — exceeds {non-negotiable}`. Surface these to the user in
   the summary, not buried.

6. **Versioning.** If a prior proposal exists, increment the version.
   First draft = `proposal-v1.md`; next = `v2.md`. Never overwrite.

7. **Write atomically** to `deals/{slug}/proposal-v{N}.md.tmp` →
   rename.

8. **Update `deals.json`** — set `lastProposalAt`, `proposalVersion`.

9. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "proposal",
     "title": "Proposal v{N} — {Company}",
     "summary": "<scope one-liner + pricing band>",
     "path": "deals/{slug}/proposal-v{N}.md",
     "status": "draft",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

10. **Summarize.** The pricing ask + any flags that need the user's
    decision. Path to full proposal. Never send.

## Outputs

- `deals/{slug}/proposal-v{N}.md`
- Updates `deals.json`.
- Appends to `outputs.json`.
