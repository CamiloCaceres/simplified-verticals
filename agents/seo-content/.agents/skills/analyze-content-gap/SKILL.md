---
name: analyze-content-gap
description: Use when the user says "content gap vs {competitor}" / "what are we missing" / "where can we out-rank {competitor}" — crawls competitor content, compares to ours, and produces a ranked opportunity list (search volume × ease), written to `content-gap-analyses/{competitor-slug}-{YYYY-MM-DD}.md`.
---

# Analyze Content Gap

## When to use

- Explicit: "content gap vs {competitor}", "what topics are we
  missing", "where can we out-rank {competitor}", "what's {competitor}
  publishing that we're not".
- Implicit: inside a launch plan when the Head of Marketing needs to
  pick a counter-positioning content beat.
- Per-competitor, no more than monthly per competitor.

## Steps

1. **Read positioning** at `config/positioning.md`. If missing, ask
   ONE question with the best modality: "Before I rank content gaps,
   I need your positioning — product in one line, ICP, top 3
   competitors, differentiators. *Best:* drop your pitch deck / about
   page as a file or URL. *Or paste 3-5 sentences.*" Write
   `config/positioning.md` and continue. The competitor list and
   differentiators decide what "ownable" means.
2. **Read config**: `config/site.json`, `config/tooling.json`. If no
   SEO tool or web-scrape tool is connected, ask ONE question:
   "Connect a web scrape or SEO tool in the Integrations tab
   (Firecrawl / Semrush / Ahrefs) — which do you want to use?"
3. **Identify competitor + target keywords universe.** Take the
   named competitor (or pull top 1-3 from the positioning doc if
   user says "our competitors"). Resolve competitor domain(s).
4. **Crawl competitor content** via `composio search web-scrape` or
   `composio search seo` to pull:
   - Their ranking keywords + top pages.
   - Top content by estimated traffic.
   - Topic clusters they own.
5. **Crawl our content** via the connected CMS or by reading
   `config/site.existingPosts`. Build our topic coverage set.
6. **Compute the gap.** For each competitor-owned topic / keyword:
   - Do we cover it? (yes / partial / no)
   - Search volume (from keyword tool).
   - Estimated difficulty (relative — can we realistically out-rank).
   - Positioning fit (does it reinforce our differentiation from
     the positioning doc? yes / neutral / off-brand).
7. **Rank opportunities** by `(volume × fit) / difficulty`. Surface
   the top 10 with recommended next-actions (new post / refresh
   existing / skip + why).
8. **Write** to
   `content-gap-analyses/{competitor-slug}-{YYYY-MM-DD}.md`
   atomically. Structure: Executive summary → Top 10 opportunities
   (table) → Topic-by-topic detail → Skip list with reasons.
9. **Append to `outputs.json`** — `{ id, type: "content-gap", title,
   summary, path, status: "draft", createdAt, updatedAt }`.
10. **Summarize to user** — the top 3 opportunities with a one-line
    recommended post title each, and the path.

## Never invent

Never estimate competitor traffic without a tool response. Mark
partial-data findings TBD. Don't inflate gaps where our coverage
is actually fine.

## Outputs

- `content-gap-analyses/{competitor-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with type `content-gap`.
