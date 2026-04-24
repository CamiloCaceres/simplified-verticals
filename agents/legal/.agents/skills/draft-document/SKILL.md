---
name: draft-document
description: "Use when you say 'draft an NDA' / 'draft our privacy policy' / 'respond to this DSR' / 'package an escalation brief' — I draft the `type` you pick: `nda` · `consulting` · `offer-letter` · `msa` · `order-form` · `board-consent` · `privacy-policy` · `tos` · `dsr-response` · `escalation-brief`. Reads your template library via Google Drive (or uses market boilerplate with a caveat). Writes to `drafts/{type}/` or the policy-specific folder. Drafts only — I never send, file, or request signature."
integrations: [googledocs, notion, googledrive, firecrawl]
---

# Draft Document

One skill for every first-draft the founder needs. The `type`
parameter picks the template + structure + citations; "drafts only,
never send / file / sign" discipline is shared.

## Parameter: `type`

**Commercial paper (reads your template library first):**

- `nda` — bilateral or one-way NDA anchored on your template.
- `consulting` — consulting / contractor agreement anchored on
  CIIAA + deliverables + term.
- `offer-letter` — employee offer letter anchored on 409A +
  compensation + vesting + at-will language.
- `msa` — customer-facing master services agreement.
- `order-form` — order form tied to an existing MSA.
- `board-consent` — written board consent (routine actions:
  officer appointment, option grant, 409A adoption, bank
  resolutions).

**Privacy / policy:**

- `privacy-policy` — full Privacy Policy with AI-training
  disclosure, SCCs, subprocessor list, legal-basis citations.
- `tos` — Terms of Service (usage, IP, acceptable use, liability
  cap, dispute forum).

**Regulatory response:**

- `dsr-response` — GDPR Art. 15 / CCPA DSR first-touch packet:
  acknowledgment + identity-verification request + export cover
  note (3 files).

**Escalation:**

- `escalation-brief` — structured brief for outside counsel: 2-3
  sentence matter summary, specific questions for the lawyer,
  quoted excerpts with cite, deadline, recommended firm type
  (corporate / commercial lit / privacy / IP / employment). Never
  names specific firms.

