---
name: gap-surface
description: "Use when you say 'what should I write docs for?' or on the weekly help-center cron — I rank open docs gaps from `patterns.json` by impact (volume × customer tier), return the top 3 with source ticket ids, and offer to chain into `write-article type=from-ticket` for any you pick. Writes to `gaps/{YYYY-MM-DD}.md`."
---

# Gap Surface

## When to use

- You ask: "what should I write docs for?", "what gaps do we have?", "what's missing from the help center?".
- Weekly cadence — usually paired with or before `review scope=help-center-digest`.
- After `detect-signal signal=repeat-question` finds new clusters worth reviewing.

## Ledger fields I read

- `domains.help-center.platform` — to check whether existing
  articles already cover a candidate gap before I rank it.

If any required field is missing, ask ONE targeted question with a
modality hint, write it, continue.

## Steps

1. Read `patterns.json` (clusters of repeat questions) and
   `articles/` (existing KB). Filter patterns without a matching
   article.
2. If the list is empty, run `detect-signal signal=repeat-question`
   first (or tell me it just ran and there's nothing yet).
3. Rank each open gap by an impact score:
   - `occurrenceCount` — primary signal (how often it's asked)
   - **Customer value** — for each `sourceTicketId`, look up the
     customer in `customers.json` and weight by plan tier / MRR if
     present (fallback: equal weight)
   - **Freshness** — recent occurrences beat stale ones; heavily
     penalize gaps with no hits in last 14 days
4. Present the top 3 gaps to me in chat:
   ```
   1. "How do I reset my API key?" — 7 occurrences, 3 paying customers, latest 2 days ago
      Source tickets: t_abc, t_def, t_ghi
   2. ...
   3. ...
   ```
5. Ask: "Want me to draft articles for any of these? Reply with the numbers (e.g. '1 and 3')."
6. For each number I pick, pick a representative source ticket
   (most recent, or the one with the clearest resolution) and chain
   to `write-article type=from-ticket`.
7. Write a snapshot of the ranking to `gaps/{YYYY-MM-DD}.md` and
   append an entry to `outputs.json` with `type: "docs-gap"`,
   `domain: "help-center"`.
8. When a gap is promoted to an article, refresh the `patterns.json`
   entry with `relatedArticleSlug` so it won't re-surface.

## Outputs

- `gaps/{YYYY-MM-DD}.md` (ranked list of the top 3)
- Updates `patterns.json` (relatedArticleSlug on promotion)
- May chain to `write-article type=from-ticket` (one call per
  accepted gap)
- Appends to `outputs.json` with `type: "docs-gap"`,
  `domain: "help-center"`.
