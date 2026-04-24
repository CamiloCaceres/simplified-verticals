---
name: audit-ai-search
description: Use when the user says "audit AI search visibility" / "how do we show up in ChatGPT/Perplexity/Gemini" / "GEO audit" — checks AI-engine visibility for brand terms and category terms, recommends Generative Engine Optimization (GEO) changes, and writes a dated audit at `ai-search-audits/{YYYY-MM-DD}.md`.
---

# Audit AI Search

## When to use

- Explicit: "audit AI search visibility", "how do we show up in
  ChatGPT / Perplexity / Gemini", "GEO audit", "generative engine
  optimization check", "run a GEO audit".
- Implicit: quarterly rhythm inside a marketing health review, or
  before a launch that depends on AI-engine citation.
- Per-brand, no more than monthly.

## Steps

1. **Read positioning** at `config/positioning.md`. If missing, ask
   ONE question with the best modality: "Before I probe AI engines,
   I need your positioning — brand/product name, category terms, top
   3 competitors, 3 high-intent buyer questions to test. *Best:* drop
   your pitch deck / about page as a file or URL. *Or paste 3-5
   sentences plus those 3 questions.*" Write `config/positioning.md`
   and continue.
2. **Read config**: `config/site.json`, `config/tooling.json`. If no
   way to query AI engines / SERPs, ask ONE question: "Connect an
   AI-search or SERP tool via Composio (Perplexity API / SERP tool /
   web scrape) — or let me know which engines you'd like queried
   manually."
3. **Build the query set** (three buckets, 3-5 queries each):
   - **Brand queries** — "what is {product}", "{product} vs
     {competitor}", "{product} pricing", "is {product} any good".
   - **Category queries** — the top category-defining questions
     from the positioning doc (e.g. "best tool for {JTBD}").
   - **Problem queries** — ICP pain-point phrasings (e.g. "how do I
     {pain the product solves}").
4. **Query the AI engines.** Use `composio search ai-search` or
   `composio search perplexity` / `composio search search` — discover
   and execute available slugs. Target at minimum: ChatGPT / Perplexity /
   Gemini / Google AI Overviews. For each query-engine pair, capture:
   - Did we get cited? (yes / mentioned / no)
   - What was the citing URL (ours, competitor, or third-party)?
   - Who was cited instead if we weren't?
   - What was the AI's framing of our category?
5. **Analyze visibility.** Per engine: cite rate (% of queries where
   we appear), position (primary citation / passing mention / absent),
   share-of-voice vs competitors.
6. **GEO recommendations.** Concrete changes mapped to findings:
   - Content gaps (pages we need that answer the queries).
   - Schema / structured data to add.
   - Citations / mentions to pursue on third-party sites where AI
     engines already pull answers from.
   - Framing / messaging changes to the highest-value existing pages.
7. **Write** to `ai-search-audits/{YYYY-MM-DD}.md` atomically.
   Structure: Executive summary → Visibility scorecard (table per
   engine) → Query-by-query detail → GEO recommendations ranked by
   impact × effort.
8. **Append to `outputs.json`** — `{ id, type: "ai-search-audit",
   title, summary, path, status: "draft", createdAt, updatedAt }`.
9. **Summarize to user** — the cite rate per engine, top 3 GEO
   recommendations, and the path.

## Never invent

If a tool can't be reached or an engine isn't queryable, mark those
rows UNKNOWN — don't guess. Every "we weren't cited" claim ties to
a real query response.

## Outputs

- `ai-search-audits/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with type `ai-search-audit`.
