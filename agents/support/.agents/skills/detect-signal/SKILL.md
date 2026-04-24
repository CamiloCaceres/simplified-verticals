---
name: detect-signal
description: "Use when a message looks like a bug / feature ask / repeat question — I extract the `signal` you name: `bug` (repro + severity, writes `bug-candidates.json`) · `feature-request` (ask + requesting-customer slug, writes `requests.json`) · `repeat-question` (cluster ≥3 similar asks without a matching KB article, writes `patterns.json`). Chains to `write-article type=from-ticket` for repeat-question hits."
integrations:
  inbox: [gmail]
  helpdesk: [intercom, help_scout, zendesk]
  dev: [github, linear, jira]
---

# Detect Signal

One skill for every "this thread contains a signal I should file"
ask. Branches on `signal`.

## When to use

- **bug** — "is this a bug? log it" / a message contains error
  messages, stack traces, "it used to work and now doesn't," repro
  steps, or screenshots of broken UI.
- **feature-request** — a conversation or direct message contains
  a feature ask ("can you add X?", "would be great if Y").
- **repeat-question** — on the weekly cron, or when I scan the
  last 30–60 days and a cluster of semantically similar incoming
  questions hits ≥3 with no matching article.

## Ledger fields I read

- `universal.positioning` — for product surface (so I know what's
  in-scope vs out-of-scope).
- `domains.inbox.routingCategories` — for the bug / feature-request
  classification rules.
- `domains.help-center.platform` — to check for existing KB
  coverage before flagging a repeat-question cluster.

If any required field is missing, ask ONE targeted question, write,
continue.

## Parameter: `signal`

- `bug` — extract repro steps, affected version, affected customer.
  Assign severity per `context/support-context.md#severity`. Append
  to `bug-candidates.json`. Offer to chain to the connected tracker
  (GitHub / Linear / Jira via Composio).
- `feature-request` — extract the ask + requesting-customer slug.
  Append / merge in `requests.json`. If merging, increment
  requester count; if merging a VIP, flag.
- `repeat-question` — scan the last 30–60 days of
  `conversations.json`. Cluster semantically similar incoming
  questions. For each cluster of ≥3 without a matching article,
  append to `patterns.json` and surface as a docs gap.

## Steps

1. **Read `context/support-context.md`.** If missing, stop.
2. **Read the ledger.** Fill gaps.
3. **Branch on `signal`:**
   - `bug`: read the source `conversations/{id}/thread.json`.
     Extract repro (numbered steps), affected version, error
     message / stack trace. Assign severity. Write a new entry to
     `bug-candidates.json` (read-merge-write) with
     `{id, title, severity, affectedCustomers, reproSteps,
     sourceConversationId, status: "new"}`. If I say so, chain to
     the connected tracker by calling its create-issue tool.
   - `feature-request`: read the source message. Extract the ask
     in a single sentence. Look for near-duplicates in
     `requests.json`; if found, append the customer slug and
     increment. If new, create an entry. Never attribute a request
     to a customer who didn't make it.
   - `repeat-question`: read `conversations.json` last 30–60 days.
     Cluster by topic / first-line similarity. For each cluster
     ≥3, check `articles/` for an existing answer. If none, append
     a new pattern to `patterns.json` with `{cluster, exampleIds,
     count, suggestedTitle}`. Offer to chain `write-article
     type=from-ticket` for my top pick.
4. **Append to `outputs.json`** with `type` =
   `bug-candidate` | `feature-request` | `repeat-question`,
   `domain: "inbox"` (for bug / feature-request) or
   `domain: "help-center"` (for repeat-question), title, summary,
   path.
5. **Summarize to me**: what I filed + where it is + the chain I'd
   recommend next.

## Outputs

- `bug-candidates.json` entry (for `signal = bug`)
- `requests.json` entry (for `signal = feature-request`)
- `patterns.json` entry (for `signal = repeat-question`)
- Appends to `outputs.json`.

## What I never do

- File a bug in the connected tracker without your approval. I
  draft the issue; you create it.
- Attribute a feature request to a customer who didn't ask for it.
- Flag a repeat-question cluster that already has an article — I
  check `articles/` first.
