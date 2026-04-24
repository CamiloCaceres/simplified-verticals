---
name: surface-expansion
description: "Use when you say 'any expansion opportunities in my book' / 'who's ripe for upsell' — I scan your GREEN customers for usage spikes (via connected PostHog / Mixpanel), team-growth signal, and feature-request patterns, then rank opportunities by ARR upside with the cited signal per row. Writes to `expansion/{YYYY-MM-DD}.md`."
---

# Surface Expansion

## When to use

- "any expansion opportunities in my book right now".
- "who's ripe for upsell / cross-sell".
- Scheduled: monthly expansion sweep.

## Steps

1. **Read the playbook.** `context/sales-context.md` for
   pricing stance + any SKUs list.

2. **Read `customers.json`.** Filter to `health: "GREEN"` customers
   only.

3. **For each GREEN customer, check signals:**
   - **Usage spikes** — past the current tier's threshold (query
     product-analytics).
   - **Team-size growth** — new seats detected, LinkedIn headcount
     growth (query CRM + LinkedIn if connected).
   - **Feature requests** — from tickets that map to an existing SKU
     (query support).
   - **New-product adoption** — % using the newest feature / SKU.

4. **Score each candidate.** ARR impact (low / med / high) ×
   effort-to-close (low / med / high). Rank by impact/effort ratio.

5. **For high-signal candidates, write a per-customer brief:**
   `customers/{slug}/expansion-{YYYY-MM-DD}.md` — the signal cited,
   the proposed SKU / seat / tier, the estimated ARR, the
   effort-to-close, and the one-line pitch this agent would use.

6. **Append to `expansion.json`:**

   ```ts
   {
     id, slug, customerSlug,
     type: "upsell" | "cross-sell" | "add-on" | "seat-expansion",
     estArr, effort: "low"|"med"|"high",
     signal: "<cited signal>",
     status: "surfaced",
     createdAt, updatedAt
   }
   ```

7. **Update `customers.json`** — increment `openExpansions`.

8. **Append to `outputs.json`** with `type: "expansion"`.

9. **Summarize.** Top 3 opportunities (customer · type · est ARR).
   Suggest handoff: "Run `@ae draft-proposal` on the top one."

## Outputs

- `customers/{slug}/expansion-{YYYY-MM-DD}.md` per candidate.
- Appends to `expansion.json`.
- Appends to `outputs.json`.
