---
name: synthesize-research
description: "Use when you say 'research {topic}' / 'I need a brief on {X}' — I run deep research via Exa (or your connected search provider), cite sources, and deliver a structured brief with 3–5 angles worth writing about. Writes to `research/{slug}.md` — hand to SEO for blog drafting or Growth for ad angles."
integrations:
  search: [exa, perplexityai]
  scrape: [firecrawl]
---

# Synthesize Research

Source template: Gumloop "AI Research Agent with Automated Report
Generation". Adapted to produce briefs shaped for hand-off to the
other four marketing agents, not 20-page investor memos.

## When to use

- "research {topic}" / "I need a brief on {topic}" / "what's the
  state of {topic}".
- "summarize what's happening in {category}".
- Called implicitly by other HoM skills (`plan-launch`,
  `track-competitors`, `profile-icp`) when they hit an evidence gap
  that needs a dedicated research run.

## Steps

1. **Clarify scope in one short exchange (skip if the user's prompt
   is already specific).** Ask:
   - Who is this brief for — you, or to hand to one of the other
     agents (SEO, Growth, Lifecycle, Social)?
   - What decision does it need to unblock?
   - Depth — 15-minute scan, 60-minute dive, or deep?

2. **Read positioning doc** (own file):
   `context/marketing-context.md`. Ground the brief in our ICP and
   category — generic internet research is not a brief.

3. **Discover research tools at runtime.** Do NOT hardcode tool
   names. Run `composio search research`, `composio search
   web-search`, `composio search web-scrape` and pick the best
   connected slug for each step. If nothing is connected, tell the
   user which category to link (e.g. "connect a web-search
   provider — Integrations tab") and stop.

4. **Run the research in layers.** Log sources as you go — the
   final brief needs citations:
   1. **Landscape scan** — who the players are, category
      terminology, top 5-10 authoritative sources.
   2. **Evidence drill** — fetch the top sources, extract claims,
      quotes, data points. Cite URL + fetch timestamp per claim.
   3. **Contradiction check** — where do sources disagree? Name
      both sides; don't average them into mush.
   4. **Relevance filter** — which findings actually matter for
      OUR ICP / OUR positioning / the decision at hand? Cut the
      rest.

5. **Structure the brief (markdown, ~500-900 words for a standard
   depth).**

   1. **The question** — one sentence.
   2. **TL;DR** — 3-5 bullets the user can act on today.
   3. **Key findings** — numbered. Each finding: the claim, the
      evidence (cite), the implication for us.
   4. **Where sources disagree** — short section. Don't hide it.
   5. **What we don't know** — explicit gaps. Mark `UNKNOWN` + the
      kind of source that would resolve it.
   6. **Recommended next moves** — tagged by agent. Example:
      `[seo-content] Target cluster "{keyword}" — 8 of 10 top-
      ranking pages are thin.`
   7. **Sources** — URL + title + fetch timestamp.

6. **Never invent.** No synthesized "it seems likely that…"
   statements without a cited source. If the research is thin, say
   so and stop there — bad briefs cost more than no brief.

7. **Write atomically** to `research/{topic-slug}.md` —
   `{path}.tmp` then rename. `{topic-slug}` is kebab-case of the
   topic (e.g. `research/geo-audits-category.md`).

8. **Append to `outputs.json`.** Read-merge-write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "research",
     "title": "<Topic>",
     "summary": "<2-3 sentences — the TL;DR>",
     "path": "research/<slug>.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

9. **Summarize to user.** One paragraph: the question, TL;DR in one
   line, the 1 move to make next, path to the brief.

## Outputs

- `research/{topic-slug}.md`
- Appends to `outputs.json` with `type: "research"`.
