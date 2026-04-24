---
name: draft-lifecycle-message
description: "Use when you say 'welcome series for new signups' / 'draft 30/60/90 renewal outreach' / 'expansion nudge for {account}' / 'save {account}' — I draft the `type` you pick: `welcome-series` day 0/1/3/7/14 · `renewal` day-90/60/30 sequence · `expansion-nudge` one outreach grounded in a ceiling signal · `churn-save` one save grounded in the risk signal. Writes to `onboarding/` · `renewals/` · `expansions/` · `saves/`. No guilt, no fake scarcity."
integrations:
  esp: [customerio, loops, mailchimp, kit]
  crm: [hubspot, attio]
  billing: [stripe]
---

# Draft Lifecycle Message

One skill for every customer-lifecycle outreach your success motion
needs. Branches on `type`.

## When to use

- **welcome-series** — "draft onboarding for {segment}" / "welcome
  series for new signups" / "activation drip."
- **renewal** — "renewal is coming for {account}" / "draft 30/60/90
  for {account}" / "pre-renewal outreach."
- **expansion-nudge** — "they're ready for {tier}" / "draft an
  expansion nudge for {account}" / "ceiling signal for {account}."
- **churn-save** — "save {account}" / "draft a save for {customer}"
  / "they asked to cancel."

## Ledger fields I read

- `universal.positioning` — to read `context/support-context.md`
  for product surface, voice, pricing stance.
- `universal.voice` — tone cues for every draft.
- `universal.icp.planTiers` — to know what "upgrade" or "downgrade"
  means for this account.
- `domains.success.planTiers`, `renewalCadence`, `churnSignals` —
  the operating map for this domain.

If any required field is missing, ask ONE targeted question with a
modality hint, write it, and continue.

## Parameter: `type`

- `welcome-series` — 5-touch sequence day 0 / 1 / 3 / 7 / 14 for
  new signups in `{segment}`. Each touch: subject, preview, body,
  CTA, success metric. Writes to `onboarding/{segment}.md`.
- `renewal` — 3-touch pre-renewal sequence (Day-90 / Day-60 /
  Day-30) for `{account}`, grounded in the account timeline. Each
  touch: subject, body, CTA, a specific win to reference. Writes to
  `renewals/{account}-{YYYY-MM-DD}.md`.
- `expansion-nudge` — ONE outreach for `{account}` grounded in a
  specific ceiling signal (feature-adoption threshold, team-size
  change, repeated ask). Writes to `expansions/{account}.md`.
- `churn-save` — ONE save message for `{account}` grounded in the
  exact risk signal from `churn-flags.json`, offering a genuine
  option (pause / downgrade / concierge / refund). Writes to
  `saves/{account}.md`.

## Steps

1. **Read `config/context-ledger.json` and `config/voice.md`.**
   Fill any gap with one targeted question.
2. **Read `context/support-context.md`.** If missing, stop and tell
   me to run `define-support-context` first.
3. **Branch on `type`:**
   - `welcome-series`: ask me for `{segment}` if not given, then
     draft 5 emails keyed to the product's activation milestones
     (check `domains.email.journey` if set, else ask me to name
     signup / activation / aha events).
     Format for the connected ESP (Customer.io / Loops / Mailchimp /
     Kit via Composio). Include success metrics per touch.
   - `renewal`: chain `customer-view view=timeline` for the
     account to pull wins, asks-shipped, friction. Draft Day-90
     (value recap), Day-60 (expansion opportunity or renewal
     mechanics), Day-30 (direct ask + agenda). Every reference must
     be grounded in the timeline artifact.
   - `expansion-nudge`: chain `customer-view view=health` to find
     the ceiling signal. Draft a short, specific outreach that
     names the signal ("I noticed you added 3 seats — {tier} would
     lift the per-seat cap") and proposes an option. No upsell
     pressure; if no real signal exists, stop and tell me.
   - `churn-save`: chain `customer-view view=churn-risk` to pull
     the exact flag. Acknowledge the risk honestly, name the
     specific pain, offer pause / downgrade / concierge / refund —
     whichever is policy in `context/support-context.md`. Never
     invent a discount I haven't pre-approved.
4. **Write the artifact** atomically to the path for this `type`.
5. **Append to `outputs.json`** with `type` =
   `onboarding-sequence` | `renewal-outreach` | `expansion-nudge` |
   `churn-save`, `domain: "success"`, title, summary, path,
   status `draft`.
6. **Summarize to me.** Headline: the one-line hook or subject, the
   specific signal it's grounded in, the recommended send window.

## Outputs

- `onboarding/{segment}.md` (for `type = welcome-series`)
- `renewals/{account}-{YYYY-MM-DD}.md` (for `type = renewal`)
- `expansions/{account}.md` (for `type = expansion-nudge`)
- `saves/{account}.md` (for `type = churn-save`)
- Appends to `outputs.json` with `domain: "success"`.

## What I never do

- Send. Every lifecycle message is a draft you review.
- Use guilt, fake scarcity, or dark patterns (especially in
  `churn-save` and `renewal`).
- Invent a discount, credit, or exception not in
  `context/support-context.md`.
- Draft an `expansion-nudge` without a real ceiling signal — if the
  data is thin, I stop and tell me.
