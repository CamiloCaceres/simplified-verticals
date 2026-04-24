---
name: run-standup
description: "Use when you say 'draft my standup' / 'what's my standup today' / 'Monday standup' — I pull recent commits and PR activity from GitHub or GitLab, recently closed tickets from Linear, Jira, or GitHub Issues, mix in your notes, and produce a three-bullet Yesterday / Today / Blockers draft. Writes to `standups/{YYYY-MM-DD}.md`. Never posts to Slack on your behalf — you copy-paste."
integrations:
  dev: [github, gitlab, linear, jira]
  messaging: [slack]
---

# Run Standup

One artifact per day. Three bullets. No prose essays.

## When to use

- User: "draft today's standup" / "what's my standup" /
  "daily update" / "standup from my commits".
- At the start of a workday when the user wants a ready-to-edit
  update.

## Steps

1. **Read engineering context** —
   `context/engineering-context.md`. If missing or
   empty, say: "I need the engineering context doc first. Run Head
   of Engineering's `define-engineering-context` (5 minutes), then
   come back." Stop. Extract: current priorities (so "Today" targets
   what matters, not every open task).
2. **Read `config/issue-tracker.json`** and watch for which tracker
   to query. If missing, continue without closed-ticket data and
   note it.
3. **Pull recent commits + PR activity via Composio.** Run
   `composio search <code-host>` to find the list-commits and
   list-pull-requests tools for the connected code host (GitHub /
   GitLab / Bitbucket / Gitea). Fetch the user's authored commits
   and their own PR activity (opened / merged / commented-on) for
   the last 24-48 hours (default 36h — skip weekends if it's Monday).
4. **Pull recently closed tickets.** Run
   `composio search <issue-tracker>` for the list-issues tool, filter
   to `closed`/`done` in the same window, assignee = user. Skip if
   tracker isn't connected.
5. **Accept user notes.** If the user included inline notes ("today
   I'm tackling the OAuth migration"), parse them into the Today
   bucket.
6. **Assemble three bullets.**
   - **Yesterday** — what actually happened. Merge commits + PRs +
     closed tickets into 1-3 short bullets ("Shipped OAuth refresh
     (#412). Reviewed infra PR #414."). No one-commit-per-line; group
     by outcome.
   - **Today** — 1-3 short bullets, keyed to the engineering
     context's current priorities. Use any user-provided note
     verbatim; otherwise propose the next natural move ("finish the
     billing webhook retry tests") and name it as a proposal, not a
     commitment.
   - **Blockers** — any in-flight PR older than 24h awaiting review,
     any failing CI, anything the user flagged. If none, write
     "None." — don't invent blockers.
7. **Write** `standups/{YYYY-MM-DD}.md` atomically (`.tmp` → rename).
   Body is the three bullets only — no preamble, no sign-off. Ready
   to paste.
8. **Append to `outputs.json`** — type `"standup"`, status
   `"draft"`, 2-3-sentence summary naming the single biggest item
   and whether there are blockers. Read-merge-write atomically.
9. **Summarize to user** — one short line: "Standup at {path}. Edit
   and paste into Slack — **I don't post for you.**"

## Hard nos

- Never post the standup to Slack / Discord / Teams / anywhere.
  Composio-connected chat is for reading context, not for outbound
  on the user's behalf.
- Never pad the standup with prose. Three bullets, terse.
- Never invent blockers — "None." is a valid output.

## Outputs

- `standups/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `{ id, type: "standup", title,
  summary, path, status: "draft", createdAt, updatedAt }`.
