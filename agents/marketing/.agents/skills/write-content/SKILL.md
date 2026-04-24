---
name: write-content
description: "Use when you say 'draft a blog post' / 'LinkedIn post' / 'X thread' / 'newsletter' / 'Reddit reply' — I write channel-native copy in your voice, grounded in your positioning. Pick a `channel`: `blog` (2,000–3,000 words, mirrored to Google Docs) · `linkedin` (hook-first native post) · `x-thread` (5–12 tweets) · `newsletter` (one through-line) · `reddit` (value-first reply). Drafts only — you always post."
integrations:
  docs: [googledocs]
  social: [linkedin, twitter]
  esp: [mailchimp]
  scrape: [firecrawl]
---

# Write Content

Channel-native drafting behind one skill. The `channel` parameter picks
the shape; the core drafting discipline — positioning, voice, no
invented stats, drafts only — is shared across all channels.

## Parameter: `channel`

- `blog` — 2,000-3,000 word SEO-aware post → `blog-posts/{slug}.md`.
- `linkedin` — hook-first native post → `posts/linkedin-{slug}.md`.
- `x-thread` — 5-12 tweet thread → `threads/x-{slug}.md`.
- `newsletter` — subject + preview + body with one through-line →
  `newsletters/{YYYY-MM-DD}.md`.
- `reddit` — value-first community reply (pulls source thread via
  Composio/Firecrawl) → `community-replies/{source-slug}.md`.

If the user names the channel in plain English ("X thread", "Reddit
reply", "this week's newsletter"), infer it. If ambiguous, ask ONE
question naming the 5 options.

## When to use

- Explicit: "draft a {blog post / LinkedIn post / X thread /
  newsletter / Reddit reply} on {topic}", "write me a post about {X}",
  "respond to this thread at {URL}".
- Implicit: called by `plan-campaign` (launch / announcement) to
  generate channel-specific pieces, or by `monitor-competitors`
  (social-feed) on a flagged high-signal thread.

## Ledger fields I read

Reads `config/context-ledger.json` first. Required for every channel:

- `company` — name, pitch30s, stage.
- `voice` — summary + sampleCount; if missing, ask ONE question
  (modality: Composio-connected LinkedIn / inbox > paste 2-3 samples).
- `positioning` — from `context/marketing-context.md`. If missing,
  ask: "want me to draft your positioning first? (one skill, ~5m)"
  and stop.

Additionally by channel:

- `linkedin` | `x-thread` | `reddit` → `domains.social.platforms`,
  `domains.social.topics`.
- `newsletter` → `domains.email.platform` (so the summary tells the
  user which platform to paste into).

Missing field → ask ONE targeted question, write atomically
(`.tmp` → rename), continue. Never re-ask.

## Steps

1. **Read ledger + positioning.** Load `config/context-ledger.json`
   and `context/marketing-context.md`. Gather missing required fields
   per the list above (ONE question each, best-modality first).
2. **Resolve channel + topic.** Confirm the parameter. If the topic
   isn't explicit, ask ONE question: "What's the angle / hook /
   target keyword?"
3. **Research pass (channel-scaled).**
   - `blog` — run `composio search seo` / `composio search web` to
     pull top 5-10 SERP results for the target keyword; extract angle
     gaps and expected structure.
   - `linkedin` | `x-thread` — optional, `composio search web` for
     1-3 grounding facts. Skip for pure story/opinion.
   - `newsletter` — pull source material (paste, user links, recent
     `blog-posts/` entries indexed in `outputs.json`). If nothing,
     ask: "What happened this week worth an email?"
   - `reddit` — run `composio search web-scrape` (or
     `composio search reddit`), fetch the thread URL, pull OP + top
     3-5 comments. If scrape fails, ask the user to paste.
4. **Assess value (reddit only).** One sentence: "do we genuinely have
   something to add here?" If no, say so and stop. No filler replies.
5. **Draft to the channel shape.**
   - `blog` — H1 (keyword-forward, human) → intro (hook + promise +
     TOC) → H2/H3s covering SERP demand + one contrarian section tied
     to positioning → inline internal-link suggestions → one CTA from
     positioning → meta description (≤155 chars) → slug (kebab-case)
     → image brief (alt text + 2-3 ideas).
   - `linkedin` — line 1 hook (4-10 words, contrarian / specific
     number) → whitespace, short lines → one clear takeaway →
     3-6 short paragraphs → CTA or question → 0-3 specific hashtags.
   - `x-thread` — tweet 1 is the scroll-stopping hook (≤280 chars,
     no emoji fluff) → 4-10 numbered progression tweets (each a beat,
     ≤280) → final CTA tweet (follow / reply / link). X runs punchier
     than LinkedIn.
   - `newsletter` — pick ONE through-line (if you can't state it in
     one sentence, ask the user to pick the headline) → subject
     (≤60 chars, specific) → preview (50-90 chars) → body of 3-5
     short sections serving the through-line → one primary CTA.
     Plain-text-first, cite source URLs inline.
   - `reddit` — acknowledge OP's specific question (1 line) →
     concrete value 2-4 short paragraphs (framework, number, gotcha,
     step-by-step, counter-take) → optional soft mention only if
     directly relevant, after the value, name not link → no
     signatures. Register shifts toward community casual.
6. **Voice match.** Every channel respects `voice`-ledger fields
   (formality, emoji habit, sentence length). If voice sample is
   flat, default to direct + warm.
7. **Write atomically** to the channel path (`*.tmp` → rename). Slug
   = kebab(first-5-hook-words) unless another rule above applies.
   File front-matter: `type`, `channel`, `topic`, plus channel-
   specific fields (blog: title/slug/metaDescription/targetKeyword/
   wordCount; newsletter: throughLine/sources; reddit: source URL
   + subreddit + OP quote).
8. **Blog bonus (`channel: blog` only).** If `googledocs` is
   connected, run `composio search googledocs` → execute the
   create-doc tool to mirror the draft there and include the URL in
   the summary.
9. **Append to `outputs.json`** at the agent root. Read-merge-write
   atomically: `{ id (uuid v4), type: "blog-post" | "linkedin-post"
   | "x-thread" | "newsletter" | "community-reply", title, summary,
   path, status: "draft", createdAt, updatedAt }`.
10. **Summarize to user.** One paragraph naming the hook / through-
    line / value add + the path. Remind: "Review, edit, post it
    yourself."

## What I never do

- Publish / post / send on your behalf. Drafts only.
- Invent stats, customer quotes, or sources. Every citable claim
  has a URL or is marked TBD.
- Guess positioning or voice. Read the ledger + positioning file or
  ask.
- Hardcode tool names. Composio discovery at runtime only.

## Outputs

- `blog-posts/{slug}.md` | `posts/linkedin-{slug}.md` |
  `threads/x-{slug}.md` | `newsletters/{YYYY-MM-DD}.md` |
  `community-replies/{source-slug}.md`.
- Appends an entry to `outputs.json` with the corresponding `type`.
