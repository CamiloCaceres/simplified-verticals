---
name: define-positioning
description: "Use when you say 'help me with positioning' / 'draft my positioning' — I interview you briefly and write the full positioning doc (ICP, category, differentiators, brand voice, pricing stance, primary CTA) to `context/marketing-context.md` at my root. That file is the source of truth the other marketing agents read before they work; until it exists they stop and ask for it."
integrations: [googledocs, notion]
---

# Define Positioning

The Head of Marketing OWNS `context/marketing-context.md`. No other
agent writes it. This skill creates or updates it. Its existence is
what unblocks the other four agents in the workspace.

## When to use

- "help me write a positioning statement" / "draft my positioning" /
  "let's do positioning".
- "update the positioning doc" / "our ICP changed, fix the context
  doc".
- Called implicitly by any other skill that needs positioning and
  finds the doc missing — but only after confirming with the user.

## Steps

1. **Read config.** Load `config/company.json`, `config/icp.json`,
   `config/voice.md`. If any is missing, run `onboard-me` first (or
   ask the ONE missing piece just-in-time with the best-modality
   hint: connected app > file > URL > paste).

2. **Read the existing doc if present.** If
   `context/marketing-context.md` exists, read it so this run is an
   update, not a rewrite. Preserve anything the founder has already
   sharpened; change only what's stale or new.

3. **Push for verbatim customer language.** Before drafting, ask the
   founder for 2-3 verbatim customer quotes (pain they named, a
   phrase they used about the category, an objection you heard). If
   `call-insights/` has entries, mine those first. No marketer-speak
   paraphrases — push back if the founder starts "translating"
   customer words.

4. **Draft the doc (~300-500 words, opinionated, direct).**
   Structure, in this order:

   1. **Company overview** — one paragraph: what we make, who it's
      for, what makes it worth building now.
   2. **ICP** — industry, size, role, triggers. Name **1-2 anchor
      accounts** (real closed-won or target).
   3. **Jobs-to-be-done** — the 2-3 real jobs the buyer hires the
      product for. Verbatim customer language preferred.
   4. **Positioning statement** — one-sentence category + audience +
      differentiated value. Opinionated.
   5. **Category & differentiators** — what category we play in and
      the 3 things that actually set us apart (not "we're faster").
   6. **Top 3 competitors** — named, with a one-line "they're
      strong at X, we're strong at Y" for each.
   7. **Brand voice notes** — 4-6 bullets on tone, forbidden
      phrases, sentence-length preference. Pull from
      `config/voice.md`.
   8. **Pricing stance** — model + current range + the one thing
      that is NOT negotiable.
   9. **Primary CTA** — the one action every page / email /
      campaign pushes toward right now.

5. **Mark gaps honestly.** If a section is thin (no customer quotes
   yet, no anchor account), write `TBD — {what the founder should
   bring next}` rather than guessing. Never invent.

6. **Write atomically.** Write to
   `context/marketing-context.md.tmp`, then rename to
   `context/marketing-context.md`. Single file at agent root. NOT
   under a subfolder. NOT under `.agents/`. NOT under
   `.houston/<agent>/`.

7. **Append to `outputs.json`.** Read existing array, append a new
   entry, write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "positioning",
     "title": "Positioning doc updated",
     "summary": "<2-3 sentences — the positioning statement + what changed this pass>",
     "path": "context/marketing-context.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

   (The doc itself is a live file, but each substantive edit is
   indexed so the founder sees the update on the dashboard.)

8. **Summarize to user.** One paragraph: what you changed, what's
   still `TBD`, and the exact next move (e.g. "paste 3 customer
   quotes and I'll tighten JTBD"). Remind them the other four
   agents now have the context they need.

## Outputs

- `context/marketing-context.md` (at the agent root — live document)
- Appends to `outputs.json` with `type: "positioning"`.
