---
name: write-article
description: "Use when you say 'turn this ticket into a KB article' / 'draft a known-issue page' / 'broadcast what we shipped' / 'refresh stale articles' — I produce the `type` you pick: `from-ticket` (KB article from a resolved thread) · `known-issue` (public status entry) · `broadcast-shipped` (per-customer 'you asked, we shipped' notes) · `refresh-stale` (flags + rewrites articles gone stale). Writes to `articles/` · `known-issues/` · `broadcasts/`."
integrations: [notion, googledocs, intercom, help_scout, github, linear]
---

# Write Article

One skill for every help-center writing ask. Branches on `type`.

## When to use

- **from-ticket** — "turn this ticket into an article" / "document
  this resolution" / "we answered the same question 3x — write it
  up." Called implicitly from `detect-signal signal=repeat-question`
  when a cluster hits ≥3 with no matching article.
- **known-issue** — "draft the known-issue doc for {bug}" / "we
  have a P1, put up a status page" / chained from
  `draft-escalation-playbook`.
- **broadcast-shipped** — "we just shipped X — tell the customers
  who asked" / "send the 'you asked, we shipped' note."
- **refresh-stale** — "refresh articles affected by this ship" /
  "audit docs — we changed pricing" / on the monthly help-center
  routine.

## Ledger fields I read

- `universal.positioning` — for voice, product surface, audience.
- `domains.help-center.platform` — to know which KB Composio slug
  to mirror to (Notion / Intercom / Help Scout / Google Docs).
- `domains.help-center.toneProfile` — preferred KB tone.

If any required field is missing, ask ONE targeted question with a
modality hint, write it, continue.

## Parameter: `type`

- `from-ticket` — article grounded in a resolved conversation.
  Pulls the thread, extracts the reusable answer, writes to
  `articles/{slug}.md`. Also mirrors to the connected KB platform
  if one's linked.
- `known-issue` — customer-facing status entry. Writes to
  `known-issues/{slug}.md` + appends to `known-issues.json` with
  `{id, title, affectedProduct, currentStatus, postedAt, updatedAt}`.
- `broadcast-shipped` — personalized "you asked, we shipped"
  drafts, one per customer in `requests.json` who asked for the
  thing just shipped. Writes to
  `broadcasts/{YYYY-MM-DD}-{slug}.md`.
- `refresh-stale` — scans `articles/` for references that are now
  wrong (pricing, UI, feature name), flags with `needsReview: true`
  in `outputs.json`, and drafts the update.

## Steps

1. **Read `context/support-context.md`.** If missing, stop.
2. **Read the ledger.** Fill gaps.
3. **Branch on `type`:**
   - `from-ticket`: ask me which `{conversation id}` to source
     from, or pick automatically from the cluster surfaced by
     `detect-signal signal=repeat-question`. Read
     `conversations/{id}/thread.json`. Extract question, answer,
     any screenshots or code references. Draft in the tone profile
     from `domains.help-center.toneProfile`.
   - `known-issue`: ask me for the bug id + title if not given.
     Read `bug-candidates.json` for details. Draft a status doc:
     what's broken, who's affected, workaround, current status,
     ETA (only if I pre-approved one). Append to
     `known-issues.json`.
   - `broadcast-shipped`: ask me what shipped (title + 1-sentence
     blurb). Read `requests.json` and filter to customers who asked
     for exactly this. Draft a short personal note per customer,
     referencing the specific ask. Never bulk-send — each draft is
     one file per customer in `broadcasts/`.
   - `refresh-stale`: ask me what changed (pricing / UI / feature
     name). Scan every `articles/{slug}.md` via grep for references
     to the changed element. For each hit, write the proposed
     rewrite diff, don't overwrite. Mark `needsReview: true` in
     `outputs.json`.
4. **Write the artifact** atomically.
5. **Append to `outputs.json`** with `type` =
   `kb-article` | `known-issue` | `broadcast` | `article-refresh`,
   `domain: "help-center"`, title, summary, path, status `draft`.
6. **Summarize to me**: the headline + what to review + where it
   should be published.

## Outputs

- `articles/{slug}.md` (for `type = from-ticket`, `refresh-stale`)
- `known-issues/{slug}.md` + `known-issues.json` entry (for
  `type = known-issue`)
- `broadcasts/{YYYY-MM-DD}-{slug}.md` (for `type = broadcast-shipped`)
- Appends to `outputs.json` with `domain: "help-center"`.

## What I never do

- Publish directly to the connected KB. I draft; you publish.
- Invent an ETA for `known-issue` — if engineering hasn't
  committed, I write "investigating."
- Use a generic template for `broadcast-shipped` — every note cites
  the specific request.
