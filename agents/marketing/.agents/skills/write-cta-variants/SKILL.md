---
name: write-cta-variants
description: "Use when you say 'better CTA' / 'CTA variants for {button}' — I write CTA button copy variants, each paired with the objection it answers (e.g. 'Start free — no credit card required'). Grounded in pains from your call insights. Writes to `cta-variants/{page-slug}.md`."
---

# Write CTA Variants

CTA copy is small surface area with outsized leverage. Every variant
answers a specific objection from the positioning doc and names an
outcome the founder actually delivers.

## When to use

- "Better CTA for my signup button"
- "CTA variants for the pricing page"
- "What should the demo button say?"
- Often follows `write-headline-variants` or `edit-copy` when the
  CTA is flagged as weak.

## Steps

1. **Read positioning doc** at
   `context/marketing-context.md`. If missing,
   tell the user to run Head of Marketing's `define-positioning`
   first and stop. The positioning doc is where the objections live.
2. **Read `config/voice.md`.** If missing, ask ONE question naming
   the best modality (connected inbox via Composio > paste 2-3
   samples) and write before continuing.
3. **Read `config/primary-page.json`** for the primary conversion
   event. If the user named a different button / conversion, accept
   that and continue.
4. **Identify the surface.** Ask (if unclear) in ONE question: which
   button, which page, which step in the flow. Short paste okay.
5. **List the objections.** Pull the top 3-5 objections from the
   positioning doc (or from `call-insights/` if
   present). If objections aren't documented, ask the user for the
   top 2 ("What makes visitors hesitate on this button?") and note
   them in the output as "founder-flagged".
6. **Draft 5-7 CTA variants.** For each:
   - The exact button text (short — 2-5 words).
   - The objection it answers (named from the list above).
   - The implied outcome (what the user gets on click).
   - The angle: action-led, outcome-led, risk-reversal, social-proof,
     micro-commitment, specificity-led, urgency.
   Never: "Submit", "Click Here", "Learn More", "Get Started"
   without an object.
7. **Rank the top 2 to test first.** Based on which objection is
   most common in the evidence and which outcome the positioning
   doc most supports.
8. **Flag supporting copy.** Note if the CTA needs a trust line
   below it ("No credit card required" / "Cancel anytime") and
   whether that copy ties to a real policy (don't invent).
9. **Hand-off hooks.** If the top variants need an A/B test, name
   Growth & Paid's `design-ab-test`.
10. **Write** atomically to
    `cta-variants/{page-slug}-{YYYY-MM-DD}.md` (`*.tmp` → rename).
11. **Append to `outputs.json`** — `{ id, type: "cta-variants",
    title, summary, path, status: "draft", createdAt, updatedAt }`.
12. **Summarize to user** — top 2 CTAs, the objection each answers,
    path to the full file.

## Never

- Invent trust lines ("No credit card required" only if true).
- Use generic CTAs without an object.
- Promise outcomes the product doesn't deliver.

## Outputs

- `cta-variants/{page-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "cta-variants"`.