If the user names the type in plain English ("draft the NDA with
Acme", "write our privacy policy", "package this for counsel"),
infer it. If ambiguous, ask ONE question naming the 10 options
grouped by bucket.

## When to use

- Explicit: "draft {type}", "write our privacy policy", "respond
  to this DSR", "escalate this to counsel".
- Implicit: chained from `review-contract` when the output
  recommends a counter-draft (type picked by contract type); from
  `audit-compliance` (scope=privacy-posture) when the audit says
  the policy is stale; from `plan-redline` when a redline needs
  specific clause text drafted.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `universal.legalContext` + `context/legal-context.md` — required
  for every type (entity, cap table, standing agreements, template
  stack, open risks, risk posture). If missing, I run the
  `define-legal-context` skill first (or ask ONE targeted question
  if you want to skip ahead).
- `universal.company` — name, stage (used for language calibration
  across all types).
- `universal.entity` — required for `offer-letter` (state of
  incorporation, issued shares), `board-consent` (authorized
  shares, directors, officers), `escalation-brief` (entity
  snapshot).
- `domains.contracts.templateLibrary` — if pointing to a template
  set, anchor the draft there. If missing for commercial types,
  ask ONE question — paste the template URL, connect Google Drive,
  or proceed from market-standard boilerplate with a "no template
  found, using market-standard boilerplate" caveat stamped on the
  draft.
- `domains.compliance.landingPageUrl` — required for
  `privacy-policy` and `tos` (Firecrawl scrape to infer product
  surface, data collection, analytics).
- `domains.compliance.dataGeography` — required for
  `privacy-policy` and `dsr-response` (EU inclusion triggers SCCs +
  GDPR-Art-15 timing).
- `subprocessor-inventory.json` — required for `privacy-policy`
  (vendor list + DPA status).
- `universal.posture.escalationThreshold` — required for
  `escalation-brief` (frames the "why we need counsel" framing).

## Steps

1. **Read the ledger + legal context.** Gather missing required
   fields per above. Write atomically.
2. **Discover tools via Composio** only when the type needs one:
   `googledocs` / `notion` for mirror-copy (optional),
   `googledrive` for reading the template library,
   `firecrawl` for landing-page scrape (privacy-policy, tos).
3. **Branch on `type`.**
   - `nda` / `consulting` / `offer-letter` / `msa` / `order-form` /
     `board-consent`: load the matching template from the library
     (or use market-standard boilerplate with a caveat stamp).
     Collect the variables (counterparty, dates, commercials,
     candidate name, grant size, vesting cliff — whichever apply).
     Substitute variables. Produce the draft with a top comment-
     block listing (a) the variables substituted and (b) any
     variables that need founder confirmation. If comp structure
     (offer-letter) or share math (board-consent) is non-standard,
     flag `attorneyReviewRequired: true`.
   - `privacy-policy` / `tos`: scrape the landing page via
     Firecrawl, cross-reference `subprocessor-inventory.json`,
     identify data-collection surfaces (forms, analytics, cookies,
     payment), pick the right sections (Collection / Use /
     Disclosure / Retention / Rights / Transfers / Security /
     Changes / Contact for privacy; Usage / Account / IP /
     Acceptable-Use / Payment / Termination / Warranty / Liability
     / Disputes for ToS). Cite GDPR articles for EU-inclusive
     geography, CCPA/CPRA for US. AI-training disclosure is
     explicit (opt-in or opt-out, state it). Produce sectioned
     markdown draft.
   - `dsr-response`: compute the statutory clock (GDPR Art. 15 →
     30 days, CCPA → 45 days). Produce three files:
     `acknowledgment.md` (received, clock start, expected
     turnaround — no commitments beyond the statutory timeline),
     `identity-verification.md` (what we need to confirm it's them),
     `export-cover-note.md` (template cover note; the actual data
     export is out of scope — the founder runs the export). If the
     clock is already < 7 days from statutory deadline, flag
     `attorneyReviewRequired: true`. Write as a folder
     `dsr-responses/{request-id}-{YYYY-MM-DD}/`.
   - `escalation-brief`: structured brief in this order —
     (1) Matter in 2-3 sentences, (2) Specific questions for the
     lawyer (numbered, scoped), (3) Deadline + why, (4) Quoted
     excerpts with cite (contract clause, email thread, statute),
     (5) Entity snapshot from `universal.entity`, (6) Recommended
     firm type (corporate / commercial lit / privacy / IP /
     employment — no firm names), (7) What we'd accept as an
     outcome.
4. **Write the draft atomically** (`*.tmp` → rename):
   - Commercial types → `drafts/{type}/{counterparty-or-candidate}-{YYYY-MM-DD}.md`.
   - `privacy-policy` → `privacy-drafts/privacy-policy-{YYYY-MM-DD}.md`.
   - `tos` → `privacy-drafts/tos-{YYYY-MM-DD}.md`.
   - `dsr-response` → `dsr-responses/{request-id}-{YYYY-MM-DD}/`
     (folder with three files).
   - `escalation-brief` → `escalations/{matter-slug}-{YYYY-MM-DD}.md`.
5. **Optional Google Docs mirror.** If `googledocs` is connected,
   offer to mirror the draft (skill discovers slug at runtime, user
   confirms, mirror is created with a link back in the artifact
   footer).
6. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id, type: "draft" | "privacy-policy" | "tos-draft" |
   "dsr-response" | "escalation-brief", title, summary, path,
   status: "draft", domain: "contracts" (commercial) | "compliance"
   (privacy/dsr) | "entity" (board-consent) | "advisory"
   (escalation-brief), createdAt, updatedAt, attorneyReviewRequired? }`.
7. **Summarize.** One paragraph — what was drafted, path, and
   whether `attorneyReviewRequired` is set.

## What I never do

- Send, file, post, or request signature on any draft. The founder
  delivers, publishes, or packages-for-counsel. Every artifact
  opens with a one-line "DRAFT — NOT FOR SIGNATURE / NOT FOR
  PUBLISH" stamp.
- Invent a clause, statute, or precedent I can't cite.
- Name specific law firms in `escalation-brief`. Firm type only.
- Make timeline commitments in `dsr-response` beyond the statutory
  clock — the dates I cite are statutory, not promises.
- Hardcode tool names — Composio discovery at runtime only.
- Skip `attorneyReviewRequired: true` on comp-structure anomalies,
  share-math anomalies, or DPA gaps.

## Outputs

- `drafts/{type}/{slug}-{YYYY-MM-DD}.md` (commercial types).
- `privacy-drafts/privacy-policy-{YYYY-MM-DD}.md` / `tos-{YYYY-MM-DD}.md`.
- `dsr-responses/{request-id}-{YYYY-MM-DD}/` (3-file folder).
- `escalations/{matter-slug}-{YYYY-MM-DD}.md`.
- Appends to `outputs.json`.
