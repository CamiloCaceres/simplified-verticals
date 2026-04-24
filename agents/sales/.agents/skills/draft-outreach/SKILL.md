---
name: draft-outreach
description: "Use when you say 'draft a cold email to {Acme}' / 'cold-call script' / 'follow up on today's call' / 'reply to this inbound' / 'renewal note' / 'save email for downgrade' — I draft the `stage` you pick: `cold-email`, `cold-script`, `followup`, `inbound-reply`, `renewal`, or `churn-save`. Voice-matched to your samples. Writes to `outreach/{stage}-{slug}-{date}.md`."
integrations:
  inbox: [gmail, outlook]
  crm: [hubspot, salesforce, attio]
  meetings: [gong, fireflies]
  billing: [stripe]
---

# Draft Outreach

One skill for every outreach surface. The `stage` parameter picks the
shape; voice-matching, honest proof, and "never invent a quote"
discipline are shared.

## Parameter: `stage`

- `cold-email` — grounded first-touch email (3 short paragraphs max):
  cited trigger signal → specific pain → one-line ask. Replaces any
  generic "who handles X" email.
- `cold-script` — 60-90s cold-call script: opener, pattern-interrupt,
  2 discovery questions, soft CTA, and a landmine to avoid.
- `followup` — post-call recap + confirmed next step email, in your
  voice. Pulls the call analysis from `calls/{slug}/`.
- `inbound-reply` — classify the inbound as `interested` /
  `asking-question` / `objection` / `not-now` / `unsubscribe`, then
  draft the right reply. Flags spam / wrong-person cleanly.
- `renewal` — bundle outcomes shipped, expansion levers, and the
  pricing reasoning into a renewal draft. Never commits pricing
  outside the playbook.
- `churn-save` — non-defensive save that names the specific signal
  (downgrade, usage drop, support escalation), offers one concrete
  remedy, proposes a dated next step. No guilt tactics, no fake
  scarcity.

