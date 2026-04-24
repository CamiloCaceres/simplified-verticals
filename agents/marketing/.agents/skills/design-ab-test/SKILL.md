---
name: design-ab-test
description: "Use when you say 'A/B test for {page}' / 'design an experiment' / 'hypothesis for {change}' — I write a full test spec covering hypothesis (PICOT), control vs variant, primary + secondary metrics, sample-size estimate with MDE + power, duration, and go/no-go criteria. Writes to `ab-tests/{slug}.md` — so you don't ship the loser."
---

# Design A/B Test

Turns a vague "let's test something" into a rigorous experiment doc
the founder can launch in their CRO tool of choice (Optimizely / VWO
/ PostHog / GrowthBook / native platform test).

## When to use

- "A/B test for the pricing page headline"
- "Design an experiment for {proposed change}"
- "Hypothesis for swapping {X} to {Y}"
- Often follows `critique-landing-page` (fixes flagged as
  non-obvious → design a test).

## Steps

1. **Read positioning doc** at
   `context/marketing-context.md`. If missing,
   tell the user to run the Head of Marketing's `define-positioning`
   first and stop.
2. **Read config:** `config/conversion.json` (primary event +
   baseline rate if set), `config/analytics.json` (which tool will
   power the test).
3. **Clarify the variable.** If the user named a change vaguely
   ("test the pricing page"), ask one question: "Which element —
   headline, hero image, CTA copy, pricing table layout, trust
   badges, or something else?" Pick one variable. No multi-variable
   tests in v1.
4. **PICOT hypothesis:**
   - **P** — Population (who sees it).
   - **I** — Intervention (variant change).
   - **C** — Comparison (control = current page).
   - **O** — Outcome (primary metric).
   - **T** — Time (test duration).
   Write it as one sentence: "Among {P}, changing {I} vs. {C} will
   improve {O} by at least {MDE}% within {T}."
5. **Metrics:**
   - **Primary** — the conversion event from
     `config/conversion.json`.
   - **Secondary** — 2-3 guardrails (bounce rate, time-on-page,
     downstream activation).
   - **Non-metrics** — things we're NOT measuring (prevents
     post-hoc fishing).
6. **Sample-size estimate.** Given baseline conversion rate (from
   config or user paste), target MDE (ask the user; default 10%
   relative), alpha 0.05, power 0.80 — compute required sample per
   variant using a standard two-proportion z-test formula. Show the
   numbers. Translate into "days of traffic" using current volume.
   If baseline or volume is unknown, state assumptions and mark the
   number as an estimate.
7. **Duration + stop conditions.**
   - Minimum duration (full business cycle, e.g. 7 or 14 days even
     if sample hits sooner — avoids weekday bias).
   - Peeking policy (no peek-and-stop; Bayesian tools excepted).
   - Hard-stop conditions (negative guardrail breach > X%).
8. **Go / no-go criteria.** What result ships the variant, what
   result kills it, what result runs a follow-up test.
9. **Implementation notes.** Which tool executes the test, which
   event IDs power it (link to `tracking-plans/` if one exists), who
   QAs before launch.
10. **Write** atomically to `ab-tests/{slug}.md` (`*.tmp` → rename).
11. **Append to `outputs.json`** — `{ id, type: "ab-test", title,
    summary, path, status: "draft", createdAt, updatedAt }`.
12. **Summarize to user** — one-sentence hypothesis, required
    sample, duration, path to the doc.

## Never promise

Don't claim a lift before the test runs. Every hypothesis is
"expected directional effect + why" — not "this will convert better."

## Outputs

- `ab-tests/{slug}.md`
- Appends to `outputs.json` with `type: "ab-test"`.
