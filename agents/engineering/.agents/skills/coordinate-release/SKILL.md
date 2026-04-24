---
name: coordinate-release
description: "Use when you say 'coordinate the {feature} release' / 'help me prep the {feature} ship' — I break the release into a sequenced per-phase checklist (design ready? deploy plan? tests green? runbook? release notes? user docs?) and write exact copy-paste prompts for the skills in this agent that execute each phase. Writes to `release-plans/{feature-slug}.md`."
---

# Coordinate Release

The one cross-agent orchestration skill. Without it, cross-agent
coordination becomes the founder's manual job: "did tech-lead review
the PR? did release-reliability update the runbook? did backlog-triage
draft the notes? did docs-dx update the README?" This skill turns
that into a single plan.

## When to use

- "coordinate the {feature} release" / "help me prep the {feature}
  ship" / "we're shipping {X}, coordinate".
- "update the release plan — we slipped".
- After `plan-roadmap` flags a priority as in-flight and the founder
  asks "what do all my agents need to do to ship this?"

## Steps

1. **Read engineering-context.md** (own file). If missing, STOP —
   tell the user to run `define-engineering-context` first. A
   release plan without the deploy cadence, release gating, and
   quality bar is guesswork.

2. **Gather release inputs** — ask ONE tight question if any is
   missing (best modality hint first):
   - **What's launching** — feature name, one-line description,
     target date. (Best: paste a PRD URL or short description. Or
     point at the tracking issue via a connected issue-tracker.)
   - **Scope of change** — API-breaking / backward-compatible /
     migration-required. (Best: paste. Default to
     backward-compatible unless told otherwise.)
   - **Rollout shape** — all-at-once / feature flag / staged rollout.
     (Default: feature flag if the context doc's quality bar says
     "continuous".)

3. **Read context for release gating.** Pull from
   `engineering-context.md` section 4 (Quality bar) — who approves,
   what tests block, what deploy cadence applies. Cite it in the plan
   so no agent re-invents the rules.

4. **Draft the per-agent checklist (markdown, ~500-900 words).**
   Organized into four sections — one per peer agent — plus a
   timeline summary.

   ### Tech Lead (`tech-lead`)

   - Design doc exists and is signed off?
   - All PRs reviewed and merged?
   - ADRs filed for any architectural decisions?
   - Any deferred tech debt worth noting?
   - **Copy-paste handoff prompt** — the exact message the founder
     sends to the `tech-lead` agent's chat, e.g.
     *"Review all PRs for {feature} and confirm the design doc at
     {path} reflects what we actually shipped. Flag any ADR we
     should file before release."*

   ### Release & Reliability (`release-reliability`)

   - Deploy window scheduled?
   - Runbook updated with new failure modes?
   - Observability wired (logs / metrics / traces / alerts for the
     new surface)?
   - Rollback plan documented?
   - Incident response readiness — who's on-call during the
     release window?
   - **Copy-paste handoff prompt** for `release-reliability`.

   ### Backlog & Triage (`backlog-triage`)

   - All tickets for the release closed or explicitly deferred?
   - Release notes drafted (user-facing language, not git log)?
   - Any bug reports pre-existing for this surface area triaged?
   - **Copy-paste handoff prompt** for `backlog-triage`.

   ### Docs & DX (`docs-dx`)

   - Changelog entry drafted?
   - README updated for any user-visible change?
   - API docs reflect new endpoints / schema changes?
   - Tutorial or migration guide needed?
   - **Copy-paste handoff prompt** for `docs-dx`.

5. **Flag the critical path.** One short section: "What blocks ship
   day if missed" — the single item that, if incomplete, should
   slip the release. Usually it's one of: design doc sign-off,
   runbook for a known failure mode, or the migration guide for an
   API-breaking change.

6. **Timeline summary.** A short day-by-day (or hour-by-hour for
   same-day releases) listing who does what when. The founder
   approves every destructive step (merge, deploy, public
   announcement).

7. **Sanity check against context doc.** Every checklist item must
   tie back to the quality bar or release gating rules in the
   context doc — not arbitrary "best practices". If the context
   doc says "no staging, deploy straight to prod via feature flag",
   do NOT invent a staging step.

8. **Write atomically** to `release-plans/{feature-slug}.md` —
   `{path}.tmp` then rename. `{feature-slug}` is kebab-case of the
   feature name + target-date month (e.g.
   `release-plans/team-sso-2026-05.md`).

9. **Append to `outputs.json`.** Read-merge-write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "release-plan",
     "title": "<Feature> release plan",
     "summary": "<2-3 sentences — what's shipping, when, the critical-path item>",
     "path": "release-plans/<slug>.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

10. **Summarize to user.** One paragraph: feature + date + the one
    critical-path item + the 4 handoff prompts ready to paste +
    path to the plan.

## Outputs

- `release-plans/{feature-slug}.md`
- Appends to `outputs.json` with `type: "release-plan"`.
