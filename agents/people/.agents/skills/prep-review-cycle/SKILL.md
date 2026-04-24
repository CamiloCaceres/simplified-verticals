---
name: prep-review-cycle
description: "Use when you say 'prep the review cycle' / 'Q{N} reviews are starting' / 'build the review templates' — produces the self-review template, manager-review template, calibration doc, and full timeline, all scoped to the leveling framework in `context/people-context.md`. Writes to `review-cycles/{cycle-slug}.md` as `status: \"draft\"` until you approve the structure."
integrations: [notion, googledocs]
---

# Prep Review Cycle

## When to use

- Explicit: "prep the review cycle", "Q{N} reviews are starting",
  "build the review templates", "set up the next review cycle".
- Implicit: triggered by `weekly-people-review` when the upcoming
  cycle date from `context/people-context.md` is within the lead-time window.
- Frequency: one per cycle. If the founder wants to refresh mid-cycle,
  re-run and supersede.

## Steps

1. **Read people-context doc:**
   `context/people-context.md`. If missing or empty, tell
   the user to run `define-people-context` first and stop. Read the
   **leveling framework**, **comp bands** (for calibration
   sanity-check), **review-cycle rhythm**, and **voice notes**.
2. **Read config:** `config/context-ledger.json`. If the review-cycle rhythm is unset, use the
   one in `context/people-context.md`. If the roster source is
   `connected-hris`, pull current team via `composio search hris`.
3. **Resolve the cycle slug.** Default to `YYYY-q{N}` (e.g.
   `2026-q2`) for quarterly, `YYYY-h{N}` for semi-annual, or `YYYY`
   for annual. Ask you if the default doesn't match their
   internal naming.
4. **Produce four artifacts** in one markdown file:

   - **Self-review template** — prompt blocks scoped to the leveling
     framework. One section per level attribute (scope, autonomy,
     craft, collaboration, impact) with 1-2 open prompts each. Keep
     prompts short — founders' early team will not write 1500-word
     self-reviews, and we don't want them to.

   - **Manager-review template** — the same attribute scaffolding,
     plus an overall-rating rubric drawn from the cycle's rating
     scale (if `context/people-context.md` defines one) and a
     promotion-readiness flag per person. Include a section for
     "specific examples observed this cycle" — evidence-first, not
     vibes.

   - **Calibration doc** — cross-team view for:
     - Leveling consistency (are L3 ICs being reviewed against the
       same bar across teams).
     - Comp-bump sanity check (if comp bands exist, flag any
       proposed comp change that would cross band edges).
     - Promotion candidates surface (who's been flagged
       promotion-ready; cross-check against tenure-at-level from
       `context/people-context.md` if defined).

   - **Timeline** — dated milestones from today to delivery:
     self-reviews due → manager-reviews due → calibration meeting →
     comp letters finalized → delivery 1:1s held. Derive concrete
     dates from the cycle's start/end window; mark any that need
     founder input.

5. **Voice check.** Pull voice notes from `context/people-context.md` — the
   template prompts and calibration doc should sound like the
   founder's HR voice, not generic HR-ese.

6. **Write** to `review-cycles/{cycle-slug}.md` atomically
   (`*.tmp` → rename). Structure: Cycle overview → Timeline →
   Self-review template → Manager-review template → Calibration doc.

7. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "review-cycle", title, summary, path, status: "draft",
   createdAt, updatedAt }`, write atomically. Status stays `draft`
   until the founder approves the cycle structure — flip to `ready`
   on sign-off.

8. **Summarize to user** — one paragraph covering the cycle slug,
   timeline highlights, and path to the package. Close with: "These
   are drafts. Review the templates and the timeline, then tell me
   to mark ready and I'll flip status — nothing goes to the team
   until you sign off."

## Never invent

Do not invent a leveling framework or a rating scale the founder
hasn't written. If `context/people-context.md`'s leveling section is `TBD`,
tell the user: "I can draft generic prompts, but the templates land
much better once `draft-leveling-framework` is run." Proceed with a
clearly-marked generic template only if the user explicitly asks.

## Outputs

- `review-cycles/{cycle-slug}.md`
- Appends to `outputs.json` with type `review-cycle`.
