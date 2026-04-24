---
name: customer-view
description: "Use when you say 'who is {customer}' / 'show me the full timeline for {account}' / 'score health for {account}' / 'churn risk on {account}' — I produce the `view` you pick: `dossier` (plan + history + open items) · `timeline` (chronological story) · `health` (GREEN / YELLOW / RED with 3 signals) · `churn-risk` (signal + severity + recommendation). Writes to `dossiers/` · `timelines/` · `health-scores.json` · `churn-flags.json`."
integrations: [stripe, hubspot, attio, salesforce, gmail, intercom, posthog]
---

# Customer View

One skill for every "tell me about this customer" ask your support
motion needs. Branches on `view`.

## When to use

- **dossier** — "who is this customer?" / "tell me about {account}"
  / implicitly before `draft-reply` runs.
- **timeline** — "show me the full timeline for {account}" /
  "history on {customer}" / implicitly before `review scope=qbr` or
  `draft-lifecycle-message type=renewal`.
- **health** — "score health for {account}" / "how's {customer}
  doing" / "run health."
- **churn-risk** — "churn risk on {account}" / "scan for churn
  risk" / "is this customer at risk?"

## Ledger fields I read

- `universal.icp.planTiers` — to weight signals per tier.
- `domains.inbox.channels` — to know where conversation history
  lives.
- `domains.success.churnSignals` — the operating definition of
  "at-risk" for this company.

If any required field is missing, ask ONE targeted question with a
modality hint, write it, continue.

## Parameter: `view`

- `dossier` — profile + plan + MRR (via connected Stripe) + open
  bug-candidates + open followups + last 3 conversations. Writes to
  `dossiers/{slug}.md`.
- `timeline` — chronological rollup of every interaction (ticket,
  call, purchase, plan change, NPS). Writes to
  `timelines/{slug}.md`.
- `health` — GREEN / YELLOW / RED with the 3 driving signals, the
  reasoning, and ONE recommended action. Writes an entry to
  `health-scores.json` (and a prose version at
  `dossiers/{slug}-health.md` if I ask for it).
- `churn-risk` — open risk flag with signal (cancellation language,
  repeated friction, usage cliff), severity, and recommended
  action. Writes an entry to `churn-flags.json`.

## Steps

1. **Resolve `{account}` or `{slug}`.** If I gave the customer name,
   look up in `customers.json` by name / email / domain. If no
   match, ask me for the CRM identifier (HubSpot / Attio /
   Salesforce via Composio) or paste the profile.
2. **Read `config/context-ledger.json`.** Fill any gap.
3. **Branch on `view`:**
   - `dossier`: read the CRM record + `customers.json` + filter
     `conversations.json` to this customer + check
     `bug-candidates.json`, `followups.json`, `churn-flags.json`.
     Pull MRR / plan from connected Stripe. Write
     `dossiers/{slug}.md`.
   - `timeline`: same reads as `dossier` but also pull every
     conversation, plan change, invoice, NPS from connected
     Stripe + CRM. Sort chronologically. Write
     `timelines/{slug}.md`.
   - `health`: compute 3 signals (e.g. last-30-day ticket volume,
     recent product-usage trend via PostHog, sentiment of last 3
     interactions). Apply thresholds from
     `domains.success.churnSignals` (ask me to define if not set).
     Output GREEN / YELLOW / RED + one action. Write to
     `health-scores.json` (read-merge-write).
   - `churn-risk`: scan last 60 days of conversations for
     cancellation language, 2+ frustration signals, or a usage
     cliff. If found, write a new entry to `churn-flags.json` with
     signal + severity + recommended next move.
4. **Append to `outputs.json`** with appropriate `type`:
   `dossier` | `timeline` | `health-score` | `churn-risk`,
   `domain: "inbox"`, title, summary, path.
5. **Summarize to me** concisely: the headline (plan + status) +
   the single most useful next move.

## Outputs

- `dossiers/{slug}.md` (for `view = dossier`)
- `timelines/{slug}.md` (for `view = timeline`)
- `health-scores.json` entry (for `view = health`)
- `churn-flags.json` entry (for `view = churn-risk`)
- Appends to `outputs.json` with `domain: "inbox"`.

## What I never do

- Surface a health score or churn flag I can't ground in data from
  `conversations.json`, Stripe, or the CRM — I mark UNKNOWN and
  ask.
- Invent plan / MRR / usage numbers when the connection is missing.
