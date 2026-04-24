---
name: review-deploy-readiness
description: "Use when you say 'is {release} ready to deploy' / 'run the deploy gate checklist' / 'GO or NO-GO on {release}' — pre-deploy gate checklist (tests green, migrations backwards-compat, feature flags, rollback plan, on-call aware, runbook updated) with green / yellow / red per gate and a final GO / NO-GO / SOFT-GO verdict. Writes to `deploy-readiness/{release-slug}.md`. Never runs deploy — I produce the verdict, you click the button."
integrations:
  dev: [github, gitlab]
  analytics: [sentry]
---

# Review Deploy Readiness

Last gate before a deploy. Runs a green/yellow/red checklist against
the quality bar from the engineering-context doc and outputs a verdict.
**The agent does NOT deploy. It produces the readiness doc; the user
deploys.**

## When to use

- "Is {release} ready to deploy"
- "Run the deploy gate checklist"
- "GO or NO-GO on {release}"
- "Check readiness for release {release-slug}"

## Hard nos (the posture)

- **Never runs `deploy` or any deploy-adjacent command.** No
  `kubectl apply`, no `gh workflow run deploy`, no CLI that pushes
  to prod.
- **Never flips a feature flag.** Even to verify one is set — ask
  the user to check.
- **Never merges or tags on the user's behalf.**

## Steps

1. **Read engineering context** at
   `context/engineering-context.md`. If missing or
   empty, tell the user to run the `define-engineering-context` skill first and stop. The context doc
   defines the quality bar (required checks, deploy cadence,
   release gating) — the gates below are graded against it.

2. **Read config:** `config/ci-cd.json`, `config/observability.json`,
   `config/on-call.md`. If `config/release-cadence.json` doesn't
   exist and the engineering-context doc doesn't clearly state the
   cadence, ask ONE question to capture it (ship daily / weekly /
   gated / whenever ready) and write the config.

3. **Get the release identifier.** Ask for the release slug or
   reference (tag, branch, release notes draft). Without it I can't
   read the right run / PRs.

4. **Pull release data.** Via `composio search code-hosting`:
   - The PR(s) included in the release (or the merge commits since
     the last tag).
   - The required-check status on the merge target.
   - Any migrations in the diff (search for `migrations/`,
     `schema.prisma`, `alembic/`, or language-specific patterns from
     the stack section of engineering-context).
   - Feature-flag references in the diff.

5. **Run the gate checklist.** For each gate below, write a
   one-line reason + color (🟢 green / 🟡 yellow / 🔴 red):

   | Gate | What I check |
   |------|--------------|
   | **Tests green** | All required checks on the release commit are passing. |
   | **Migrations backwards-compatible** | Any schema change has a reversible path; no destructive migrations without a two-phase plan. |
   | **Feature flags in place for risky changes** | Non-trivial behavior changes are behind a flag defaulted off. |
   | **Rollback plan documented** | There's a rollback procedure either in the release notes or a linked runbook. |
   | **On-call aware** | On-call is notified (config/on-call.md tells me who). |
   | **Runbook updated** | If the release adds a new failure mode (new service, new critical path), a runbook for it exists. |
   | **Customer comms drafted** | If user-facing, a release note + any proactive comms are drafted (even if not sent). |
   | **Observability coverage** | Critical paths in this release are instrumented (errors tracked, logs structured, alert present for the new surface). |

6. **Flag anything I can't see.** If the PR list is unavailable, or
   the migration diff can't be read, mark the relevant gate 🟡 with
   reason "logs UNKNOWN — agent couldn't fetch {thing}; user should
   confirm."

7. **Decide the verdict:**
   - **GO 🟢** — all gates green, or at most one yellow with a
     concrete mitigation named.
   - **SOFT-GO 🟡** — ship with caveats. Multiple yellows or a
     specific risk the user accepts; the caveats are spelled out.
   - **NO-GO 🔴** — any red gate. Ship blocked; what to fix first.

8. **Draft the readiness doc** in this structure:

   ```markdown
   # Deploy readiness: {release-slug}

   **Verdict:** GO / SOFT-GO / NO-GO
   **Date:** {YYYY-MM-DD}
   **Release:** {tag or description}
   **PRs:** {linked PR numbers}

   ## Gate checklist

   | Gate | Status | Reason |
   |------|--------|--------|
   | Tests green | 🟢 / 🟡 / 🔴 | {one line} |
   | Migrations backwards-compat | 🟢 / 🟡 / 🔴 | {one line} |
   | Feature flags | 🟢 / 🟡 / 🔴 | {one line} |
   | Rollback plan | 🟢 / 🟡 / 🔴 | {one line} |
   | On-call aware | 🟢 / 🟡 / 🔴 | {one line} |
   | Runbook updated | 🟢 / 🟡 / 🔴 | {one line} |
   | Customer comms | 🟢 / 🟡 / 🔴 | {one line} |
   | Observability | 🟢 / 🟡 / 🔴 | {one line} |

   ## Risks

   - {Risk 1 — what could go wrong, blast radius, how to detect fast.}
   - {Risk 2.}

   ## If SOFT-GO — caveats

   - {Caveat 1 — what the user is accepting.}

   ## Next actions (for the user, not the agent)

   1. {e.g. "Click deploy in GitHub Actions" — if GO.}
   2. {e.g. "Fix {failing check} and re-run review-deploy-readiness."}
   3. {e.g. "Monitor {dashboard URL} for the first 15 minutes."}
   ```

9. **Write** atomically to `deploy-readiness/{release-slug}.md`
   (`*.tmp` → rename).

10. **Append to `outputs.json`** — new entry `{ id, type:
    "deploy-readiness", title, summary, path, status: "ready",
    createdAt, updatedAt }`. Summary names the verdict.

11. **Summarize to user** — one paragraph with the verdict, the
    reason(s) behind any yellow/red gates, and the path to the doc.
    **Final sentence: "You deploy. I don't — even if it's green."**

## Outputs

- `deploy-readiness/{release-slug}.md`
- Appends to `outputs.json` with `type: "deploy-readiness"`.
