---
name: audit-compliance
description: "Use when you say 'audit my privacy' / 'update my subprocessor list' / 'what's stale in my templates' — I audit the `scope` you pick: `privacy-posture` scrapes landing + product via Firecrawl and cross-checks your deployed Privacy Policy for drift · `subprocessors` walks your integrations + landing-page for new vendors and refreshes the inventory · `template-library` flags templates > 12 months old against current law (AI-training, SCC versions, 2026 DPA standards). Surfaces diffs only — never auto-fixes."
integrations:
  scrape: [firecrawl]
  files: [googledrive]
  docs: [googledocs]
---

# Audit Compliance

One skill for every standing-state compliance check. The `scope`
parameter picks which inventory to walk; "diffs not fixes" and
"every finding cites its authority" discipline are shared.

## Parameter: `scope`

- `privacy-posture` — scrape the landing page + product via
  Firecrawl, cross-check against the deployed Privacy Policy, flag
  drift (new analytics tool undisclosed, subprocessor added without
  policy update, new cookie, purpose drift) with severity and
  recommended update. Writes to `privacy-audits/{YYYY-MM-DD}.md`.
- `subprocessors` — walk connected integrations + inferred vendors
  from the landing-page scrape, capture role + data categories +
  transfer mechanism + DPA status + public DPA URL. Read-merge-write
  to `subprocessor-inventory.json` at agent root + produce a
  one-page delta report at `subprocessor-reviews/{YYYY-MM-DD}.md`.
- `template-library` — read `domains.contracts.templateLibrary`,
  flag templates > 12 months old, check each against current law
  references (AI-training disclosure, SCC versions, 2026 DPA
  standards, CA/EU rights expansions). Writes a refresh plan to
  `template-reviews/{YYYY-MM-DD}.md`. Never auto-rewrites — founder
  approves each change and kicks `draft-document` for the rewrite.

If the user names the scope in plain English ("audit my privacy",
"refresh templates", "update subprocessor list"), infer it. If
ambiguous, ask ONE question naming the 3 options.

## When to use

- Explicit: "audit my privacy posture", "update my subprocessor
  list", "refresh my template library", "what's drifted", "what's
  stale".
- Implicit: on scheduled monthly cadence (privacy-posture,
  subprocessors); when any new vendor is added (subprocessors);
  when a new landing-page surface ships (privacy-posture); when the
  template library is referenced older than 12 months in any other
  skill (template-library).

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `universal.legalContext` + `context/legal-context.md` — required.
  Provides entity snapshot, risk posture, existing template stack
  (anchor for template-library scope). If missing, I run the
  `define-legal-context` skill first (or ask ONE targeted question
  if you want to skip ahead).
- `universal.company.website` — required for `privacy-posture` +
  `subprocessors` (landing-page URL for Firecrawl).
- `domains.compliance.landingPageUrl` — more specific than
  `universal.company.website` if they differ; falls back to the
  website.
- `domains.compliance.deployedPolicies.privacyPolicyUrl` — required
  for `privacy-posture` (the doc to diff against).
- `domains.compliance.dataGeography` — gates whether EU-specific
  subprocessor controls (SCCs, transfer mechanism) apply.
- `domains.contracts.templateLibrary` — required for
  `template-library`.
- `subprocessor-inventory.json` — required for `subprocessors`
  (prior inventory = baseline for delta).

If any required field is missing, ask ONE targeted question with a
modality hint (connect Google Drive / paste the landing URL /
connect Firecrawl), write it, continue.

## Steps

1. **Read ledger + legal context.** Gather missing required fields.
   Write atomically.
2. **Discover tools via Composio.** Run `composio search
   web-scrape` (privacy-posture, subprocessors) or `composio search
   document-storage` (template-library) as the scope dictates. If no
   tool is connected, name the category to link and stop.
