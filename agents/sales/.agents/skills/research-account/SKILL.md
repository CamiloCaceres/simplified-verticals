---
name: research-account
description: "Use when you say 'research {Acme}' / 'enrich {person}' / 'qualify {url}' / 'warm intros into {Acme}' — I run the `depth` you pick: `quick-qualify` (30-second in-ICP yes/no via Firecrawl) · `full-brief` (site scrape + 12 weeks of news via Exa + tech-stack + socials — one cited brief) · `enrich-contact` (firmographics + recent signals for a named person) · `warm-paths` (first-degree intros via LinkedIn + your CRM). Every claim cites a source. Writes to `accounts/{slug}/` or `leads/{slug}/`."
integrations: [exa, perplexityai, firecrawl, hubspot, salesforce, attio, linkedin]
---

# Research Account

One skill for four research shapes. The `depth` parameter picks the
pass; source-citation and "never invent a fact" discipline are shared.

## Parameter: `depth`

- `quick-qualify` — 30-second read of a single URL. One scrape, one
  decision (IN-ICP / BORDER / OUT), one angle if IN. For fast triage,
  not a brief.
- `full-brief` — multi-pass cited brief on a named account: site
  scrape, recent news (12 weeks), tech-stack detection, social scan,
  intent signals. The input that feeds outreach + call prep.
- `enrich-contact` — a named person: firmographics, role context,
  reporting line if discoverable, recent posts / talks, and any
  trigger signals. For outreach personalization.
- `warm-paths` — first-degree intros: search your connected
  LinkedIn / Gmail / CRM for people who know someone at the target.
  Rank paths by strength.

If the user's ask implies the depth ("just give me a quick read",
"go deep", "enrich this person", "who do I know there"), infer.
Otherwise ask ONE question naming the 4 options.

## When to use

- Explicit triggers listed in the description.
- Implicit: inside `draft-outreach stage=cold-email` (the cold email
  needs a signal — this skill finds it) and `prep-meeting type=call`
  (a call needs a brief).

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `playbook` — from `context/sales-context.md`. Required for all
  depths (ICP grounds quick-qualify; differentiators ground
  full-brief framing).
- `universal.icp` — explicit industry / roles / disqualifiers drive
  the quick-qualify decision.
- `domains.crm.slug` — `warm-paths` pulls first-degree connections
  from the connected CRM + LinkedIn. Ask ONE question if missing.

## Steps

1. **Read ledger + playbook.** Gather missing required fields (ONE
   question each, best-modality first). Write atomically.

2. **Discover tools via Composio.** `composio search web-scrape` /
   `composio search search-research` / `composio search crm` /
   `composio search linkedin` as the depth dictates. If no tool for a
   required category is connected, name the category to link and
   stop.

3. **Branch on depth.**
   - `quick-qualify`: scrape the URL (one request). Extract: what they
     do, who they sell to, team size signal, tech stack signal. Apply
     the playbook's disqualifiers. Output: **IN-ICP** / **BORDER** /
     **OUT** + one-sentence reason + one angle (the single pain from
     the playbook that best matches them). Save a tight
     `leads/{slug}/qualify-{YYYY-MM-DD}.md` (~150 words max).
   - `full-brief`: run the scrape, search the last 12 weeks of news
     (funding, hires, product launches, leadership changes), detect
     tech stack (BuiltWith-style signals via scrape), scan company
     LinkedIn posts. Structure the brief: **Snapshot** (one paragraph)
     → **Recent signals** (5-8 bullets, each cited with URL + date) →
     **Tech stack** (5-10 signals) → **Buying committee guesses**
     (pull from LinkedIn when available) → **Angles for outreach**
     (3 angles ranked, each tied to a cited signal). Save to
     `accounts/{slug}/brief-{YYYY-MM-DD}.md`.
   - `enrich-contact`: search for the person via LinkedIn + any
     connected CRM / email enrichment. Capture: title, company,
     tenure, prior companies, visible posts / talks / podcasts in the
     last 6 months, any trigger signal (new role, speaker, press).
     Save to `leads/{slug}/enrichment-{YYYY-MM-DD}.md`.
   - `warm-paths`: via LinkedIn (Composio), find first-degree
     connections at the target company. Cross-reference your CRM for
     any mutual-customer or mutual-investor paths. Rank paths:
     **Strong** (close connection, recent touch), **Medium** (weak
     tie, stale), **Weak** (third-degree only). Draft the intro ask
     per strong path. Save to `leads/{slug}/warm-paths-{YYYY-MM-DD}.md`.

4. **Cite every claim.** No uncited facts. Any claim without a URL
   or CRM field reference gets marked `(hypothesis — verify)`.

5. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "account-brief" | "contact-enrichment" |
   "warm-paths" | "lead-batch" (for quick-qualify), title, summary,
   path, status: "ready", createdAt, updatedAt, domain: "outbound" }`.

6. **Summarize to user.** The top finding + the path. Suggest the
   next skill ("`draft-outreach stage=cold-email` using angle #1?" or
   "`prep-meeting type=call` if this turns into a meeting?").

## What I never do

- Invent news, funding, hires, tech-stack facts, or connections.
  Every claim cites a source.
- Scrape private data — LinkedIn public profile, company website,
  public news only.
- Enrich a contact's personal life beyond their professional
  footprint.

## Outputs

- `quick-qualify` → `leads/{slug}/qualify-{YYYY-MM-DD}.md`
- `full-brief` → `accounts/{slug}/brief-{YYYY-MM-DD}.md`
- `enrich-contact` → `leads/{slug}/enrichment-{YYYY-MM-DD}.md`
- `warm-paths` → `leads/{slug}/warm-paths-{YYYY-MM-DD}.md`
- Appends to `outputs.json`.
