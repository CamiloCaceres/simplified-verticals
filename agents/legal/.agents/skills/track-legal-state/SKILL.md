---
name: track-legal-state
description: "Use when you say 'where are my signatures' / 'log this executed agreement' / 'what's due soon' / 'Monday legal review' — I track the `scope` you pick: `signatures` watches your signing platform (DocuSign / PandaDoc / HelloSign) for outstanding docs and drafts reminders · `counterparties` logs executed agreements to `counterparty-tracker.json` · `deadlines` refreshes the canonical calendar (Delaware March 1, 83(b) 30-day, 409A 12-month, DSR 30/45-day) · `weekly-review` rolls up what shipped this week."
integrations: [docusign, pandadoc, dropbox_sign, googledrive, gmail]
---

# Track Legal State

One skill for every standing-state tracker this agent maintains.
The `scope` parameter picks the tracker; atomic read-merge-write
discipline is shared.

## Parameter: `scope`

- `signatures` — watch the connected signing platform (DocuSign /
  PandaDoc / HelloSign) for outstanding documents. Draft polite
  reminders for laggards (never sends). File executed copies to
  the connected document-storage (Google Drive / Dropbox / Notion).
  Writes status board to `signature-status/{YYYY-MM-DD}.md`.
- `counterparties` — append an executed agreement to
  `counterparty-tracker.json` at agent root. Fields: `id`,
  `counterparty`, `agreementType`, `executedDate`, `effectiveDate`,
  `term`, `autoRenewal`, `noticePeriod`, `governingLaw`,
  `keyObligations`, `renewalDate`, `signedCopyPath`. Feeds the
  `deadlines` scope (renewal clock) and `weekly-review` scope
  (rollup).
- `deadlines` — seed + refresh the canonical legal calendar. Static
  deadlines (Delaware March 1 annual report, 83(b) 30-day from
  grant, 409A refresh 12 months, DSR 30-day GDPR / 45-day CCPA,
  TM office action 6-month, annual board consent) + dynamic
  deadlines from `counterparty-tracker.json` (renewal clocks,
  notice windows). Writes `deadline-calendar.json` at agent root +
  a 90-day readout to `deadline-summaries/{YYYY-MM-DD}.md`. Flags
  anything ≤ 30 days urgent and overdue as critical.
- `weekly-review` — aggregate across this agent by reading
  `outputs.json`: what shipped this week (contract reviews, drafts,
  audits, filings), what's pending signature (from
  `signature-status/` most recent), next deadline (from
  `deadline-calendar.json`), what's flagged for attorney review
  (`attorneyReviewRequired: true` entries without resolution).
  Writes `weekly-reviews/{YYYY-MM-DD}.md`.

If the user names the scope in plain English ("chase signatures",
"log this deal", "what's due", "Monday review"), infer it. If
ambiguous, ask ONE question naming the 4 options.

## When to use

- Explicit: "where are my signatures", "log {counterparty}'s
  executed {type}", "what's due soon / overdue", "Monday legal
  review", "weekly legal readout".
- Implicit: chained from `review-contract` (any mode) to
  `counterparties` when the contract hits executed status; from
  scheduled routines for `weekly-review` and `deadlines`; from
  `triage-legal-inbox` when it detects an executed-copy attachment
  for `counterparties`.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `universal.legalContext` + `context/legal-context.md` —
  recommended but not required. Enriches `weekly-review` with
  standing context. If missing and `weekly-review` is the scope,
  run the `define-legal-context` skill or proceed with a note.
- `universal.entity` — required for `deadlines` (formation date
  gates Delaware March 1 relevance; 409A date sets the 12-month
  clock).
- `domains.contracts.signingPlatform` — required for `signatures`.
  If missing, ask ONE question — connect DocuSign / PandaDoc /
  HelloSign or paste status.
- `domains.contracts.documentStorage` — required for `signatures`
  (where to file executed copies) and for `counterparties` (where
  the signed copy lives — `signedCopyPath`).
- `counterparty-tracker.json` — required for `counterparties`
  (read-merge-write) and `deadlines` (source of dynamic renewal
  clocks) and `weekly-review` (new logs this week).
- `deadline-calendar.json` — required for `deadlines` (baseline to
  diff against) and `weekly-review` (next-deadline surface).
- `outputs.json` — required for `weekly-review` (that's the roll-up
  source).

If any required field is missing, ask ONE targeted question with
the right modality hint, write it, continue.

## Steps

1. **Read ledger + state files.** Gather missing required fields
   per above. Write atomically.
2. **Discover tools via Composio.** `composio search
   signing-platform` (signatures), `composio search
   document-storage` (signatures + counterparties). No discovery
   needed for `deadlines` or `weekly-review` (pure file ops).
