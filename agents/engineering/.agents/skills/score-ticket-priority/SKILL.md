---
name: score-ticket-priority
description: "Use when you say 'score this ticket' / 'RICE this' / 'MoSCoW these tickets' / 'is this worth doing' — I apply RICE (Reach × Impact × Confidence / Effort) or MoSCoW (Must / Should / Could / Won't) on a single ticket or a list, with one-line reasoning per axis, and a final ranking. Writes to `priority-scores/{slug}.md`."
integrations:
  dev: [linear, jira, github]
---

# Score Ticket Priority

RICE or MoSCoW on one ticket, or a list. Every axis gets a one-line
rationale. The output is a defensible table, not a vibe check.

## When to use

- User: "score this ticket" / "RICE {ticket}" / "MoSCoW these
  tickets" / "is this worth doing" / "rank these {n} tickets".
- Before a sprint planning session when the in-list is too long.

## Steps

1. **Read engineering context** —
   `context/engineering-context.md`. If missing or
   empty, say: "I need the engineering context doc first. Scoring
   without priorities is arbitrary. Run the
   `define-engineering-context` skill (5 minutes), then come back."
   Stop.
   Extract: top-3 current priorities, ICP / user-surface notes, any
   stated reach denominators (MAU, WAU, paying-seats — anything we
   know).
2. **Read `config/scoring-defaults.json`** if present — RICE reach
   units (monthly active users vs. total users vs. paid accounts)
   and any per-axis weight tweaks. If missing, ask once: "For RICE
   reach, do you want to measure against monthly active users,
   total accounts, or paying accounts? I'll save it for future
   scorings." Write and continue. (Skip this ask if framework is
   MoSCoW.)
3. **Confirm framework.** If the user specified RICE or MoSCoW,
   honor it. If unspecified, default to RICE and note why in the
   output ("You didn't pick — defaulting to RICE because it produces
   a sortable number. Switch with 'MoSCoW these' anytime.").
4. **Gather tickets.** Accept inline paste, a ticket URL, or a list
   of ticket IDs. If the user gave ticket IDs and the tracker is
   connected, fetch each via Composio
   (`composio search <issue-tracker>` → list-issue-by-id). Capture
   title, body, labels, and any linked PRs.
5. **For RICE** — score each ticket on four axes:
   - **Reach** (people affected per time window, in reach units) —
     rationale cites the denominator and any evidence from the
     engineering context.
   - **Impact** (0.25 / 0.5 / 1 / 2 / 3 — minimal / low / medium /
     high / massive).
   - **Confidence** (%, 50/80/100) — high if there's evidence; low
     when you're guessing. Name the evidence (or absence).
   - **Effort** (person-months or person-weeks — match the team
     scale).

   Score = `Reach × Impact × Confidence / Effort`. Rank the list
   descending by score.

6. **For MoSCoW** — sort each ticket into Must / Should / Could /
   Won't. Rationale per ticket names the priority it serves (or
   doesn't). Explicitly put low-alignment tickets in **Won't** — the
   framework is only useful when you're honest about the "Won't"
   bucket.
7. **Write** `priority-scores/{slug}.md` atomically (`.tmp` →
   rename). Slug: single-ticket → `{ticket-id}-{tag}.md`; list →
   `{topic-or-date}-{framework}.md`. Structure for RICE:

   ```markdown
   # Priority score — RICE — {topic}

   **Reach unit:** {MAU / paying-accounts / etc.}

   | Ticket | Reach | Impact | Confidence | Effort | Score | Notes |
   |---|---|---|---|---|---|---|
   | [ID] Title | 1,200 MAU | 1 | 80% | 3 pw | 320 | {one-line} |

   ## Per-axis reasoning

   ### [ID] Title — score {N}
   - **Reach:** {rationale, cites evidence}
   - **Impact:** {rationale}
   - **Confidence:** {rationale + evidence}
   - **Effort:** {rationale}
   ```

   For MoSCoW: 4 sections (Must / Should / Could / Won't), each a
   bulleted list of tickets with one-line rationales.

8. **Append to `outputs.json`** — type `"priority-score"`, status
   `"draft"`, 2-3-sentence summary naming the framework, the N
   scored, and the top item. Read-merge-write atomically.
9. **Summarize to user** — one paragraph: "Scored {N} tickets with
   {framework} at {path}. Top: {name + score}. **The scores are
   drafts — edit effort / confidence where I'm wrong and re-run.**"
   For lists: offer next step: "Want me to feed the top 3 into
   `plan-sprint`?"

## Hard nos

- Never score without reading the engineering context. Scoring
  without priorities is priority theater.
- Never invent a Confidence number — if evidence is thin, say "50%
  — no user data, author's gut" explicitly.
- Never write anything back to the tracker. The score is markdown.

## Outputs

- `priority-scores/{slug}.md`
- Appends to `outputs.json` with `{ id, type: "priority-score",
  title, summary, path, status: "draft", createdAt, updatedAt }`.
