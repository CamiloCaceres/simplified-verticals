---
name: setup-tracking
description: "Use when you say 'spec event tracking' / 'tracking plan for {flow}' / 'UTM plan' — I draft an event-tracking plan (event name, trigger, properties, owner per step) plus a UTM matrix so paid / social / email are comparable in GA4 / your analytics. Writes to `tracking-plans/{slug}.md` — hand to engineering."
integrations:
  analytics: [posthog, mixpanel]
---

# Setup Tracking

The spec a founder takes into GA4 / Segment / PostHog / Mixpanel and
into every campaign URL. Does NOT push tags live — the founder (or
their dev) ships it.

## When to use

- "Spec event tracking for signup → activation"
- "UTM plan for the Q2 campaigns"
- "Tracking plan for the new pricing page"
- Called by `plan-paid-campaign` when a campaign needs events or
  UTMs that don't exist yet.

## Steps

1. **Read positioning doc** at
   `context/marketing-context.md`. If missing,
   tell the user to run the Head of Marketing's `define-positioning`
   first and stop.
2. **Read config:** `config/analytics.json`, `config/conversion.json`,
   `config/tracking-prefs.json` if present. If analytics stack is
   "none", flag that tracking can be specced but not implemented —
   recommend connecting PostHog (free tier) or GA4 via Composio as
   the minimum.
3. **Clarify the flow.** The user names a flow — "signup",
   "activation", "pricing-page → checkout", "campaign attribution".
   Map it to discrete steps (3-7 typical). Ask ONE question if the
   flow boundary is unclear (start event? success event?).
4. **Event-tracking spec** — one row per event:
   - `eventName` (snake_case, verb-led: `signup_started`,
     `signup_completed`, `checkout_viewed`, `checkout_completed`).
   - `trigger` (UI action / server event / URL match).
   - `properties` — 3-6 per event, including at minimum `user_id`,
     `anonymous_id`, `timestamp`, and flow-specific dimensions
     (plan, channel, referrer).
   - `destination` — which tool (GA4 / PostHog / Mixpanel / Segment
     router / server).
   - `owner` — who ships it (solo founder → "you"; else role).
   - `status` — `proposed` / `live` / `deprecated`.
5. **UTM matrix** — naming rules so every campaign tags consistently:
   - `utm_source` — the platform (`google` / `meta` / `linkedin` /
     `reddit` / `newsletter` / `x`).
   - `utm_medium` — channel type (`cpc` / `paid-social` / `email` /
     `organic-social` / `referral`).
   - `utm_campaign` — kebab-case `{yyyy-qX}-{theme}` (e.g.
     `2026-q2-founder-launch`).
   - `utm_content` — variant / creative slot (kebab-case).
   - `utm_term` — keyword (search only).
   Include a filled example row per active channel from
   `config/channels.json`.
6. **QA checklist** — 5-10 items: event fires on expected trigger,
   dedupe handled, no PII in properties, consent signals respected,
   UTM params preserved through redirects.
7. **Write** atomically to `tracking-plans/{slug}.md` (`*.tmp` →
   rename). Save naming conventions to `config/tracking-prefs.json`
   so future runs reuse them.
8. **Append to `outputs.json`** — `{ id, type: "tracking-plan",
   title, summary, path, status: "ready", createdAt, updatedAt }`.
9. **Summarize to user** — number of events specced, the UTM
   template to copy, path to the plan.

## Outputs

- `tracking-plans/{slug}.md`
- Writes / updates `config/tracking-prefs.json` (naming conventions).
- Appends to `outputs.json` with `type: "tracking-plan"`.