3. **Branch on `scope`.**
   - `signatures`:
     1. Execute the signing-platform slug — list outstanding
        envelopes. For each: recipient, sent date, days open,
        last-viewed status.
     2. Draft a polite reminder per laggard (> 5 days open). Never
        sends — drafts go into the status board for the founder to
        send.
     3. For executed envelopes, fetch the PDF via the signing-
        platform slug. Execute the document-storage slug to save
        to a well-known path (`contracts/executed/{counterparty}-{YYYY-MM-DD}.pdf`).
     4. Write `signature-status/{YYYY-MM-DD}.md` — three sections:
        Outstanding (+ reminders) / Recently executed (+ paths) /
        Stalled (> 14 days open — recommend outreach or withdraw).
        For each executed envelope, recommend chaining to
        `track-legal-state` scope=counterparties to log.
   - `counterparties`:
     1. Take input: counterparty name, agreement type, executed
        date, effective date, term, auto-renewal, notice period,
        governing law, key obligations (brief), signed-copy path.
        Ask ONE question for any missing field.
     2. Compute `renewalDate` from `effectiveDate + term -
        noticePeriod` (the critical date = when notice must be
        given to avoid auto-renewal).
     3. Read-merge-write `counterparty-tracker.json` atomically.
        Do not overwrite existing rows — `id` is stable; update-in-
        place on a match.
     4. Append to `outputs.json` as `type: "counterparty-log"`.
   - `deadlines`:
     1. Start from the canonical static deadline set:
        - **Delaware annual report** — March 1 every year (gate on
          `universal.entity.state === "DE"`).
        - **83(b) election window** — 30 days from each option
          grant / founder-stock restricted-purchase. Source:
          `outputs.json` entries for recent grants.
        - **409A refresh** — 12 months from
          `universal.entity.four09aDate`.
        - **DSR response window** — 30 days (GDPR Art. 15) / 45
          days (CCPA); track from any `dsr-response` entry in
          `outputs.json`.
        - **TM office action response** — 6 months from each
          office action; gate on `domains.ip.marks`.
        - **Annual board consent** — 365 days from last board
          consent.
     2. Enrich with dynamic deadlines from
        `counterparty-tracker.json` — for each open row, compute
        `renewalDate` and a notice-deadline (= `renewalDate -
        noticePeriod`).
     3. Read-merge-write `deadline-calendar.json`: `id`, `kind`,
        `label`, `due`, `source`, `authority`, `urgency` (critical
        if overdue or ≤ 30 days; high ≤ 90 days; medium ≤ 180 days;
        low > 180 days).
     4. Write `deadline-summaries/{YYYY-MM-DD}.md` — 90-day
        readout: Critical + High first; for each, cite the
        authority (e.g. "8 Del. C. §503", "IRC §83(b)", "GDPR Art.
        15").
     5. Append to `outputs.json` as `type: "deadline-summary"`.
   - `weekly-review`:
     1. Read `outputs.json`. Filter to entries with `createdAt` or
        `updatedAt` within the last 7 days.
     2. Group by `domain` (contracts / compliance / entity / ip /
        advisory). For each: what shipped, titles + paths.
     3. Read the most recent `signature-status/` — surface
        outstanding signatures + stalled.
     4. Read `deadline-calendar.json` — next 3 deadlines by
        urgency.
     5. Surface any `attorneyReviewRequired: true` entries that
        don't yet have an `escalation-brief` follow-up.
     6. Write `weekly-reviews/{YYYY-MM-DD}.md` — sections: What
        shipped (by domain) / Pending signature / Next 3 deadlines
        / Attorney-review backlog / Recommended next moves.
     7. Append to `outputs.json` as `type: "weekly-review"`.
4. **Atomic writes everywhere** (`*.tmp` → rename).
5. **Summarize.** One paragraph — top signal from this scope + the
   path.

## What I never do

- Send reminders, request signatures, or file executed copies
  anywhere outside the configured document-storage. Every "sendable"
  artifact is a draft in the status board.
- Invent a counterparty, a term, or a deadline. If a field isn't
  in the input or the source file, mark UNKNOWN / TBD and ask ONE
  targeted question.
- Promise an auto-renewal won't fire — the dates I cite are
  mechanical; the founder decides to send notice.
- Overwrite `counterparty-tracker.json` or `deadline-calendar.json`
  — read-merge-write always.
- Cite a statutory deadline without naming the authority (GDPR
  Art. 15, IRC §83(b), 8 Del. C. §503, etc.).
- Hardcode tool names — Composio discovery at runtime only.

## Outputs

- `signature-status/{YYYY-MM-DD}.md` (scope=signatures).
- Updates `counterparty-tracker.json` (scope=counterparties).
- `deadline-summaries/{YYYY-MM-DD}.md` + updates
  `deadline-calendar.json` (scope=deadlines).
- `weekly-reviews/{YYYY-MM-DD}.md` (scope=weekly-review).
- Appends to `outputs.json`.
