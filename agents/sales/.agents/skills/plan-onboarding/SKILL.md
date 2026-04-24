---
name: plan-onboarding
description: "Use when you say 'plan onboarding for {customer}' / 'kickoff plan for {customer}' — I build a kickoff agenda, lock one concrete success metric with the customer, and sequence a 90-day time-to-value timeline with milestones and risks. The anchor every later QBR and renewal pulls from. Writes to `customers/{slug}/onboarding-plan.md`."
---

# Plan Onboarding

The first artifact after close. Sets the success metric explicitly so
we can score health honestly against it for the next year.

## When to use

- "plan the onboarding for {customer}".
- "kickoff plan for {customer}".
- Triggered post-close when this agent's close-plan status flips to
  `closed-won`.

## Steps

1. **Read the playbook.** `context/sales-context.md`.

2. **Read this agent's close-plan + proposal.** `deals/{slug}/
   close-plan.md` and `proposal-v*.md` (latest). Extract: customer's
   stated problem, their success metric (verbatim), champion,
   economic buyer, stakeholders, timeline.

3. **Read config/success-metric.json** — our canonical success
   framing. Cross-reference with THEIR success metric. Flag
   divergence.

4. **Draft the onboarding plan:**

   1. **Kickoff agenda** — 5–7 items, 60 min total. Intros, success
      metric confirmation (we restate and THEY confirm verbally),
      access / provisioning, team handoff, cadence.
   2. **Success metric (explicit)** — both versions: ours + theirs.
      If they diverge, explain which one we're committing to drive
      the first-90 health score against.
   3. **90-day time-to-value timeline:**
      - Day 0 — kickoff.
      - Day 7 — access + first use.
      - Day 14 — first value milestone (concrete, measurable).
      - Day 30 — first outcome review.
      - Day 60 — mid-term adjustment.
      - Day 90 — first quarterly outcome.
   4. **Champions + blockers** — named. Execs to introduce.
   5. **First-30-day risk list** — anything we already see that
      could derail.

5. **Write atomically** to `customers/{slug}/onboarding.md.tmp` →
   rename. Create `customers/{slug}/` if missing.

6. **Create row in `customers.json`** — `health: "GREEN"`,
   `startedAt: <ISO>`, `renewalAt` = kickoff + term, etc.

7. **Append to `outputs.json`** with `type: "onboarding"`.

8. **Summarize.** The explicit success metric + the 30-day milestone.

## Outputs

- `customers/{slug}/onboarding.md`
- New row in `customers.json`.
- Appends to `outputs.json`.
