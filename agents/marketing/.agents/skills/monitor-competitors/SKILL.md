---
name: monitor-competitors
description: Use when the user says "track competitors / what ads is {X} running / scan my feed" — I pull competitor signal via Composio (firecrawl / metaads / linkedin / twitter / reddit / instagram), compare to your positioning, and flag real threats + opportunities. Writes to `competitor-briefs/{source}-{slug-or-date}.md` — a ranked teardown, not a news aggregator.
integrations: [firecrawl, metaads, linkedin, twitter, reddit, instagram]
---

# Monitor Competitors

One skill for three signal sources. The `source` parameter picks the
probe; positioning-grounded judgment + "never invent quotes" are
shared.

## Parameter: `source`

- `product` — blog + release notes + homepage / pricing via
  Firecrawl; single-competitor teardown OR N-competitor weekly
  digest.
- `ads` — Meta Ad Library + LinkedIn Ad Library + Google Ads
  Transparency Center via Composio scrape; extract angles, hooks,
  audiences, and what's new this week.
- `social-feed` — timeline / subreddit / mentions filtered for
  topical relevance + engagement opportunity (LinkedIn / X / Reddit /
  Instagram).

If the user names the source in plain English ("competitor teardown",
"what ads is Ramp running", "scan my X timeline"), infer it. If
ambiguous, ask ONE question naming the 3 options.

## When to use

- Explicit: "weekly competitor pulse", "teardown of {X}", "what ads
  is {Y} running", "scan my timeline", "Reddit signal in
  {subreddit}", "IG mentions".
- Implicit: after a `plan-campaign` (paid / launch) when competitor
  positioning could affect angles; before `write-content`
  channel=reddit to surface the exact threads worth replying to.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `positioning` — required for all sources. Competitor list comes
  from here; threat/opportunity judgment references our
  differentiators. If missing: "want me to draft your positioning
  first? (one skill, ~5m)" and stop.
- `icp` — roles, pains, triggers (used to filter signal relevance).
- `domains.social.platforms`, `domains.social.topics` — required
  for `social-feed`. Ask ONE question if missing.

## Steps

1. **Read ledger + positioning.** Extract the named competitor list
   + our differentiators + top 2-3 ICP objections. Gather missing
   required fields (ONE question each).
2. **Determine mode + target list.**
   - `product`: user named one → teardown; user said "weekly pulse"
     or multiple → digest (default to top 3 from positioning).
   - `ads`: user named one → that competitor; else top 3 from
     positioning. Also check prior `competitor-briefs/` for deltas.
   - `social-feed`: parse user request — "my timeline" → X, "my
     LinkedIn feed" → LinkedIn, "{subreddit}" → Reddit, "IG
     mentions" → Instagram. Default to primary platform from
     `domains.social.platforms`. Window: last 24-48h capped at ~50
     posts unless user specifies.
3. **Discover tools via Composio.** Run the appropriate
   `composio search` calls:
   - `product` → `web-scrape` (homepage / blog / changelog),
     `web-search` (news / funding), optionally `seo-intel`,
     optionally `ad-intel`.
   - `ads` → ad-library / ad-intelligence tools (Meta Ad Library,
     LinkedIn Ad Library, Google Ads Transparency) + `web-scrape`
     as fallback.
   - `social-feed` → the platform's read-feed / top-posts / mentions
     tool.
   If a needed category isn't connected, note it in the brief
   ("no ad-intel connection — ad activity: UNKNOWN") and continue,
   or (for social-feed where the source IS the platform) name the
   category to link and stop.
4. **Branch on source.**
   - `product` (last 7 days for digest, last 30 for teardown):
     per competitor gather **site / messaging** (homepage hero,
     changed copy), **product / changelog** (new features, pricing
     shifts), **content** (recent blog, podcasts, newsletters),
     **SEO** (ranking gains / losses on positioning-relevant
     keywords, if connected), **social / news** (funding, hires,
     launches). Compare against our positioning — for each signal
     ask: does it threaten OUR differentiators? Open a gap WE should
     attack? Cite verbatim side-by-side (competitor vs our
     positioning-doc copy).
   - `ads`: for each ad pulled extract platform + format, headline
     + primary text (verbatim), CTA, inferred audience, inferred
     angle (pain / status / urgency / social-proof / feature-led /
     price-led), estimated run duration. Synthesize: dominant
     angle(s), pains named (verbatim), differentiators claimed,
     creative format mix, deltas vs. prior pulls.
   - `social-feed`: for each post judge **Topical relevance**
     (does it touch `domains.social.topics`? high / medium / none),
     **Engagement opportunity** (can we add real value —
     substantive disagree, sharp question, specific experience? or
     is a like enough?), **Risk** (flag political / personal /
     off-brand). Keep 5-10 high-value posts. Draft suggested 1-3
     sentence replies for the top 3-5 in voice from ledger.
5. **Opportunity callouts.** For each source, surface concrete moves:
   - `product` → recommended moves tagged with the in-agent skill
     that executes them (e.g. `[write-content:blog]`,
     `[plan-campaign:paid]`, `[write-page-copy:landing]`).
   - `ads` → angles they're missing that our positioning owns,
     claims to counter on our landing page, creative patterns to
     test (hand to `plan-campaign:paid` or content generation).
   - `social-feed` → "also worth a like" shortlist + the top-1 post
     to reply to first.
6. **Write** atomically to:
   - `product` teardown: `competitor-briefs/product-{competitor-slug}-{YYYY-MM-DD}.md`
   - `product` digest: `competitor-briefs/product-weekly-{YYYY-MM-DD}.md`
   - `ads`: `competitor-briefs/ads-{competitor-slug}-{YYYY-MM-DD}.md`
   - `social-feed`: `competitor-briefs/social-feed-{platform}-{YYYY-MM-DD}.md`
   Every claim ties to URL + timestamp or is marked UNKNOWN.
7. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "competitor-brief", title, summary, path,
   status: "draft", createdAt, updatedAt }`.
8. **Summarize to user.** One paragraph:
   - `product` → biggest threat + biggest opportunity + 1 move this
     week + path.
   - `ads` → dominant angle they're pushing + one opportunity for us
     + path.
   - `social-feed` → N high-signal posts + the top one + path.

## What I never do

- Invent ad headlines, competitor quotes, post counts, or
  engagement stats. Every verbatim claim ties to a real pull. If a
  tool returned nothing, say so.
- Reply / post / DM on your behalf. Drafts only.
- Hardcode tool names. Composio discovery at runtime only.

## Outputs

- `competitor-briefs/{source}-{slug-or-date}.md`
- Appends an entry to `outputs.json` with type `competitor-brief`.
