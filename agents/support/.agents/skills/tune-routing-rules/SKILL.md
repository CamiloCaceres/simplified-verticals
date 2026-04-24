---
name: tune-routing-rules
description: "Use when you say 'update our routing' / 'what counts as a bug' / 'change where feature requests go' — I rewrite the routing section of `context/support-context.md` with concrete bug / feature / how-to / billing / churn examples so `triage-incoming` and `detect-signal` route correctly."
integrations:
  docs: [googledocs, notion]
---

# Tune Routing Rules

## When to use

- "update our routing" / "fix routing" / "what's a bug vs a feature
  request."
- "we moved to {tracker}" / "refunds now go to {person}" / "add a
  new tier."
- When `review scope=weekly` surfaces that classifications are
  drifting.

## Ledger fields I read

- `domains.inbox.routingCategories` — current category list.

## Steps

1. **Read `context/support-context.md`.** If missing, run
   `define-support-context` first.

2. **Surface the current rules to me.** Read the Routing
   rules section and restate it in 3–4 lines ("today: bug →
   Linear, feature request → `requests.json`, outage →
   `playbooks/p1-outage.md`, billing → Stripe + you approve
   refunds"). Ask: what's changing?

3. **Capture the update.** Ask ONE focused question at a time —
   don't do a whole interview. Typical updates:
   - New tracker target (moved from Linear to GitHub Issues, etc.).
   - New classification (e.g. add "security report").
   - New escalation contact.
   - Changed refund approver.
   - VIP list additions (also belongs in segments section — update
     both if needed).

4. **Rewrite the Routing rules section cleanly.** Preserve the
   decision-tree shape. For each type, state:
   - Trigger phrases / patterns that qualify.
   - Target location (tracker slug, playbook path, dossier, chat).
   - Which skill acts (`triage-incoming`, `detect-signal`,
     `draft-escalation-playbook`, etc.).
   - What data to capture.

5. **Also update related sections** if the change implies it —
   VIP list (segments section), SLA tiers, known-gotchas entries
   that reference the changed tracker. Be explicit about what else
   you touched.

6. **Write atomically** (`.tmp` → rename).

7. **Append to `outputs.json`** with `type: "routing-rules"`,
   `domain: "quality"`, title "Routing rules updated — {short
   reason}", summary 2 sentences on what changed, path
   `context/support-context.md`, status `draft`.

8. **Tell me the effect.** End the summary with: "Every
   `triage-incoming` and `detect-signal` run after this reads the
   new rules — no manual re-sync."

## Outputs

- `context/support-context.md` (routing + possibly related sections
  updated)
- Appends to `outputs.json` with `type: "routing-rules"`,
  `domain: "quality"`.
