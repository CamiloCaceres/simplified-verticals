---
name: find-backlinks
description: "Use when you say 'find backlinks' / 'who should we pitch for links' / 'link-building plan' — I identify target sites via SERP + your connected Ahrefs / backlink tool that match your niche, then draft per-target pitch emails grounded in what you actually offer them. Writes to `backlink-plans/{date}.md` with outreach drafts per target."
integrations:
  seo: [ahrefs, semrush]
  scrape: [firecrawl]
---

# Find Backlinks

## When to use

- Explicit: "find backlinks", "who should we pitch for links",
  "link-building plan", "backlink targets for {topic}", "link
  prospecting".
- Implicit: inside a launch plan when the Head of Marketing needs
  external amplification.
- Weekly or per-campaign cadence.

## Steps

1. **Read positioning doc**:
   `context/marketing-context.md`. If missing,
   stop and tell the user to run `define-positioning` first. The
   positioning and ICP decide which sites are actually relevant.
2. **Read config**: `config/site.json`, `config/tooling.json`. Also
   read `config/voice.md` if it exists (for pitch-email tone). If
   voice is missing, ask ONE question: "Connect your sent inbox via
   Composio so I can match your voice, or paste 2-3 emails you've
   sent — which?"
3. **Discover tool.** Prefer `composio search backlink` (dedicated
   backlink / link-gap tool); fall back to `composio search seo`
   (broader tool with backlink features); last resort
   `composio search web` for SERP analysis.
4. **Build target list** (15-30 prospects). Each target:
   - Domain + the specific page/author to pitch.
   - Why them: topical relevance, Domain Authority (or proxy metric),
     past linking behaviour to similar products, ICP overlap.
   - Link opportunity type: guest post / resource page / broken-link
     replacement / "best X" list addition / expert round-up / podcast.
5. **Tier the list**: Tier 1 (high-value, high-effort), Tier 2
   (medium / medium), Tier 3 (quick wins). Aim for ~5 / 10 / 10.
6. **Draft per-target pitch emails.** For each target produce a
   concise (<150 word) pitch: specific compliment tied to a real
   post of theirs, the value-exchange, a soft CTA. Match voice from
   `config/voice.md` (if available) and positioning from the shared
   doc.
7. **Write** to `backlink-plans/{YYYY-MM-DD}.md` atomically.
   Structure: Executive summary → Tier 1 targets (table + per-
   target pitch) → Tier 2 → Tier 3 → Outreach cadence recommendation.
8. **Append to `outputs.json`** — `{ id, type: "backlink-plan",
   title, summary, path, status: "draft", createdAt, updatedAt }`.
9. **Summarize to user** — count per tier, the top 3 warmest targets,
   and the path. Remind the user: approval required before any
   pitch is actually sent (this skill drafts, does not send).

## Never invent

Never fabricate a recipient's past work or a publication's editorial
interests. Every compliment ties to a real URL. Domain metrics that
the tool didn't return get marked TBD.

## Outputs

- `backlink-plans/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with type `backlink-plan`.
