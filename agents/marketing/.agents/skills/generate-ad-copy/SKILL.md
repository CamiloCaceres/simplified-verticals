---
name: generate-ad-copy
description: "Use when you say 'draft ad copy' / 'write ad variants' / 'give me 10 ad headlines' — I pull phrases from your call insights (or G2 / Capterra / Trustpilot reviews via scrape) and write headlines + descriptions that sound like your customers talking — not a marketer pitching. Writes to `ad-copy/{campaign}.md` with the source quote alongside each headline."
integrations:
  scrape: [firecrawl]
---

# Generate Ad Copy

Ad copy that sounds like a customer, not a marketer. Every headline
derives from a real phrase — either a sales-call quote the Head of
Marketing already captured, or a competitor review mined via
Composio. Marketer-speak gets rejected.

## When to use

- "Draft 10 ad copy variants for {product}"
- "Write Google search headlines for {keyword}"
- "Give me Meta creative for the {campaign} launch"
- Follows `plan-paid-campaign` (hand-off: "For copy, run
  `generate-ad-copy` on this campaign's angles").

## Steps

1. **Read positioning doc** at
   `context/marketing-context.md`. If missing,
   tell the user to run the Head of Marketing's `define-positioning`
   first and stop.
2. **Read config:** `config/channels.json` (format constraints vary
   by channel — Google RSA vs. Meta vs. LinkedIn). If no channel
   named, ask which platform in one question.
3. **Source customer language — priority order:**
   - a) `call-insights/` — if the folder exists,
     read the most recent 3-5 files and extract verbatim pain /
     desire quotes.
   - b) `research/` — quote banks from research.
   - c) If neither exists, run `composio search` for review-scrape
     tools (G2, Capterra, Trustpilot, Reddit, App Store) and pull
     competitor / category reviews. Quote verbatim.
   - d) If no review-scrape tool is connected, ask the user to link
     one category, or to paste 5-10 customer quotes, and stop.
4. **Build a quote bank.** 10-20 verbatim phrases, each tagged
   `pain` / `desire` / `objection` / `trigger`. Cite the source
   (call ID / review platform / URL).
5. **Generate variants.** For the named campaign / angle, produce:
   - **Headlines** — 10 variants, each grounded in a specific quote
     (cite the quote tag next to each). Respect platform char limits
     (Google RSA 30; Meta primary ~40; LinkedIn ~70).
   - **Descriptions** — 5 variants, same grounding rule.
   - **CTAs** — 5 variants.
   - **Creative concepts** (for visual placements) — 3 short briefs
     (image direction + overlay text), each tied to an angle.
6. **Rank** variants by hypothesis strength: which quote is the
   strongest pain, which angle the positioning doc most supports.
   Name the top 3 to test first.
7. **Write** atomically to `ad-copy/{campaign-slug}.md` (`*.tmp` →
   rename). Format: quote bank first, then variants with the source
   quote next to each.
8. **Append to `outputs.json`** — `{ id, type: "ad-copy", title,
   summary, path, status: "draft", createdAt, updatedAt }`. Merge,
   atomic write.
9. **Summarize to user** — top 3 variants to test, the pain they
   address, path to the full file.

## Never invent

If you can't point a headline at a specific quote, don't write it.
Marketer-speak ("Revolutionary AI-powered platform") goes in the bin.

## Outputs

- `ad-copy/{campaign-slug}.md`
- Appends to `outputs.json` with `type: "ad-copy"`.
