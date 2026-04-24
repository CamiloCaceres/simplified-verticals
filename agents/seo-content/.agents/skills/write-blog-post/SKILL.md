---
name: write-blog-post
description: Use when the user says "draft a blog post" / "write a post about {topic}" / "blog on {keyword}" — produces a full 2000-3000 word draft with H1/H2/H3 structure, meta description, URL slug, internal link suggestions, and a call-to-action, written to `blog-posts/{slug}.md`.
---

# Write Blog Post

## When to use

- Explicit: "draft a blog post on {topic}", "write a post about
  {keyword}", "blog on {topic} targeting {keyword}".
- Implicit: the user picks a priority term from `keyword-map.md` and
  asks to draft it.
- Produces a full draft; user reviews and signs off before publishing.

## Steps

1. **Read positioning** at `config/positioning.md` and **voice** at
   `config/voice.md`. If either is missing, ask ONE question naming
   the best modality for each:
   - Positioning → "Drop your pitch deck / about page / positioning
     doc as a file or URL. Or paste 3-5 sentences."
   - Voice → "Connect your inbox via Composio and I'll sample 20-30
     sent messages to extract tone cues. Or paste 2-3 things you've
     written."
   Write `config/positioning.md` and/or `config/voice.md` and continue.
   Both are load-bearing for the draft.
2. **Read config**: `config/site.json` (for CMS context and internal
   link targets) and — if it exists — `keyword-map.md` for the
   target keyword's cluster context. If no target keyword is named,
   ask ONE question: "What's the target keyword or working title?"
3. **Discover internal link targets.** If a CMS is connected, run
   `composio search content-cms` and list recent posts to surface
   natural internal-link candidates. Otherwise use `existingPosts`
   from `config/site.json`.
4. **Research** via `composio search web` / SERP tools to pull the
   top 5-10 ranking pages for the target keyword. Identify the
   angle gaps you can exploit, the structure readers expect, and
   cited sources.
5. **Draft the post** (2000-3000 words) with:
   - H1 (working title; keyword-forward but human).
   - Intro (hook + promise + table of contents).
   - H2s / H3s covering the sub-topics the SERP demands, plus at
     least one contrarian or original-angle section tied to the
     positioning doc.
   - Internal link suggestions inline (naming 3-7 candidate URLs).
   - Call-to-action at the end tied to the product's primary CTA
     from the positioning doc.
   - Meta description (≤155 chars).
   - Recommended URL slug (kebab-case).
   - Image brief section (alt text + 2-3 image ideas).
6. **Write** to `blog-posts/{slug}.md` atomically. Include a
   front-matter block with title, slug, metaDescription, targetKeyword,
   wordCount, status.
7. **Append to `outputs.json`** — `{ id, type: "blog-post", title,
   summary, path: "blog-posts/{slug}.md", status: "draft",
   createdAt, updatedAt }`.
8. **Summarize to user** — the post angle, the contrarian hook, the
   suggested internal links, and the path to the draft. Ask for
   sign-off before flipping status to `ready`.

## Never invent

Never fabricate statistics, customer quotes, or sources. Every
citable claim gets a URL or is marked TBD for the founder to verify.
Voice matches the positioning doc's tone — do not generic-ify.

## Outputs

- `blog-posts/{slug}.md`
- Appends to `outputs.json` with type `blog-post`.
