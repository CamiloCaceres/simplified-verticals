---
name: audit
description: "Use when you say 'audit the architecture of {system}' / 'audit my CI/CD' / 'audit observability' / 'DX audit' / 'audit my README' — I audit the `surface` you pick: `architecture` walks a service end-to-end · `ci-cd` reads workflow config + run history via GitHub or GitLab · `observability` reviews Sentry / Datadog / PostHog coverage · `devx` estimates setup time + paper cuts · `readme` scores against a checklist with inline diff suggestions. Every finding ranked by impact × effort. Writes to `audits/{surface}-{slug}-{date}.md` — a prioritized fix list, not a warnings dump."
integrations: [github, gitlab, sentry, posthog, firecrawl]
---

# Audit

One skill for five audit surfaces. The `surface` parameter picks the
probe; impact × effort prioritization, grounding against the
engineering context, and "draft only, never auto-fix" discipline are
shared.

## Parameter: `surface`

- `architecture` — walk a system / module / service end-to-end. Risk-
  sorted concerns (high / medium / low) with current state, proposed
  fix, effort (S/M/L/XL).
- `ci-cd` — read CI workflow config + recent run history via the
  connected code host. Flaky tests, slowest jobs, missing gates,
  security gaps.
- `observability` — read the connected observability stack (Sentry /
  Datadog / PostHog / New Relic / Honeycomb). 3-column matrix
  (signal × coverage × gap) across errors / traces / logs / alerts /
  SLOs, plus top-5 fix list.
- `devx` — read README, CONTRIBUTING, Makefile, package.json scripts,
  docker-compose, .env.example, CI config. Estimated setup time,
  build time from CI history, top 5 paper cuts with suggested fixes.
- `readme` — score the repo's README against a standard checklist
  (pitch, badges, quickstart, install, usage, configuration,
  contribution, license). Audit with inline diff suggestions, a
  rewritten lede, prioritized fix list.

If the user names the surface in plain English ("architecture
review", "CI audit", "what are we blind to", "DX paper cuts", "audit
my README"), infer it. If ambiguous, ask ONE question naming the 5
options.

## When to use

- Explicit per-surface phrases above.
- Implicit: inside `coordinate-release` when a system boundary or
  ops surface is new (architecture / observability), or inside
  `validate-feature-fit` when the fit verdict hinges on feasibility
  (architecture).
- Per-surface cadence: architecture on demand, ci-cd monthly max,
  observability monthly max, devx quarterly max, readme on demand.

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `universal.engineeringContext` — required for all surfaces. If
  missing: "want me to draft your engineering context first? (one
  skill, ~5m) I ground every audit against it." Stop until written.
- `universal.priorities` — used by every surface for impact
  weighting.
- `domains.development.stack`, `domains.development.sensitiveAreas`,
  `domains.development.qualityBar` — required for `architecture`,
  `ci-cd`, `devx`, `readme`. If thin, ask ONE question (best-modality
  hint).
- `domains.reliability.cicd.provider` — required for `ci-cd`. If
  missing, run `composio search code-hosting` and fall back to
  conventional workflow paths, or ask.
- `domains.reliability.observability` — required for `observability`.
  If none connected, ask which category to link (errors / metrics /
  logs) and stop for that surface.

## Steps

1. **Read ledger + engineering context.** Gather missing required
   fields per surface (ONE question each, best-modality first).
   Write atomically.

2. **Discover tools via Composio.** Run the right search for the
   surface:
   - `architecture`, `ci-cd`, `devx`, `readme` → `composio search
     code-hosting`.
   - `observability` → `composio search observability` or direct
     (`composio search sentry` / `datadog` / `posthog`).
   - `readme` fallback without code host → `composio search
     web-scrape` to fetch the public README URL.
   If a required category has no connection, name it and stop.

3. **Branch on surface.**

   - `architecture`: read the target system / module / service.
     Walk boundaries, data flow, shared state, failure modes, scaling
     cliffs, test seams. Flag anything overlapping
     `sensitiveAreas` as high by default. For each concern: current
     state, proposed fix, effort estimate (S/M/L/XL). Favor
     incremental fixes that preserve shipping velocity over rewrites.

   - `ci-cd`: fetch workflow files from conventional paths
     (`.github/workflows/*.yml`, `.gitlab-ci.yml`,
     `.circleci/config.yml`, `.buildkite/pipeline.yml`,
     `Jenkinsfile`). Fetch last 100 runs on the default branch.
     Group failures by test name; same-SHA retry-pass = flake.
     Compute minutes-per-week per job. Enumerate missing gates
     (required checks, required reviewers, lint/type-check/dep
     audit/secret scan/SBOM) vs engineering-context quality bar.
     Flag security gaps (plaintext secrets, `pull_request_target`
     leaks, missing `permissions:` block, unpinned actions).

   - `observability`: read per-signal coverage from the connected
     tool. Signals: errors, traces, logs, alerts, SLOs. For each
     signal record: covered? / partially / missing, what's
     instrumented, what's blind. Produce a 3-column matrix. Top 5
     fixes ranked by blast-radius reduction.

   - `devx`: pull README, CONTRIBUTING, Makefile,
     `package.json.scripts`, `docker-compose.yml`, `.env.example`,
     CI config. Count discrete setup steps from clone to
     first-successful-test-run. Estimate setup time from step count +
     any explicit time markers. Estimate build time from CI history
     if available. Surface the top 5 paper cuts (missing env var
     example, flaky setup script, bad error message, outdated
     command, zombie script). Each with suggested fix + effort.

   - `readme`: fetch the repo README. Score against: one-sentence
     pitch above the fold, install / quickstart that copy-pastes,
     usage with a real working example, configuration table, link to
     contribution / docs / LICENSE, badges (CI / version / license),
     obvious next-reader path. For each missing / weak section:
     suggested inline diff + rewritten lede at the top of the
     report. Prioritized fix list by founder-impact.

4. **Score + prioritize.** Tag every finding
   `{severity: critical / high / medium / low}` ×
   `{effort: quick-win / medium / heavy}`. Surface top 5 critical-or-
   high quick-wins at the top.

5. **Write** atomically to
   `audits/{surface}-{slug}-{YYYY-MM-DD}.md` (`*.tmp` → rename).
   Slug: for `architecture` use system/service name; `ci-cd` and
   `observability` use a short repo slug or `main`; `devx` uses the
   repo slug; `readme` uses the repo slug.
   Structure: Executive summary → Top 5 quick wins → Findings
   per category → Prioritized fix list (impact × effort).

6. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type: "audit", title, summary, path, status:
   "ready", createdAt, updatedAt, domain }`. Domain per surface:
   `architecture` / `ci-cd` / `devx` → `"development"`;
   `observability` → `"reliability"`; `readme` → `"docs"`.

7. **Summarize to user.** One paragraph with the top 5 quick wins
   (or the single biggest fix) and the path. Flag anything marked
   UNKNOWN so you can fill gaps.

## What I never do

- Invent findings, flake rates, step counts, or section scores.
  Every claim ties to a real tool response or file observation.
  Missing data → marked UNKNOWN or TBD.
- Promise a latency reduction, test-speed improvement, or coverage
  lift percentage — audits surface hypotheses, not guarantees.
- Auto-fix (never open a PR, never edit a workflow, never rewrite
  the README in place) — drafts only.
- Hardcode tool names — Composio discovery at runtime only.

## Outputs

- `audits/{surface}-{slug}-{YYYY-MM-DD}.md`
- Appends an entry to `outputs.json` with type `audit`.
