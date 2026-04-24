---
name: find-backlinks
description: Use when the user says "find backlinks" / "who should we pitch for links" / "link-building plan" — identifies target sites via Composio backlink / SEO tool or SERP analysis, drafts per-target pitch emails, and writes a dated backlink plan at `backlink-plans/{YYYY-MM-DD}.md`.
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

1. **Read positioning** at `config/positioning.md`. If missing, ask
   ONE question with the best modality: "Before I pick targets, I
   need your positioning — product in one line, ICP, what you'd
   offer a host site (guest post / expert quote / better-than-their-
   current-link). *Best:* drop your pitch deck / about page as a file
   or URL. *Or paste 3-5 sentences.*" Write `config/positioning.md`
   and continue. Positioning and ICP decide which sites are relevant.
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
