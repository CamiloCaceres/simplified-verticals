---
name: write-page-copy
description: "Use when you say 'rewrite my homepage' / 'pricing page' / 'signup flow review' / 'in-app onboarding copy' / 'upgrade paywall' / 'exit popup' — I fetch the surface via Firecrawl, then draft replacement copy in your voice grounded in your positioning + real customer language. Pick a `surface` (homepage / pricing / about / landing / signup-flow / onboarding / paywall / popup). Writes to `page-copy/{surface}-{slug}.md` — Current → Proposed → Why, paired per change."
integrations:
  scrape: [firecrawl]
---

# Write Page Copy

One skill for every copy surface on the site + in the product. The
`surface` parameter picks the shape; positioning, voice, no invented
quotes / no promised lift percentages are shared.

## Parameter: `surface`

- `homepage` | `pricing` | `about` | `landing` — full page rewrite:
  sections, headlines, bodies, CTAs, social-proof placement.
- `signup-flow` — pre-signup page copy + email field + password rules
  + verification screen + first-screen post-signup. Field-level
  verdicts (keep / merge / defer / kill).
- `onboarding` — in-product welcome, empty states, tooltips, nudges,
  checklist, aha-confirmation.
- `paywall` — upgrade modal / trial-expiration / feature-gate:
  timing audit first, then headline + value stack + plan comparison
  + price anchoring + CTA + social proof + dismissal.
- `popup` — exit / scroll / time-on-page interrupt: hook, offer,
  dismiss/accept CTAs + trigger + targeting + frequency cap +
  success metric.

If the user names the surface in plain English, infer it. If
ambiguous, ask ONE question naming the 8 options.

## When to use

- Explicit: "rewrite my {homepage / pricing / about / landing page
  at URL}", "signup flow review", "in-app onboarding copy", "upgrade
  paywall", "exit popup".
- Implicit: called after an `audit` (landing-page / form / site-seo)
  where the next step is a full rewrite rather than just the fix
  list.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `company` — name, pitch30s.
- `voice` — summary + samples; ask ONE question if missing.
- `positioning` — from `context/marketing-context.md`. If missing,
  ask: "want me to draft your positioning first? (one skill, ~5m)"
  and stop.
- `icp` — roles, pains, triggers (used to ground benefit copy in
  real customer language).
- `domains.copy.primaryConversion` — the one action the surface
  must drive. If missing for a public-page surface, ask ONE
  question: "What's the primary conversion for this page?"

## Steps

1. **Read ledger + positioning.** Gather missing required fields per
   above (ONE question each, best-modality first). Write atomically.
2. **Fetch the current state.** For URL-reachable surfaces, run
   `composio search web-scrape` and execute by slug (Firecrawl /
   ScrapingBee / equivalent) to pull the rendered HTML + visible
   text + primary image URLs + current CTA. For in-product surfaces
   (onboarding / some paywalls / popups), accept screenshots, Loom,
   or pasted copy. If nothing usable, ask for the paste and stop.
3. **Source real customer language.**
   - Try recent `analyses/` or `audits/` artifacts in this agent for
     prior mined quotes.
   - Otherwise run `composio search` for review-scrape providers
     (G2, Capterra, Trustpilot, Reddit, App Store) and pull verbatim
     phrases. If nothing is available, ask the user for 3-5 quotes
     and stop. Never invent quotes.
4. **Branch on surface.**
   - `homepage` | `pricing` | `about` | `landing`: enumerate the
     sections to rewrite (hero headline + subhead → social-proof
     slot → 3-5 value props tied to ICP pains → how-it-works →
     objections (from positioning) → final CTA recap). For each
     section: **Current** (quoted verbatim) → **Proposed** (in
     founder's voice) → **Why** (principle + ICP pain + positioning
     claim). Give 2-3 options for hero headline + primary CTA with
     a "ship this first" flag. Flag any current-page claim that
     contradicts positioning in a "Flagged" section (do NOT rewrite
     positioning — that's `define-positioning`).
   - `signup-flow`: map the flow as an enumerated step list (entry
     → landing → email/SSO → verification → plan → password → org →
     billing). Mark the conversion-event step. For each step record
     **Necessity** (keep / merge / defer / kill), **Friction**
     (cognitive-load / missing-value / error-shame / etc.), **Drop
     triggers**, and full **Copy rewrites** (headline, subhead,
     labels, CTA, errors, confirmation). Call out what should defer
     to post-conversion. Finish with one consolidated top-to-bottom
     end-state flow + top-3 ship-this-week + current vs. recommended
     step count.
   - `onboarding`: name the aha-moment (ask if not obvious). Map
     surfaces: welcome screen → empty states → onboarding checklist
     (3-5 items, verb + outcome, ordered by aha-adjacency) →
     tooltips → aha-moment confirmation. Each surface:
     **Current / Proposed / Why** with the principle named
     (value-first, single-next-action, action-led-label, aha-
     adjacency, empty-state-promise). Flag sequencing issues when
     data belongs in signup-flow instead (or vice versa).
   - `paywall`: **Audit timing FIRST** — has the user hit aha
     before this fires? Is the trigger behavioral or temporal? Is
     dismissal gentle or punishing? If timing is broken, call it
     as the first issue. Then audit content — headline (value of
     upgrading, not limitation of free), plan comparison (one
     recommended, outcome-led names), objection handling
     (from positioning), social-proof placement, primary CTA
     (action + outcome), dismissal pattern. Flag compliance / trust
     issues (auto-renew, cancel policy, trial-to-paid default).
   - `popup`: clarify the job in ONE question if unclear (lead
     capture / announcement / cart-abandon / promo / survey /
     reminder). Draft the full spec: **Trigger** (exit-intent /
     scroll-% / time / behavioral — respect minimum engagement),
     **Targeting** (page / visitor / device / time rules),
     **Frequency cap** (default once-per-user for anything above a
     banner), **Copy** (<10-word headline grounded in a named
     quote, subhead, minimal fields, CTA with action + outcome,
     non-shaming dismiss, trust line only if policy-backed),
     **Success metric + guardrail**. Name any anti-patterns
     (fires-before-earned, no-dismiss, forced-scroll, guilt-close).
5. **Write** atomically to
   `page-copy/{surface}-{slug}-{YYYY-MM-DD}.md` (`*.tmp` → rename).
   Front-matter: `surface`, `url` (if applicable), `primaryConversion`.
6. **Append to `outputs.json`.** Read-merge-write atomically:
   `{ id (uuid v4), type: "page-copy", title, summary, path, status:
   "draft", createdAt, updatedAt }`.
7. **Summarize to user.** The single highest-leverage change, the top-3
   ship-this-week changes, and the path to the full file. For
   `paywall`, lead with the timing verdict. For `signup-flow`, lead
   with the step-count delta.

## What I never do

- Ship copy live. Drafts only — you paste / deploy.
- Invent customer quotes, stats, testimonials. Mark TBD.
- Rewrite positioning — I flag contradictions; `define-positioning`
  owns the doc.
- Promise a lift percentage. Every variant is a hypothesis.
- Add dark patterns (fake scarcity, forced scroll, guilt dismiss,
  shame language).

## Outputs

- `page-copy/{surface}-{slug}-{YYYY-MM-DD}.md`
- Appends an entry to `outputs.json` with type `page-copy`.
