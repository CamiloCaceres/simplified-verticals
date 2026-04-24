---
name: audit-site-seo
description: Use when the user says "run an SEO audit" / "audit {domain}" / "how's our SEO" — runs an on-page + technical + content audit of the configured site (or a passed domain) via Composio-connected SEO tools, writes a dated markdown report under `seo-audits/`, and appends an entry to `outputs.json`.
---

# Audit Site SEO

## When to use

- Explicit: "run an SEO audit", "audit {domain}", "how's our SEO",
  "SEO health check", "check our on-page SEO".
- Implicit: called by Head of Marketing during a launch plan, or by
  `analyze-content-gap` when baseline site health is unknown.
- Safe to run per-domain, ideally no more than weekly per domain.

## Steps

1. **Read positioning** at `config/positioning.md`. If missing, ask
   ONE question with the best modality: "Before I audit, I need your
   positioning — product in one line (what it does + for whom), your
   ICP, and 2-3 differentiators. *Best:* drop your pitch deck / about
   page / positioning doc as a file or URL. *Or paste 3-5 sentences.*"
   Capture to `config/positioning.md` and continue. The audit's
   content-vs-positioning fit check depends on this.
2. **Read config**: `config/site.json` and `config/tooling.json`. If
   `site.domain` is missing, ask ONE question naming the best modality
   ("Paste your domain URL — or open Integrations and connect your
   CMS so I can pull posts directly"). Write to `config/site.json`
   and continue.
3. **Discover tools via Composio.** Run `composio search seo` to find
   audit/crawl tool slugs (Semrush / Ahrefs / Firecrawl / generic
   web-scrape). If no SEO-category tools are connected, tell the user
   which category to link from the Integrations tab and stop.
4. **Run the three audit passes** by executing the discovered tool
   slugs against the domain (or key URLs):
   - **On-page** — title tags, meta descriptions, H1/H2 hierarchy,
     canonical tags, schema, alt text, internal linking.
   - **Technical** — crawlability (robots.txt / sitemap), indexation,
     Core Web Vitals, mobile usability, HTTPS, broken links, redirects.
   - **Content** — top-performing pages, thin content, cannibalization,
     content-vs-positioning fit (use positioning doc here).
5. **Score + prioritize**: each finding tagged {severity: critical /
   high / medium / low} and {effort: quick-win / medium / heavy}.
   Surface the top 5 critical-or-high quick-wins at the top.
6. **Write** the audit to
   `seo-audits/{domain-slug}-{YYYY-MM-DD}.md` atomically
   (`*.tmp` → rename). Structure: Executive summary → Top 5 quick
   wins → On-page findings → Technical findings → Content findings →
   Recommended 30-day plan.
7. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "seo-audit", title, summary, path, status: "draft",
   createdAt, updatedAt }`, write atomically.
8. **Summarize to user** — one paragraph with the top 5 quick-wins
   and the path to the full report.

## Never invent

Every finding ties back to a real tool response or URL observation.
If a tool errored or returned no data, mark the finding MISSING or
UNKNOWN — don't guess.

## Outputs

- `seo-audits/{domain-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with type `seo-audit`.