If the user names the stage in plain English ("cold email", "call
script", "follow up", "reply", "renewal note", "save email"), infer
it. If ambiguous, ask ONE question naming the 6 options.

## When to use

- Explicit: any of the trigger phrases in the description.
- Implicit: inside `analyze subject=discovery-call` (the analysis ends
  with a drafted followup), inside `score subject=customer-health`
  (red → churn-save), inside `manage-crm action=route` (interested
  inbound → cold-email or followup).

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `playbook` — from `context/sales-context.md`. Required for all
  stages (objection handbook, pricing stance, primary first-call
  goal, competitors, ICP). If missing: "want me to draft your
  playbook first? (`define-playbook`, ~5m)" and stop.
- `universal.voice` — tone summary + samples. If missing, ask ONE
  question ("connect your inbox via Integrations and I'll sample
  your last 30 sent messages — or paste 3-5 emails you wrote").
  Required for `cold-email`, `followup`, `inbound-reply`, `renewal`,
  `churn-save`.
- `universal.icp` — pains + triggers ground `cold-email` and
  `cold-script`.
- `domains.crm.slug` — used to pull deal context (owner, stage, last
  touch) for `followup`, `renewal`, `churn-save`. Ask ONE question if
  missing: "Which CRM — HubSpot, Salesforce, Attio, Pipedrive, Close?
  Or paste the deal context."
- `domains.retention.billing` — `churn-save` uses the downgrade /
  cancel signal from Stripe if available.

## Steps

1. **Read ledger + playbook.** Gather missing required fields per
   above (ONE question each, best-modality first). Write atomically.

2. **Branch on stage.**
   - `cold-email`: run a fresh signal search (recent news, job
     openings, funding, product launch) via Composio-discovered
     scrape / search slugs. Pick the SINGLE strongest signal. Open
     with that specific signal in line 1 (not "hope this finds you
     well"). Draft 3 short paragraphs: signal → specific pain (from
     playbook, grounded in ICP) → one-line ask. Subject line cites
     the signal. Max 110 words body. Save to
     `outreach/email-{lead-slug}-{YYYY-MM-DD}.md`.
   - `cold-script`: dossier from `leads/{slug}/` (or ask for it).
     Structure: **Opener** (15s, reason for call), **Pattern-
     interrupt** (one specific observation unique to them),
     **Discovery** (2 questions matched to the weakest qualification
     pillar for their segment from the playbook), **Soft CTA**
     (calendar link, 15m next week), **Landmine to avoid** (one
     thing from `call-insights/` flagged as a loss pattern). Save to
     `outreach/script-{lead-slug}-{YYYY-MM-DD}.md`.
   - `followup`: read the latest `calls/{deal-slug}/notes-*.md` and
     `analysis-*.md`. Subject: "Re: {their pain, in their words}".
     Body: confirm we heard them → 2-3 bullets answering the stated
     objection / open question → next step with a specific date.
     Match voice. Save to
     `deals/{deal-slug}/followup-{YYYY-MM-DD}.md` AND mirror to
     `outreach/email-{deal-slug}-{date}.md` for the outreach index.
   - `inbound-reply`: read the pasted or Composio-pulled reply.
     Classify (interested / asking-question / objection / not-now /
     unsubscribe / spam). For `interested`, draft a booking reply
     with 2-3 slot suggestions (pull from Google Calendar if
     connected). For `asking-question`, answer inline if playbook
     covers it; else flag for user. For `objection`, chain into
     `handle-objection`. For `not-now`, draft a polite "circle back
     in {N} weeks" note. For `unsubscribe` / `spam`, queue the right
     CRM action via `manage-crm action=queue-followup` and stop.
     Save to `outreach/inbound-reply-{lead-slug}-{YYYY-MM-DD}.md`.
   - `renewal`: read `customers/{slug}/` history (onboarding plan,
     QBRs, health scores). Structure: outcomes shipped (with
     numbers from the playbook's success-metric definition) →
     expansion levers (feature-request patterns, team growth
     signal) → pricing reasoning (from playbook — never commit). End
     with a dated next step. Save to
     `customers/{slug}/renewal-{YYYY-MM-DD}.md`.
   - `churn-save`: read the downgrade / cancel / usage-drop signal
     (from Stripe via Composio, or pasted). Structure: name the
     specific signal verbatim → one concrete remedy (pause,
     downgrade further, concierge help, refund — the genuine option
     that matches the signal, not all four) → proposed dated next
     step. No guilt tactics, no fake scarcity. Save to
     `customers/{slug}/save-{YYYY-MM-DD}.md`.

3. **Voice check.** Before finalizing, compare against
   `config/voice.md`: sentence length, greeting habit, closing habit,
   forbidden phrases. Rewrite offending lines.

4. **Sanity-check against the playbook.** Any claim about pricing,
   timelines, or anchor accounts must match `context/sales-context.md`.
   No commitments outside the pricing stance. No fabricated customer
   names.

5. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "outreach", title: "{Stage} — {target}",
   summary: "<subject line + next step>", path, status: "draft",
   createdAt, updatedAt, domain: "<outbound | inbound | retention>"}`.
   Domain: `cold-email` + `cold-script` → `outbound`; `inbound-reply`
   → `inbound`; `followup` → `meetings`; `renewal` + `churn-save` →
   `retention`.

6. **Summarize to user.** Subject line + next step inline. Path to
   full draft. Explicit: "I never send — copy from the file or open
   your inbox to send."

## What I never do

- Send, post, or schedule. Every draft stays in a file until you
  copy it.
- Invent a customer quote, a metric, or a competitor claim. If the
  source is thin, mark `TBD — {what to bring}` and ask.
- Commit pricing outside the playbook's pricing stance — surface
  any exception with `FLAG: needs approval`.
- Use guilt, fake scarcity, or dark patterns in `churn-save` /
  `renewal`.
- Hardcode tool names — Composio discovery at runtime only.

## Outputs

- `outreach/{channel}-{slug}-{YYYY-MM-DD}.md` where `channel` =
  `email` (cold-email, followup, inbound-reply) / `script`
  (cold-script).
- For `followup`: mirrors into `deals/{slug}/followup-{date}.md`.
- For `renewal` / `churn-save`: writes to `customers/{slug}/`.
- Appends to `outputs.json` with `type: "outreach"`.
