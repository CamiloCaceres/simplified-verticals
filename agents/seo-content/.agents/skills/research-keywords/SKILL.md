---
name: research-keywords
description: Use when the user says "find keywords for {topic}" / "build a keyword map" / "what should we rank for" — produces a keyword cluster with volume, difficulty, intent, and priority via Composio-discovered keyword tool; appends to the living `keyword-map.md` and writes per-cluster detail at `keyword-clusters/{cluster-slug}.md`.
---

# Research Keywords

## When to use

- Explicit: "find keywords for {topic}", "build a keyword map",
  "what should we rank for", "keyword research on {topic}",
  "give me a cluster for {seed term}".
- Implicit: called by `write-blog-post` when a target keyword is
  missing, or by `analyze-content-gap` to size gap opportunities.
- Can run many times — one cluster per invocation. The living
  `keyword-map.md` appends each new cluster.

## Steps

1. **Read positioning** at `config/positioning.md`. If missing, ask
   ONE question with the best modality: "Before I cluster keywords,
   I need your positioning — product in one line, ICP, category.
   *Best:* drop your pitch deck / about page / positioning doc as a
   file or URL. *Or paste 3-5 sentences.*" Capture to
   `config/positioning.md` and continue. ICP and category decide which
   keywords are actually worth ranking for.
2. **Read config**: `config/site.json`, `config/tooling.json`. If no
   SEO keyword tool is connected, ask ONE question: "Connect a
   keyword tool in the Integrations tab (Semrush / Ahrefs / etc) or
   paste a seed list of terms you think matter — which?"
3. **Discover tool**: `composio search keyword` (fall back to
   `composio search seo`). Pick the first matching connected slug.
4. **Build the cluster** for the requested topic:
   - Expand the seed into 15-40 related terms (head + long-tail).
   - Pull per-term: search volume, keyword difficulty, SERP intent
     (informational / commercial / navigational / transactional).
   - Group into sub-clusters by intent or sub-topic.
   - Score each term priority: `(volume / difficulty) × intent-fit × ICP-fit`.
     ICP-fit references the positioning doc.
5. **Write per-cluster detail** to
   `keyword-clusters/{cluster-slug}.md` atomically. Structure:
   cluster summary, ICP / positioning rationale, sub-clusters table
   (term / volume / difficulty / intent / priority), recommended
   first 3 posts to draft.
6. **Append to `keyword-map.md`** (living doc at agent root).
   If the file doesn't exist, create it with a short preamble.
   Append a new section for this cluster with a link to the
   per-cluster detail file and the top 5 priority terms.
   Atomic write: read → append in memory → write `*.tmp` → rename.
7. **Append to `outputs.json`** — `{ id, type: "keyword-map", title,
   summary, path: "keyword-clusters/{slug}.md", status: "draft",
   createdAt, updatedAt }`.
8. **Summarize to user** — name the top 3 priority terms, flag the
   best first post to draft, link both the cluster detail and the
   updated `keyword-map.md`.

## Never invent

Never estimate volume/difficulty without a tool result. If the tool
returned partial data, mark gaps as TBD. Do not fabricate SERP intent
— read the actual SERP when the tool can fetch it.

## Outputs

- Appends/updates `keyword-map.md` (living document at agent root).
- `keyword-clusters/{cluster-slug}.md` (per-cluster detail).
- Appends to `outputs.json` with type `keyword-map`.
