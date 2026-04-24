---
name: write-headline-variants
description: "Use when you say '10 headlines for {page}' / 'headline variants' / 'alternative hero hooks' — I produce 10 headline + subhead pairs for the named page, each grounded in a verbatim customer quote, review line, or positioning-doc claim. No marketer-speak. Top 3 ranked to test first. Writes to `headline-variants/{page-slug}.md`."
integrations:
  scrape: [firecrawl]
---

# Write Headline Variants

Ten headline variants that sound like the customer, not the marketer.
Every variant cites the real phrase behind it — call quote, review,
or positioning-doc line. If I can't point it at a quote, I don't
write it.

## When to use

- "10 headline variants for my homepage"
- "Alternative hero hooks for the {campaign} landing page"
- "Headline options for the pricing page"
- Often follows `write-page-copy` or Growth & Paid's
  `critique-landing-page` when the headline is the flagged fix.

## Steps

1. **Read positioning doc** at
   `context/marketing-context.md`. If missing,
   tell the user to run Head of Marketing's `define-positioning`
   first and stop.
2. **Read `config/voice.md`.** If missing, ask ONE question naming
   the best modality (connected inbox via Composio > paste 2-3
   samples) and write it before continuing.
3. **Identify the page + primary conversion.** Read
   `config/primary-page.json`. If the user named a different page,
   ask them for its URL / conversion if not obvious, then continue.
4. **Source customer language — priority order:**
   - a) `call-insights/` — if the folder
     exists, read the most recent 3-5 files and extract verbatim
     pain / desire / trigger phrases.
   - b) `research/` — quote banks from
     research briefs.
   - c) If neither exists, run `composio search` for review-scrape
     tools (G2, Capterra, Trustpilot, Reddit, App Store) and pull
     competitor / category reviews. Quote verbatim.
   - d) If no review-scrape tool is connected, ask the user to
     link one category, paste 5-10 customer quotes, or point me at
     review URLs — and stop.
5. **Build a quote bank.** 10-20 verbatim phrases, each tagged
   `pain` / `desire` / `objection` / `trigger` / `positioning-doc`.
   Cite the source (call ID / review platform + URL / positioning
   line).
6. **Generate variants.** 10 headline + subhead pairs. For each:
   - Headline (in the founder's voice, grounded in a specific quote
     from the bank — name the quote tag).
   - Subhead — 1-2 lines expanding the headline with specificity.
   - Angle label — one of: outcome-over-feature, problem-framed,
     "without X", contrarian, urgency, social-proof-led,
     category-definition, transformation, question-hook, numeric.
   Respect any length constraints from the page (hero ~<12 words,
   meta titles ~60 chars) — ask if unclear.
7. **Rank the top 3 to test first.** Rank by: (a) strength of the
   source quote (frequency / pain intensity), (b) alignment with the
   positioning doc's primary claim, (c) contrast with the current
   page copy. Name the headline we'd keep as control and the 3
   challengers.
8. **Hand-off hooks.** If the top variant needs a formal A/B test,
   name Growth & Paid's `design-ab-test`. If it needs CTA work, name
   `write-cta-variants` as the next step.
9. **Write** atomically to
   `headline-variants/{page-slug}-{YYYY-MM-DD}.md` (`*.tmp` →
   rename). Quote bank first, then variants with the source quote
   next to each.
10. **Append to `outputs.json`** — `{ id, type: "headline-variants",
    title, summary, path, status: "draft", createdAt, updatedAt }`.
11. **Summarize to user** — top 3 variants to test, the pain each
    addresses, path to the full file.

## Never invent

If you can't point a headline at a specific quote or positioning-doc
line, don't write it. Marketer-speak ("Revolutionary AI-powered
platform") goes in the bin.

## Outputs

- `headline-variants/{page-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "headline-variants"`.
