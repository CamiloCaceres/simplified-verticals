---
name: audit
description: "Use when you say 'run an SEO audit' / 'GEO audit' / 'critique my landing page' / 'audit my form' — I audit the `surface` you pick: `site-seo` via Semrush or Ahrefs · `ai-search` probes ChatGPT / Perplexity / Gemini for your brand and category terms · `landing-page` fetches via Firecrawl and scores 6 dimensions · `form` from paste or URL. Every finding ranked by impact × ease. Writes to `audits/{surface}-{slug}-{date}.md` — a prioritized fix list, not a warnings dump."
integrations:
  seo: [semrush, ahrefs]
  scrape: [firecrawl]
  search: [perplexityai]
---

# Audit

One skill for four audit surfaces. The `surface` parameter picks the
probe; impact × ease prioritization and "never invent" discipline are
shared.

## Parameter: `surface`

- `site-seo` — on-page + technical + content audit of the configured
  domain via Semrush / Ahrefs / Firecrawl.
- `ai-search` — ChatGPT / Perplexity / Gemini / Google AI Overviews
  visibility probe + GEO recommendations.
- `landing-page` — fetch via Firecrawl, score 6 dimensions 0-3,
  prioritized fix list.
- `form` — flag unnecessary fields, rewrite labels + helper text,
  sequence by friction (non-signup forms — demo / contact / lead /
  checkout).

If the user names the surface in plain English ("SEO audit", "GEO",
"teardown my landing page", "fix my demo form"), infer it. If
ambiguous, ask ONE question naming the 4 options.

## When to use

- Explicit: "run an SEO audit", "audit AI search visibility", "GEO
  audit", "critique {URL}", "audit my lead form".
- Implicit: inside `plan-campaign` (paid / launch) when a routed
  landing page needs sharpening, or inside `analyze` (content-gap)
  when baseline site health is unknown.
- Per-surface cadence: site-seo weekly max, ai-search monthly max,
  landing-page on demand, form on demand.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `positioning` — from `context/marketing-context.md`. Required for
  all surfaces (content-vs-positioning fit, ICP-grounded scoring).
  If missing: "want me to draft your positioning first? (one skill,
  ~5m)" and stop.
- `icp` — used by `landing-page` and `form` to ground objection-
  handling dimension + form-field verdicts.
- `domains.seo.domain`, `domains.seo.tooling` — required for
  `site-seo` and `ai-search`. If missing for these surfaces, ask
  ONE question naming the best modality ("Paste your domain — or
  open Integrations and connect Semrush / Ahrefs / Firecrawl").

## Steps

1. **Read ledger + positioning.** Gather missing required fields per
   above (ONE question each, best-modality first). Write atomically.
2. **Discover tools via Composio.** Run `composio search seo` /
   `composio search web-scrape` / `composio search ai-search` /
   `composio search perplexity` as the surface dictates. If no tool
   is connected for a required category, name the category to link
   and stop.
3. **Branch on surface.**
   - `site-seo`: execute discovered tool slugs against the domain
     and key URLs, run three passes:
     - **On-page** — title tags, meta descriptions, H1/H2 hierarchy,
       canonical tags, schema, alt text, internal linking.
     - **Technical** — robots.txt / sitemap, indexation, Core Web
       Vitals, mobile usability, HTTPS, broken links, redirects.
     - **Content** — top-performing pages, thin content,
       cannibalization, content-vs-positioning fit.
   - `ai-search`: build the query set (3 buckets of 3-5 queries each):
     **Brand** ("what is {product}", "{product} vs {competitor}",
     "{product} pricing"), **Category** (top JTBD questions from
     positioning), **Problem** (ICP pain-point phrasings). Query each
     engine via discovered slugs — at minimum ChatGPT / Perplexity /
     Gemini / Google AI Overviews. For each query-engine pair
     capture: cited (yes / mentioned / no), citing URL, who was
     cited instead, AI's category framing.
   - `landing-page`: execute the web-scrape slug to fetch the URL
     (rendered HTML + visible text + primary images + meta + any
     page-speed signals). Score 6 dimensions 0-3 with a one-sentence
     reason quoting the page:
     1. **Headline clarity** (WHO + WHAT in ≤12 words).
     2. **Value prop above the fold** (outcome visible without
        scrolling).
     3. **Social proof** (credibility + proximity to CTA).
     4. **Primary CTA** (one unambiguous action matching primary
        conversion).
     5. **Objection handling** (FAQ / guarantee / pricing against
        top 2-3 ICP objections from positioning).
     6. **Visual hierarchy** (eye-path → CTA, no competing CTAs).
     Bonus: page-speed signals if the tool returns them.
   - `form`: accept URL, screenshot, or pasted field list. URL →
     execute web-scrape slug. Identify form type (lead / contact /
     demo / application / survey / checkout — NOT signup, that's
     `write-page-copy` surface=signup-flow). Ask ONE question on
     business context if not clear (what happens to submissions,
     which fields get used in follow-up, compliance). Field-by-field:
     **Verdict** (keep / drop / defer / make-optional /
     compliance-required), **Reason**, **Label rewrite**
     (conversational, one question per field), **Input-type fix**
     (mobile keyboard, inline validation, smart defaults, email
     typo detection). Rewrite the value prop above the form. Name
     anti-patterns (cognitive-load, privacy-anxiety-no-trust,
     missing-value-prop, too-many-fields, poor-mobile-keyboard,
     error-shaming, captcha-above-submit, no-progress-signal).
     Replace "Submit" with action + outcome.
4. **Score + prioritize.** Tag every finding `{severity: critical /
   high / medium / low}` × `{effort: quick-win / medium / heavy}`.
   Surface top 5 critical-or-high quick-wins at the top. For
   `landing-page`, include the total score out of 21.
5. **Write** atomically to
   `audits/{surface}-{slug}-{YYYY-MM-DD}.md` (`*.tmp` → rename).
   Slug: for `site-seo` / `ai-search` use the domain; for
   `landing-page` / `form` use a kebab of the URL or form name.
   Structure: Executive summary → Top 5 quick wins / biggest leak →
   Findings by pass → Recommended 30-day plan (site-seo) /
   Prioritized fix list (landing-page, form) / GEO recommendations
   (ai-search).
6. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "audit", title, summary, path, status:
   "ready", createdAt, updatedAt }`.
7. **Summarize to user.** One paragraph with the top 5 quick-wins
   (or the single biggest fix) and the path.

## What I never do

- Invent findings, cite rates, or form field counts. Every claim
  ties to a real tool response or URL observation. Missing data →
  marked UNKNOWN or TBD.
- Promise a lift percentage — audits surface hypotheses.
- Drop a legally required form field (ask if uncertain).
- Hardcode tool names — Composio discovery at runtime only.

## Outputs

- `audits/{surface}-{slug}-{YYYY-MM-DD}.md`
- Appends an entry to `outputs.json` with type `audit`.