3. **Branch on `scope`.**
   - `privacy-posture`:
     1. Execute the web-scrape slug against the landing-page URL
        and key product routes. Capture analytics tags, cookies
        dropped, forms + fields, third-party embeds, subprocessor-
        revealing scripts (Stripe, Intercom, Segment, HotJar,
        etc.).
     2. Fetch the deployed Privacy Policy (via the URL from ledger
        or via the same scrape).
     3. Diff: tools observed on site that the policy does not list,
        data categories collected that the policy does not
        disclose, new cookie categories, purpose drift (product
        description changed meaningfully since last policy update).
     4. Tag each finding with severity (`critical` — regulatory
        exposure; `high` — customer trust risk; `medium` —
        housekeeping; `low` — FYI). Cite the authority for every
        `critical` finding (GDPR Art. 13/14, CCPA §1798.100, 16
        CFR Part 314 where applicable).
     5. Write to `privacy-audits/{YYYY-MM-DD}.md` with Executive
        summary → Diffs by severity → Recommended next step per
        finding (most often: chain to `draft-document`
        type=privacy-policy).
   - `subprocessors`:
     1. Read current `subprocessor-inventory.json`.
     2. Walk connected integrations (via the user's installed
        Composio connections) — each connected tool that touches
        customer data is a candidate subprocessor.
     3. Scrape the landing page for additional clues (Stripe,
        Intercom, Calendly, etc. identified by their public
        scripts).
     4. For each candidate, capture: `role` (payment / email /
        analytics / support / hosting / AI / CRM / other),
        `dataCategories` (identifiers / usage / content / payment /
        sensitive), `transferMechanism` (SCCs / UK IDTA / DPF /
        intra-EU / intra-US-only / unknown), `dpaStatus` (signed
        standard / signed negotiated / public-posted / missing /
        unknown), `publicDpaUrl`.
     5. Read-merge-write `subprocessor-inventory.json`. Delta against
        prior inventory = added / removed / changed / unchanged.
     6. Write `subprocessor-reviews/{YYYY-MM-DD}.md` — one-page
        delta with "new vendors needing policy update" at the top
        and a link to `audit-compliance` scope=privacy-posture as
        the follow-up.
   - `template-library`:
     1. Read `domains.contracts.templateLibrary`. For each
        template, check `lastUpdatedAt` (or file metadata); flag
        anything > 12 months.
     2. For each stale template, enumerate what current-law changes
        should be considered (AI-training disclosure for
        consulting / MSA / customer paper; SCC 2021 / 2025 version
        check for DPAs; 2026 DPA standards; CCPA cure-period
        language; EU AI Act disclosures for AI-touching features).
     3. Rank by exposure (customer paper > vendor paper > internal).
     4. Write `template-reviews/{YYYY-MM-DD}.md` — refresh plan
        with (a) templates to refresh now, (b) templates to review
        in next quarter, (c) templates still current. Never auto-
        rewrites; recommends chaining to `draft-document` per
        template.
4. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id, type: "privacy-audit" | "subprocessor-review" |
   "template-review", title, summary, path, status: "ready",
   domain: "compliance", createdAt, updatedAt, attorneyReviewRequired? }`.
   Set `attorneyReviewRequired: true` when a `critical` finding
   implicates regulatory exposure.
5. **Summarize.** One paragraph with top-2 findings + the single
   recommended follow-up skill (e.g. "chain to `draft-document`
   type=privacy-policy to close the drift").

## What I never do

- Auto-fix anything. The skill surfaces diffs and recommends
  follow-ups; the founder decides.
- Invent a subprocessor, a data flow, or a cookie that I didn't
  observe in the scrape or in a connected integration. Missing
  data → UNKNOWN.
- Claim a policy is GDPR-compliant. I can say "policy discloses X,
  does not disclose Y" — never "you're covered."
- Hardcode tool names — Composio discovery at runtime only.
- Overwrite `subprocessor-inventory.json` — read-merge-write.
- Skip the authority citation on any `critical` privacy-posture
  finding.

## Outputs

- `privacy-audits/{YYYY-MM-DD}.md` (scope=privacy-posture).
- `subprocessor-reviews/{YYYY-MM-DD}.md` + updates
  `subprocessor-inventory.json` (scope=subprocessors).
- `template-reviews/{YYYY-MM-DD}.md` (scope=template-library).
- Appends to `outputs.json`.
