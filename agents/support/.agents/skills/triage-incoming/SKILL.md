---
name: triage-incoming
description: "Use when a new inbound message arrives via your connected inbox (Gmail / Outlook / Intercom / Help Scout / Zendesk / Slack) and has not yet been triaged — I categorize it against the routing rules in `context/support-context.md`, assign priority from customer tier + content signals, VIP-flag, and write to `conversations.json` + `conversations/{id}/thread.json` so `draft-reply` can take over."
integrations:
  inbox: [gmail, outlook]
  helpdesk: [intercom, help_scout, zendesk]
  messaging: [slack]
---

# Triage Incoming

## When to use
A new inbound message has landed and no `conversations.json` entry exists for its thread yet, OR an existing entry needs re-triage because the content materially changed (e.g. a how-to turned into an outage report). For the solo founder, triage happens constantly — every fresh reply that arrives needs this skill run before anything else.

## Steps
0. **Read `context/support-context.md`.** If missing, stop and
   tell me to run `define-support-context` first. Read the
   routing rules + SLA tiers + VIP list from this doc — never
   hardcode them.
1. **Identify the source** — you name the channel or the message is
   referenced by external id. Use `composio search <channel>` to
   find the correct fetch slug (e.g. Gmail thread fetch, Intercom
   conversation fetch). Do NOT hardcode tool slugs.
2. **Fetch the raw thread** via Composio. Pull subject, all
   messages, sender email, external message ids.
3. **Resolve the customer.** Look up `customers.json` by sender
   email. If not found, create a new index entry (slug =
   kebab-cased email local-part, deduped if needed).
4. **Categorize** the content against the routing categories in
   `context/support-context.md` (typical set: `bug | how-to |
   feature | billing | account | security | other`). Content
   signals: error messages and stack traces lean bug; "how do I…"
   leans how-to; "can you add…" leans feature; keywords like
   "refund", "invoice", "charge" lean billing.
5. **Assign priority (P1–P4)** using the tier thresholds from
   `context/support-context.md`. Typical starting rules: MRR >=
   $500/mo → base P2; VIP tag → P1 floor. Escalate on content:
   "down", "can't log in", "data loss", "production" → bump one
   level (max P1). De-escalate on "whenever you get a chance".
6. **Set SLA fields** using
   `domains.inbox.slaTargets.firstResponseHours` (fallback to the
   tier table in the context doc). `breached = false` initially.
7. **Write atomically.** Upsert into `conversations.json`. Write
   full messages to `conversations/{id}/thread.json`.
8. **Append to `outputs.json`** with `type: "triage"`,
   `domain: "inbox"`, title = `{customer} — {subject}`, summary =
   category + priority, path.

## Outputs
- Writes to `conversations.json` (index upsert)
- Writes to `conversations/{id}/thread.json` (full thread)
- Writes to `customers.json` (new customer row if needed)
- Appends to `outputs.json` with `type: "triage"`,
  `domain: "inbox"`.
