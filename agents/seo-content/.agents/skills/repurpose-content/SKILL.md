---
name: repurpose-content
description: Use when the user says "turn {X} into {Y}" / "repurpose this blog post" / "make LinkedIn posts from {YouTube URL}" — takes any source (blog URL, YouTube URL, article paste, competitor post URL) and produces the requested target format (LinkedIn posts / X thread / newsletter / blog draft / shareable insights), written to `repurposed/{source-slug}-to-{target}.md`.
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

1. **Read positioning** at `config/positioning.md` and **voice** at
   `config/voice.md`. If either is missing, ask ONE question naming
   the best modality for each (positioning: drop a file/URL or paste
   3-5 sentences; voice: connect inbox via Composio for 20-30 samples
   or paste 2-3 of your own). Write the config file and continue.
   Voice and positioning are load-bearing for repurposed content.
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
