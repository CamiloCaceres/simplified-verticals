---
name: write-case-study
description: Use when the user says "draft a case study" / "write up the {customer} story" — pulls the customer interview / testimonial (via Composio or paste) and produces a structured case study (challenge → approach → results with numbers), written to `case-studies/{customer-slug}.md`.
---

# Write Case Study

## When to use

- Explicit: "draft a case study for {customer}", "write up the
  {customer} story", "turn this interview into a case study".
- Implicit: after the SDR / sales agent flags a closed-won customer
  as reference-willing and the founder approves.
- One case study per customer per quarter is a reasonable cadence.

## Steps

1. **Read positioning** at `config/positioning.md` and **voice** at
   `config/voice.md`. If either is missing, ask ONE question naming
   the best modality for each:
   - Positioning → "Drop your pitch deck / about page / positioning
     doc as a file or URL. Or paste 3-5 sentences."
   - Voice → "Connect your inbox via Composio and I'll sample 20-30
     sent messages. Or paste 2-3 things you've written."
   Write `config/positioning.md` and/or `config/voice.md` and continue.
   Case studies must reinforce positioning — not drift.
2. **Read config**: `config/site.json` (for voice / brand CTAs).
3. **Locate source material.** Modality preference:
   - Connected CRM / spreadsheet via Composio — run `composio search
     crm` or `composio search spreadsheet` (e.g. Airtable) to find
     the customer record and any attached interview notes.
   - Pasted interview transcript or testimonial.
   - URL to a published testimonial / review.
   If none available, ask ONE question naming the modalities above.
4. **Extract the facts.** Build a fact list of:
   - Customer name, industry, size, role of interviewee.
   - Challenge (the specific pain, in verbatim customer language
     where possible).
   - Before-state metrics (what broke, how often, at what cost).
   - Approach (what they did with the product — specific features,
     workflow changes).
   - Results (numbers, timeframe, specific outcomes).
   - Pull-quotes (verbatim, attributed).
5. **Flag missing numbers.** Any result without a number gets a
   TBD marker for the founder to verify with the customer. Do not
   fabricate metrics.
6. **Draft the case study** in the classic structure:
   - Headline with the headline result (e.g. "How Acme cut churn 40%").
   - One-paragraph summary.
   - Challenge section.
   - Approach section.
   - Results section (numbers upfront).
   - 2-3 pull-quotes.
   - Call-to-action matching the positioning doc's primary CTA.
7. **Write** to `case-studies/{customer-slug}.md` atomically, with
   a front-matter block: customer, industry, headlineResult, status.
8. **Append to `outputs.json`** — `{ id, type: "case-study", title,
   summary, path, status: "draft", createdAt, updatedAt }`.
9. **Summarize to user** — the headline result, any TBD numbers that
   need founder/customer confirmation, and the path.

## Never invent

Never fabricate a customer quote, metric, or outcome. If the source
doesn't have the data, mark TBD. Push back if the founder wants to
"round up" a number into something cleaner than reality.

## Outputs

- `case-studies/{customer-slug}.md`
- Appends to `outputs.json` with type `case-study`.
