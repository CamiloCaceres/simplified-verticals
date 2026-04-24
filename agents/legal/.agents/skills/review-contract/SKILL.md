---
name: review-contract
description: "Use when you say 'review this MSA' / 'traffic-light this NDA' / 'extract the clauses' — I review the contract with `mode`: `full` clauses map + green/yellow/red + accept/redline/walk verdict · `nda-traffic-light` quick 7-dimension rubric with redlines on Red items · `clauses-only` structured extract with no verdict. Reads via Google Drive, Firecrawl, or paste. Writes to `contract-reviews/` · `ndas/` · `clause-extracts/` and updates `counterparty-tracker.json`."
integrations:
  files: [googledrive]
  docs: [googledocs]
  scrape: [firecrawl]
---

# Review Contract

One skill for every first-read of a counterparty contract. The
`mode` parameter picks depth; structured clause extraction and
"never invent a clause-standard I can't cite" discipline are shared.

## Parameter: `mode`

- `full` — full MSA / DPA / order-form review: clause map + Green
  (accept) / Yellow (pushback acceptable) / Red (redline required)
  verdict per clause + plain-English summary + accept / redline /
  walk recommendation. Writes to `contract-reviews/{counterparty}-{YYYY-MM-DD}.md`.
- `nda-traffic-light` — fast 6-dimension rubric for inbound NDAs
  (term, mutuality, confidential-info definition, carve-outs,
  jurisdiction, non-solicit smuggling, return/destruction). Writes
  to `ndas/{counterparty-slug}-{YYYY-MM-DD}.md` with specific
  redline suggestions on every Red item.
- `clauses-only` — structured extraction, no verdict. Reads a
  supplied contract (file / URL / paste), extracts the clauses that
  matter (term, termination, renewal, liability cap, indemnity, IP,
  governing law, DPA, AI training, data residency, exit rights),
  writes a human-readable map to `clause-extracts/{counterparty}-{YYYY-MM-DD}.md`,
  and updates `counterparty-tracker.json` with the key fields.

If the user names the mode in plain English ("traffic-light this",
"just extract the clauses", "full review with a verdict"), infer
it. If ambiguous, ask ONE question naming the 3 options.

## When to use

- Explicit: "review this contract", "traffic-light this NDA", "is
  this signable?", "what's in this agreement", "extract clauses".
- Implicit: called by `triage-legal-inbox` when it detects an MSA /
  NDA / DPA and routes to review. Chained into `plan-redline` when
  the output has any Red items.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `universal.legalContext` + `context/legal-context.md` — required.
  Provides entity (governing-law compatibility check), standing
  agreements (template-vs-market compare), open risks, founder risk
  posture. If `context/legal-context.md` is missing, I run the
  `define-legal-context` skill first (or ask ONE targeted question
  if you want to skip ahead).
- `universal.posture.risk` — drives Yellow-vs-Red threshold. `lean`
  posture accepts more Yellow, `conservative` flips marginal Yellow
  to Red.
- `domains.contracts.counterpartyStack` — if the counterparty is in
  the standing stack, reference prior executed terms.
- `domains.contracts.documentStorage` — so I know where to read the
  contract from (Google Drive, Dropbox, Notion).

If any required field is missing, ask ONE targeted question with a
modality hint (connect Google Drive / paste the contract text / URL
to a public PDF), write it, continue.

## Steps

1. **Read the ledger + legal context.** Gather missing required
   fields per above. Write atomically.
2. **Acquire the contract.** Priority: connected document-storage
   (Google Drive) > URL + Firecrawl scrape > file drop > paste. If
   only a PDF is supplied and no text-extraction tool is connected,
   say so and ask for a text-extractable version.
3. **Discover tools via Composio.** Run `composio search
   document-storage` / `composio search web-scrape` as needed. If no
   connection is available and the contract is a URL, ask the user
   to paste the text.
