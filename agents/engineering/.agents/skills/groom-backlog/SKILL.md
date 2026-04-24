---
name: groom-backlog
description: "Use when you say 'groom the backlog' / 'clean up the backlog' / 'what's stale' / 'prune the queue' — I pull all open tickets from Linear, Jira, or GitHub Issues and return three review lists (keep-and-prioritize / merge-as-duplicates / close-as-stale), each with one-line rationales. Writes to `backlog-grooming/{YYYY-MM-DD}.md`. Never closes, merges, or reprioritizes tickets in the tracker — you review and act."
integrations: [linear, jira, github]
---

# Groom Backlog

Weekly backlog pass. Three lists. You decide what actually happens
in the tracker.

## When to use

- User: "groom the backlog" / "clean up the backlog" / "what's
  stale" / "prune the queue" / "weekly grooming".
- As a recurring weekly rhythm for a long-lived backlog.

## Steps

1. **Read engineering context** —
   `context/engineering-context.md`. If missing or
   empty, say: "I need the engineering context doc first. Run the
   `define-engineering-context` skill (5 minutes), then come back."
   Stop.
2. **Read `domains.planning.tracker` from the context ledger
   (`config/context-ledger.json`).** If missing, ask ONE question:
   "I don't know where your tickets live. Which tracker — Linear,
   Jira, GitHub Issues, ClickUp, Asana, or Notion?" Write to the
   ledger atomically and continue.
3. **Read `config/cadence.md`** so the week number used in the output
   filename matches the user's rhythm. Read any
   `staleThresholdDays` override in `config/issue-tracker.json` —
   default is 90 days with no activity if not set.
4. **Fetch open tickets via Composio.** Run
   `composio search <issue-tracker>` to find the list-issues tool
   slug for the connected tracker, then call it. If the tracker
   isn't connected, stop and tell the user which category to link.
   For each ticket capture: id, title, URL, labels / tags, assignee,
   createdAt, updatedAt, lastActivityAt (comments + state changes),
   priority field, and the first ~200 chars of the body.
5. **Build list 1 — keep-and-prioritize.** Score each ticket by
   alignment with the current-priorities section of the engineering
   context. Keep the top N (default 15; halve if the user's tracker
   has <30 open tickets). For each, a one-line rationale tying it to
   a named priority or a named user-surface / quality-bar item.
6. **Build list 2 — merge-as-duplicates.** Group tickets by
   normalized-title similarity + body keyword overlap (cheap
   heuristic — not a model call). For each group pick a canonical
   ticket (the one with the most activity / best body) and note the
   others as likely dupes. One-line rationale per group ("same
   symptom — 500 on POST /auth/login — filed 3 times since March").
   A group is only worth listing if it has 2+ members.
7. **Build list 3 — close-as-stale.** Tickets with
   `lastActivityAt` older than the stale threshold (default 90
   days). One-line rationale per ticket ("no activity since
   2025-11-18; labeled P3; no recent duplicates"). Explicitly
   exclude anything with labels that hint at long-term tracking
   (e.g. `epic`, `parent`, `roadmap`, `paused`) — name those
   exclusions in a short "Not-stale despite age" footnote.
8. **Write** `backlog-grooming/{YYYY-Www}.md` atomically (`.tmp` →
   rename). Structure:

   ```markdown
   # Backlog grooming — {ISO-week}

   **Stale threshold:** {N} days. **Open tickets scanned:** {count}.

   ## Keep and prioritize (top {N})
   - [TICKET-ID] Title — rationale. {URL}

   ## Merge as duplicates (you review, you merge)
   **Group 1** — rationale. Canonical: [TICKET-ID]. Dupes: [...]

   ## Close as stale (you review, you close)
   - [TICKET-ID] Title — last activity {date}, rationale. {URL}

   ## Not-stale despite age (kept)
   - [TICKET-ID] {reason}
   ```

9. **Append to `outputs.json`** — type `"backlog-grooming"`, status
   `"draft"`, 2-3-sentence summary naming the open-ticket count and
   the sizes of the three lists. Read-merge-write atomically.
10. **Summarize to user** — one paragraph: "Grooming pass at {path}.
    {X} to keep, {Y} dupe groups, {Z} stale. **I have not closed,
    merged, or reprioritized anything — the tracker is yours.**
    Skim the three lists, act on what you agree with."

## Hard nos

- **Never actually close, merge, or reprioritize tickets in the
  tracker.** No tracker writes, ever. The output is a list you
  review.
- Never auto-prune — even if a ticket clearly matches stale criteria,
  it lands in the list for review, not in a "close" call.
- Never invent tickets that aren't in the tracker.

## Outputs

- `backlog-grooming/{YYYY-Www}.md`
- Appends to `outputs.json` with `{ id, type: "backlog-grooming",
  title, summary, path, status: "draft", createdAt, updatedAt }`.
