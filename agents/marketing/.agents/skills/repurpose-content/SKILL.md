---
name: repurpose-content
description: "Use when you say 'turn {X} into {Y}' / 'repurpose this blog' / 'YouTube → blog draft' — I take any source (blog URL, YouTube transcript, article paste, competitor post) and reshape it for a target format (5 LinkedIn posts, an X thread, a newsletter, a blog draft, shareable insights). Writes to `repurposed/{source}-to-{target}.md` — hand to Social or Lifecycle to ship."
integrations:
  scrape: [firecrawl]
  video: [youtube]
---

# Repurpose Content

## When to use

- Explicit: "turn this blog post into LinkedIn posts", "repurpose
  this YouTube video into a blog draft", "make an X thread from
  this article", "pull shareable insights from {URL}".
- Implicit: after `write-blog-post` lands a big post, the founder
  asks for social derivatives.
- Supports many source × target combinations — pick format dynamically
  from the user's ask.

## Steps

1. **Read positioning doc**:
   `context/marketing-context.md`. If missing,
   stop and tell the user to run `define-positioning` first. Voice
   and positioning are load-bearing for repurposed content.
2. **Read config**: `config/site.json` and `config/tooling.json`.
3. **Parse source + target** from the user's ask. Source can be:
   - A blog/article URL → fetch via `composio search web` or
     scrape tool.
   - A YouTube URL → run `composio search youtube` to find a
     transcript tool; fetch transcript + metadata.
   - Pasted article or transcript text.
   - A competitor blog URL (for legal repurpose: insight + credit).
4. **Ingest the source.** Pull the full text (or transcript). Extract:
   - Thesis / core argument.
   - 5-10 distinct insights.
   - Quotable lines.
   - Concrete examples / numbers.
5. **Transform to target format.** Apply the right template:
   - **LinkedIn posts** (default: 5 variants) — hook + value +
     CTA; each under 1300 chars; one hero quote or stat per post.
   - **X thread** — 1 hook tweet + 6-12 body tweets; each ≤ 280
     chars; thread-close CTA.
   - **Newsletter** — subject + preheader + 300-600 word body +
     clear CTA.
   - **Blog draft** — H1/H2 structure matching `write-blog-post`
     (but shorter, 800-1200 words for YouTube → blog).
   - **Shareable insights** — a bulleted insight-card list, each
     with a quote and the insight in one line.
   Match the voice from the positioning doc; do not generic-ify.
6. **Write** to `repurposed/{source-slug}-to-{target}.md` atomically.
   Front-matter: sourceUrl, sourceType, targetFormat, status.
7. **Append to `outputs.json`** — `{ id, type: "repurposed", title,
   summary, path, status: "draft", createdAt, updatedAt }`.
8. **Summarize to user** — how many variants produced, the strongest
   hook, and the path.

## Never invent

If the source source doesn't say it, don't put it in the repurposed
piece. When rewriting a competitor post (legal repurpose), credit
the source explicitly and transform the framing substantially — never
plagiarize.

## Outputs

- `repurposed/{source-slug}-to-{target}.md`
- Appends to `outputs.json` with type `repurposed`.