4. **Branch on `mode`.**
   - `full`: extract clause map (see `clauses-only` below), then
     grade each clause against market standard for a solo-founder
     stage company:
     - **Green** — accept as-written.
     - **Yellow** — pushback acceptable but not required.
     - **Red** — redline required before signing.
     Produce: executive summary (2-3 sentences), clause-by-clause
     table (Clause | Counterparty text | Verdict | Why | Suggested
     redline if Red), overall recommendation (Accept / Redline /
     Walk). If any clause is outside my confident range (unusual
     IP carve-out, complex indemnity stack, non-standard data-
     protection addendum) flag `attorneyReviewRequired: true` and
     recommend chaining to `draft-document` type=escalation-brief.
   - `nda-traffic-light`: run the 7-dimension rubric:
     1. **Term** (indefinite = Red, > 5 years = Yellow).
     2. **Mutuality** (one-way from the bigger party = Yellow, one-
        way from us = Green if we're the discloser, Red if not).
     3. **Confidential information definition** (too broad = Red,
        exclusion of publicly known info missing = Red).
     4. **Carve-outs** (residual-knowledge clause = Red, standard
        legal-process + independent-development = Green).
     5. **Jurisdiction** (counterparty's non-US state = Yellow,
        non-US country = Red, Delaware / California / NY = Green).
     6. **Non-solicit smuggling** (employee non-solicit hidden in
        NDA = Red; call it out explicitly).
     7. **Return/destruction** (missing = Yellow, 30-day
        certification requirement = Yellow, 5-day = Red).
     Write a specific redline for every Red item (not a generic
     "we'll send you our form"). Produce one-paragraph summary +
     verdict + redlines.
   - `clauses-only`: no verdict. Extract clause-by-clause:
     - Parties, effective date, term, auto-renewal, notice period.
     - Payment terms, fee schedule, tax handling.
     - Termination (for convenience, for cause, notice period).
     - Liability cap (per-claim / annual / unlimited / supercap).
     - Indemnity (mutual / one-way, carve-outs, process).
     - IP (work product, assignment, background IP, feedback).
     - DPA / data handling (transfer mechanism, subprocessors, SCCs).
     - AI training / data use (explicit opt-out, training rights).
     - Data residency, governing law, dispute forum, arbitration.
     - Exit rights (data return / destruction, transition window).
     - Assignment, change-of-control, flow-downs.
     Each clause: counterparty-text (quoted) + my plain-English
     paraphrase + "what to watch" one-liner (no verdict).
5. **Update `counterparty-tracker.json`** (for every mode) —
   read-merge-write atomically. Append or update the row for this
   counterparty with the extracted structural fields (type, term,
   auto-renewal, notice period, governing law, renewal date if
   computable).
6. **Write artifact atomically** (`*.tmp` → rename):
   - `full` → `contract-reviews/{counterparty-slug}-{YYYY-MM-DD}.md`.
   - `nda-traffic-light` → `ndas/{counterparty-slug}-{YYYY-MM-DD}.md`.
   - `clauses-only` → `clause-extracts/{counterparty-slug}-{YYYY-MM-DD}.md`.
7. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "contract-review" | "nda-review" |
   "clause-extract", title, summary, path, status: "ready", domain:
   "contracts", createdAt, updatedAt, attorneyReviewRequired? }`.
8. **Summarize to the user.** One paragraph with the overall verdict
   (or "extraction only — no verdict") and the path. If any clause
   was Red, recommend chaining to `plan-redline` next.

## What I never do

- Invent a clause standard I can't cite. If "market standard" for a
  term is unclear, mark UNKNOWN and recommend attorney review.
- Render final legal advice. Every `full` review includes the
  "this is a first pass, attorney review recommended for non-
  routine clauses" disclaimer.
- Signal a verdict on a clause I haven't actually extracted. If a
  DPA is referenced but not attached, mark the DPA section UNKNOWN.
- Hardcode tool names — Composio discovery at runtime only.
- Overwrite `counterparty-tracker.json` — read-merge-write.

## Outputs

- `contract-reviews/{counterparty}-{YYYY-MM-DD}.md` (mode=full).
- `ndas/{counterparty-slug}-{YYYY-MM-DD}.md` (mode=nda-traffic-light).
- `clause-extracts/{counterparty}-{YYYY-MM-DD}.md` (mode=clauses-only).
- Updates `counterparty-tracker.json` (every mode).
- Appends to `outputs.json`.
