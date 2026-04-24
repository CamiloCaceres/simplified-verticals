---
name: edit-copy
description: "Use when you say 'edit this' / 'tighten' / 'polish my about page' / 'this reads awkward' — I tighten existing copy in your voice: cut adjectives, remove marketer-speak, add specificity, fix rhythm. Preserves intent. Writes an edited version to `copy-edits/{slug}.md` with before/after notes."
---

# Edit Copy

Enhance existing copy — don't rewrite it. The core message stays; the
lines get tighter, clearer, and still sound like the founder.

## When to use

- "Edit the copy on my {page}"
- "Tighten this — too wordy"
- "Polish my about page"
- "Proofread and sharpen this"
- Called after `write-page-copy` to polish the final draft in one
  focused pass.

## Steps

1. **Read positioning doc** at
   `context/marketing-context.md`. If missing,
   tell the user to run Head of Marketing's `define-positioning`
   first and stop.
2. **Read `config/voice.md`.** If missing, ask ONE targeted question
   naming the best modality (connected inbox via Composio > file >
   paste 2-3 samples) and write the file before continuing. Voice
   is load-bearing for edits — without it I'll smooth you into
   chatbot-speak.
3. **Collect the source copy.** If the user pasted it, work from
   the paste. If the user gave a URL, fetch it via any
   Composio-connected scraper (discover the slug with `composio
   search` and execute by slug). If nothing's provided, ask for the
   copy or URL and stop.
4. **Run the sweeps** in order. Each sweep is focused — don't
   multiplex. After each, loop back to check prior sweeps aren't
   compromised.
   - **Clarity** — confusing sentences, unclear pronouns, jargon,
     ambiguity, missing context, sentences trying to do too much.
   - **Voice** — consistency with `config/voice.md`. Flag lines
     where the user's voice breaks (started casual, went corporate;
     shifted person; etc.).
   - **Specificity** — replace vague claims with concrete ones.
     "Saves time" → "Cuts weekly reporting from 4 hours to 15
     minutes." Numbers over adjectives. If the user didn't give
     numbers, mark `[NEEDS NUMBER]` inline; don't invent.
   - **Length** — kill filler. "In order to" → "to". "At this point
     in time" → "now". Drop exclamation points.
   - **CTAs** — replace weak CTAs ("Submit" / "Click Here" / "Learn
     More") with action + outcome ("Start my free trial" / "See
     pricing for my team"). If the change is load-bearing, hand to
     `write-cta-variants`.
5. **Output format.** For each line I changed, produce three
   rows:
   - **Current** (verbatim).
   - **Proposed**.
   - **Why** — one line. Name the sweep that caught it (clarity /
     voice / specificity / length / CTA).
6. **Preserve the core message.** If I'd have to rewrite the idea
   itself, flag it — don't overwrite. Hand that section to
   `write-page-copy` instead.
7. **Flag contradictions** with the positioning doc in a separate
   section.
8. **Write** atomically to `copy-edits/{page-slug}-{YYYY-MM-DD}.md`
   (`*.tmp` → rename).
9. **Append to `outputs.json`** — `{ id, type: "copy-edit", title,
   summary, path, status: "draft", createdAt, updatedAt }`.
10. **Summarize to user** — how many lines changed, the single
    highest-leverage edit, path to the pass.

## Never

- Rewrite the core message — that's `write-page-copy`.
- Smooth the user's voice into generic marketing-speak.
- Invent stats or testimonials to "strengthen" a line.

## Outputs

- `copy-edits/{page-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "copy-edit"`.
