---
name: mine-sales-calls
description: "Use when you say 'mine my sales calls' / 'extract objections from my calls' — I pull transcripts from your connected meeting app (Gong / Fireflies / Circleback), extract verbatim customer phrases, rank pains by frequency, surface objection patterns, and flag positioning wedges. Writes to `call-insights/{date}.md` — the single best source for ad copy and landing-page headlines."
integrations:
  meetings: [gong, fireflies]
---

# Mine Sales Calls

Source template: Gumloop "Sales Call Intelligence for B2B Product
Marketing". This is the highest-leverage research input the Head of
Marketing has — verbatim customer language beats any marketer's
paraphrase.

## When to use

- "mine my sales calls" / "what are customers saying" / "extract
  objections from my calls".
- "pull positioning signals from last week's calls".
- Called implicitly by `define-positioning` (when pushing for
  verbatim quotes) and `profile-icp` (when building pains /
  objections sections).

## Steps

1. **Read positioning doc** (own file):
   `context/marketing-context.md`. Anchor the mining — we're looking
   for quotes that support, update, or contradict what we currently
   claim.

2. **Pick the source — ask ONE tight question if not obvious, with
   modality hint:**
   - "I can pull from your connected meeting-notes app, or you can
     paste 1-3 transcripts. Which?"
   - Connected: run `composio search meeting-notes`; list recent
     calls; ask the user which batch (last 5, last 10, date range,
     specific account).
   - Pasted: take the paste verbatim.

3. **If connected, fetch.** Execute the discovered tool's
   list-recent-calls slug, then list-transcript slug per call.
   Capture: call date, attendees, duration, full transcript.

4. **Extract per call.** For each transcript:
   - **Verbatim pain language** — 3-5 direct quotes where the
     customer describes a problem. Preserve word-for-word.
   - **Verbatim positioning language** — how they describe the
     category, our product, and our competitors. Preserve.
   - **Objections raised** — the actual objection, the context it
     came up in, whether it was handled in the call.
   - **Buying signals** — budget mentions, timeline mentions,
     stakeholder mentions.
   - **Surprises** — anything that contradicts our current
     positioning doc. These are the gold.

5. **Synthesize across the batch.** Roll up:
   - Pain patterns — which pain language repeats, with frequency.
   - Objection patterns — top 3 objections by frequency.
   - Category language — the words customers actually use (vs.
     what we use on the site).
   - Deltas vs. positioning doc — what we should add / change /
     remove in `context/marketing-context.md`.

6. **Structure the artifact (markdown, ~400-700 words).** For a
   batch, write `call-insights/{YYYY-MM-DD}-batch.md`. For a single
   deep-dive on one call, write
   `call-insights/{call-slug}.md`. Structure:

   1. **Scope** — N calls, date range, accounts.
   2. **Top verbatim pains** — quoted, with speaker + call date.
   3. **Top verbatim positioning language** — how customers
      describe the category + us + competitors.
   4. **Top 3 objections** — verbatim + context + handled/unhandled.
   5. **Buying signals spotted** — list.
   6. **Surprises + deltas vs. the positioning doc** — bulleted
      recommendations for updates.
   7. **Hand-off list** — which agents get which insight.
      Example: `[lifecycle-email] Use phrase "{quote}" in the
      re-activation drip subject line.`

7. **Never invent.** Every quote ties to a transcript + speaker +
   timestamp. If something wasn't said, it wasn't said — don't
   round up or summarize into a quote. If transcripts are too thin,
   say so and stop.

8. **Write atomically** — `{path}.tmp` then rename.

9. **Append to `outputs.json`.** Read-merge-write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "call-insight",
     "title": "<Call-insights batch YYYY-MM-DD>" | "<Call with {account}>",
     "summary": "<2-3 sentences — top pain pattern + top objection + delta vs. positioning>",
     "path": "call-insights/<slug>.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

10. **Offer the positioning-doc update.** If deltas are meaningful,
    ask the user: "Want me to update `context/marketing-context.md`
    with these customer phrasings?" — if yes, run
    `define-positioning` in update mode.

11. **Summarize to user.** One paragraph: top pain phrase, top
    objection, biggest positioning delta, path to the artifact.

## Outputs

- `call-insights/{YYYY-MM-DD}-batch.md` or
  `call-insights/{call-slug}.md`.
- Appends to `outputs.json` with `type: "call-insight"`.
- May trigger a `define-positioning` run (user approval required).
