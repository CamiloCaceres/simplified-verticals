---
name: analyze
description: "Use when you say 'analyze test X' / 'anything weird in the data' / 'why is this number off' / 'check data quality on {table}' — I produce the rigorous readout you asked for. Pick `subject`: `experiment` computes lift + significance + CI + guardrails with an explicit ship / kill / iterate / inconclusive call · `anomaly` flags metrics deviating past rolling baseline with 1-3 hypothesized causes · `data-qa` runs read-only null / dup / freshness / referential-integrity checks."
integrations: [posthog, mixpanel]
---

# Analyze

One analytical primitive for the three jobs a data function does regularly: experiment readouts, anomaly sweeps, data-quality audits. Rigorous by default — I never recommend SHIP without significance, never call something an anomaly without baseline context, and never skip caveats on data-QA findings.

## When to use

- `subject=experiment` — "analyze test {X}" / "how did the {Y} experiment do" / "readout on the A/B test".
- `subject=anomaly` — "anything weird in the data today" / "anomaly check" / "why did {metric} spike".
- `subject=data-qa` — "check data quality on {table}" / "why is this number off" / "run DQ on the warehouse".

## Ledger fields I read

- `universal.company.stage` — affects power/MDE defaults for experiment analysis (early stage = larger MDE tolerated).
- `domains.data.warehouse` — which connected warehouse to query (Postgres / BigQuery / Snowflake via Composio).
- `domains.data.metrics` — the metric registry, for anomaly baselines and thresholds.
- `domains.data.schemas` — table shapes + freshness expectations for data-QA.

Missing → ONE modality-ranked question → write to ledger → continue.

## Parameter: `subject`

- `experiment` — analyze a specific test. Inputs: variant data (connected warehouse query or paste), hypothesis, primary metric, guardrails. Output: `analyses/experiment-{slug}-{YYYY-MM-DD}.md` with ship / kill / iterate / inconclusive-extend recommendation.
- `anomaly` — sweep every metric in `config/metrics.json` with ≥7 snapshots; flag any deviating past its per-metric threshold or the documented default (2σ yellow / 3σ red). Output: `analyses/anomaly-sweep-{YYYY-MM-DD}.md` + upsert `anomalies.json`.
- `data-qa` — run read-only DQ checks on target tables: nulls per column, duplicates on natural keys, freshness (MAX(updated_at) vs expected staleness), referential integrity on key joins, cardinality surprises. Output: `data-quality-reports/{YYYY-MM-DD}/report.md`.

## Steps

1. Read `config/context-ledger.json`; fill gaps with ONE modality-ranked question.
2. Read `context/operations-context.md` — active priorities + hard nos anchor what counts as "material" in the readout.
3. Branch on `subject`:

   **If `subject = experiment`:**
   - Read the hypothesis, variants, primary metric, and guardrails. If missing, ask for them in one turn (hypothesis + control + variant + primary metric + guardrails).
   - Pull variant data via connected warehouse (read-only SQL) or accept pasted aggregates.
   - Compute: lift (variant vs control), statistical significance (appropriate test — z-test for proportions, t-test for continuous), 95% CI, observed MDE, guardrail deltas.
   - Make the call:
     - SHIP — primary metric moves with p < 0.05, guardrails don't degrade, CI lower bound > practical MDE.
     - KILL — primary metric doesn't move OR guardrails degrade materially.
     - ITERATE — directionally positive, not yet significant, but guardrails clean; spec the next variant.
     - INCONCLUSIVE-EXTEND — too low power; compute how long to run.
   - Write the readout with every number, the call, and the reasoning.

   **If `subject = anomaly`:**
   - Read `config/metrics.json`; for each metric with ≥7 snapshots, compute 7-day and 28-day rolling baselines.
   - Compare latest value against baselines; flag deviations past per-metric threshold or the default (2σ / 3σ).
   - For each flagged metric, hypothesize 1-3 possible causes from: recent decisions in `decisions.json`, recent deploys referenced in `context/operations-context.md`, recent experiments in `outputs.json`, known seasonal patterns.
   - Upsert `anomalies.json` with `{id, metric, severity, observedAt, baseline, deviation, hypotheses[], status: "open"}`.

   **If `subject = data-qa`:**
   - Read `config/schemas.json` for the target tables (or the whole warehouse if you said "everything").
   - For each table:
     - Nulls per column (vs expected).
     - Duplicates on natural key.
     - Freshness: `MAX(updated_at)` vs staleness expectation.
     - Referential integrity on key joins (foreign-key orphans).
     - Cardinality surprises (value count drift vs baseline).
   - Produce a dated report with pass / warn / fail per check + SQL used + suggested fix per fail.

4. Write atomically (`.tmp` → rename) to the appropriate path.
5. Append to `outputs.json` with `{id, type, title, summary, path, status, createdAt, updatedAt, domain: "data"}`. Type = `"experiment-readout"` / `"anomaly-sweep"` / `"data-qa-report"`.
6. Summarize to you: for experiments, the call + the one-sentence reason; for anomalies, count + top 3 by severity; for data-QA, count of fails + the one to fix first.

## Outputs

- `analyses/experiment-{slug}-{YYYY-MM-DD}.md` (experiment)
- `analyses/anomaly-sweep-{YYYY-MM-DD}.md` + `anomalies.json` upsert (anomaly)
- `data-quality-reports/{YYYY-MM-DD}/report.md` (data-qa)
- Appends to `outputs.json`.

## What I never do

- Recommend SHIP without statistical significance.
- Call something an anomaly without showing the baseline.
- Run DML / DDL — read-only queries only.
- Hide caveats (sample size, seasonality, missing data) behind a headline number.
