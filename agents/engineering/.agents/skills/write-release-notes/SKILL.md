---
name: write-release-notes
description: "Use when you say 'release notes since {tag}' / 'changelog for {version}' / 'draft the {version} release notes' / 'update the CHANGELOG from PRs since {version}' — I pull merged PRs + linked issues via GitHub or GitLab since the given tag, filter for user-visible changes, and draft the `format` you pick: `release-notes` is a public-facing narrative with headline, highlights, breaking changes, upgrade notes · `changelog` is a Keep-A-Changelog snippet (Added / Changed / Deprecated / Removed / Fixed / Security). Writes to `release-notes/{version}.md` or `changelog/{version}.md`. Draft only — I never auto-commit the canonical CHANGELOG or publish notes."
integrations:
  dev: [github, gitlab, linear, jira]
---

# Write Release Notes

One skill for both release-notes formats. The `format` parameter
picks the shape; grounding against merged PRs + linked issues and
"filter for user-visible, skip infra-only" discipline are shared.

## Parameter: `format`

- `release-notes` — public-facing, narrative. Headline + 3-5
  highlights written for the user, breaking changes (with migration
  snippet), upgrade notes, thank-yous if contributors contributed.
  Saves to `release-notes/{version}.md`.
- `changelog` — Keep-A-Changelog snippet for the version block,
  sectioned Added / Changed / Deprecated / Removed / Fixed /
  Security, one line per merged change in user-facing language.
  Saves to `changelog/{version}.md` as a snippet the user pastes
  into the canonical `CHANGELOG.md`.

If the user names the format in plain English ("public release
post" / "update our changelog"), infer it. If ambiguous, ask ONE
question naming the 2 options.

## When to use

- Explicit per-format phrases above.
- Implicit: inside `coordinate-release` after deploy-readiness is
  GREEN (`release-notes` for user comms, `changelog` for the repo
  entry).

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `universal.engineeringContext` — required. If missing: "want me
  to draft your engineering context first? (one skill, ~5m)" and
  stop.
- `universal.product` — used for voice + audience framing.
- `domains.docs.changelogFormat` — `keep-a-changelog` /
  `conventional` / `prose`. Defaults to `keep-a-changelog` if
  missing.
- `domains.planning.tracker` — to resolve issue links on PRs
  (Linear / Jira / GitHub Issues).

## Steps

1. **Read ledger + engineering context.** Gather missing fields
   (ONE question each). Write atomically.

2. **Resolve version + range.** Ask the user for:
   - `version` (e.g. `v2.4.0`) — required.
   - `since` (prior tag or date) — required. Default: the last tag
     on the default branch if the code host can resolve it.
   If the user named only the new version and no `since`, try to
   read the latest release via the connected code host; otherwise
   ask ONE question.

3. **Discover tools via Composio.** Run `composio search
   code-hosting` and `composio search issue-tracker`. If code
   hosting is missing, accept a pasted list of merged PR titles +
   URLs and continue; if issue tracker is missing, proceed without
   linked-issue context.

4. **Fetch merged PRs in the range.** Pull title, body / description,
   author, merge date, labels, linked issues. Skip PRs labeled
   `skip-changelog` / `internal` / `infra` / `ci-only` / `dep-bump`
   (unless explicitly user-facing). Group by PR label or
   conventional-commit prefix if present (`feat:` → Added,
   `fix:` → Fixed, `chore(deps):` → Changed if user-visible, etc.).

5. **Branch on format.**

   - `release-notes`:
     - Draft a public-facing post (~300-600 words):
       - **Headline** — one sentence announcing what this release
         is really about (not "v2.4.0 release").
       - **Highlights** — 3-5 bullets, each a user outcome
         ("Scheduled jobs now survive deploys" — not "Upgraded
         queue worker pool"). Link to tutorial / docs where
         applicable.
       - **Breaking changes** — each with migration snippet
         (bash / diff / code block). If none, write "No breaking
         changes in this release."
       - **Upgrade notes** — steps the user takes (config flags to
         flip, migrations to run, env vars to add).
       - **Fixed** — list the user-visible bug fixes.
       - **Thanks** — if external contributors merged PRs, name
         them. Only from the PR author list, never invented.
     - Save to `release-notes/{version}.md`.

   - `changelog`:
     - Produce a Keep-A-Changelog snippet for the version block:
       ```
       ## [{version}] - {YYYY-MM-DD}

       ### Added
       - …
       ### Changed
       - …
       ### Deprecated
       - …
       ### Removed
       - …
       ### Fixed
       - …
       ### Security
       - …
       ```
     - One line per included PR in user-facing language. Skip
       internal refactors entirely unless they change observable
       behavior.
     - Omit sections with no entries.
     - Save to `changelog/{version}.md` — a snippet for the user
       to paste into the canonical `CHANGELOG.md`. Never write to
       the canonical file directly.

6. **Mark gaps honestly.** If a PR title is unclear and the body /
   linked issue doesn't disambiguate, write `TBD — summarize
   {PR-link}` rather than inventing a user outcome.

7. **Write atomically** to the target path (`*.tmp` → rename).

8. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type, title, summary, path, status: "draft",
   createdAt, updatedAt, domain: "docs" }`. Type: `"release-notes"`
   or `"changelog"`.

9. **Summarize to user.** One paragraph: one-sentence release
   headline (for `release-notes`) or count by section (for
   `changelog`), plus the path and the next action ("Copy the
   snippet into `CHANGELOG.md` and open a PR — I don't auto-commit").

## What I never do

- Auto-commit to the canonical `CHANGELOG.md` at the repo root or
  push a release-notes post to the docs site. Drafts only.
- Invent a user outcome from a thin PR title. Mark `TBD` + the PR
  link to resolve.
- Include `skip-changelog` / `infra-only` / bot-author PRs unless
  explicitly user-facing.
- Tag anyone as a contributor who isn't listed on a merged PR in
  the range.
- Hardcode tool names — Composio discovery at runtime only.

## Outputs

- `release-notes/{version}.md` (for `format = release-notes`)
- `changelog/{version}.md` (for `format = changelog`)
- Appends an entry to `outputs.json` per run.
