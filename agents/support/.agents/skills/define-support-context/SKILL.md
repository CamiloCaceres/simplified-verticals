---
name: define-support-context
description: "Use when you say 'set up our support context' / 'update the support doc' — I interview you and write `context/support-context.md` (product surface, voice, SLA tiers, VIP list, routing rules, known gotchas). Every other skill reads this doc first — it's the source of truth for tone, escalation, and routing."
integrations: [googledocs, notion]
---

# Define Support Context

I own `context/support-context.md`. This is the only skill that
creates or updates the full doc (the routing section can also be
edited by `tune-routing-rules`). Every other skill in this agent
reads it before substantive work — until it exists, they stop and
ask you to run me first.

## When to use

- "set up our support context" / "define our support context" /
  "let's do the context doc".
- "update the context doc" / "a new tier / VIP / gotcha — fix the
  context".
- Called implicitly by any other skill that needs context and finds
  the doc missing — but only after confirming with you.

## Steps

1. **Read `config/context-ledger.json`.** I need
   `universal.company`, `universal.icp`,
   `domains.inbox.slaTargets`, `domains.inbox.routingCategories`,
   `domains.quality.escalationTiers`. For any missing field, ask
   ONE targeted question with a modality hint (connected app > file
   > URL > paste), write it atomically, continue.

2. **Read the existing doc if present.** If `context/support-context.md`
   exists, read it so this run is an update, not a rewrite. Preserve
   anything you have sharpened; change only what's stale or
   new.

3. **Push for verbatim language.** Before drafting, ask you
   for 2–3 verbatim customer phrases or example tickets — the
   friction words, the repeat gotchas. If `voice-samples/` has
   entries, mine those first.

4. **Draft the doc (~400–700 words, opinionated, direct).**
   Structure, in this order:

   1. **Product overview** — one paragraph: what the product is, who
      it's for, key surface areas (features/flows), pricing model,
      self-serve vs gated.
   2. **Customer segments + VIP list** — named segments + VIP
      accounts. VIPs get P1 regardless of content.
   3. **Tone + voice** — default tone (direct / warm / human), 3–5
      verbatim samples pulled from `voice-samples/` if present
      (otherwise `TBD — run voice-calibration`), forbidden phrases.
   4. **SLA tiers** — P1 / P2 / P3 / P4 definitions + response-time
      expectations per tier. Name what qualifies as each tier.
   5. **Routing rules** — decision tree:
      - Bug → tracker target (Linear / GitHub — from config or
        ask); what info to capture (repro, version, customer).
      - Feature request → `requests.json`, with
        customer attribution.
      - Outage → playbook reference (`playbooks/p1-outage.md` once
        drafted).
      - Billing → Stripe dossier + refund approver (founder by
        default).
   6. **Known gotchas** — short whisper-list of product quirks
      answered 10+ times. 3–10 bullets.

5. **Mark gaps honestly.** If a section is thin, write
   `TBD — {what you should bring next}`. Never invent.

6. **Write atomically.** Write to `context/support-context.md.tmp`,
   then rename to `context/support-context.md`. Single file under
   `context/` — NOT under `.agents/` or `.houston/` (watcher skips).

7. **Append to `outputs.json`.** Read existing array, append a new
   entry (`type: "support-context"`, `domain: "quality"`, title
   summarizing what changed), write atomically.

8. **Summarize to me.** One paragraph: what you wrote, what's
   still `TBD`, the next move ("next: run `voice-calibration`" /
   "next: tell me which tracker you use for bugs"). Remind me that
   every other skill can now operate against this doc.

## Outputs

- `context/support-context.md` (at the agent root — live document)
- Appends to `outputs.json` with `type: "context-edit"`.
