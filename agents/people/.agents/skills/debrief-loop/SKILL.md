---
name: debrief-loop
description: "Use when you say 'synthesize {candidate}'s panel feedback' / 'hire or no-hire on {candidate}' / 'debrief the loop' — aggregates interviewer feedback from Slack, Notion, or paste, extracts themes, surfaces contradictions, scores against the rubric, and produces a hire / no-hire decision memo at `interview-loops/{candidate-slug}-debrief.md`. Recommendation only — you decide."
integrations: [slack, notion]
---

# Debrief Loop

## When to use

- Explicit: "synthesize {candidate}'s panel feedback", "hire or
  no-hire on {candidate}", "debrief the loop", "decision memo for
  {candidate}".
- Prerequisite: at least 2 interviewer feedback blocks exist (either
  appended to the loop file, pasted by the user, or pulled via a
  connected chat / collab tool).
- One invocation per candidate loop. Append — don't overwrite —
  prior debriefs.

## Steps

1. **Read people-context doc** at
   `context/people-context.md`. If missing or empty, tell
   the user: "I need your people context first — run the define-people-context skill." Stop.
   Pull the leveling framework for the target level, values, hard nos,
   and escalation rules.
2. **Read the req.** Open `reqs/{role-slug}.md` for the criteria
   rubric.
3. **Read the loop file.** Open
   `interview-loops/{candidate-slug}.md`. If missing, tell the user
   no loop file exists yet and stop.
4. **Gather interviewer feedback.** Look for `## Feedback —
   {interviewer}` sections in the loop file. If the user said
   feedback lives elsewhere, run `composio search chat` or
   `composio search collab` to discover the tool slug and fetch the
   threads / pages the user points at. If pasting: accept paste and
   move on. If nothing is available, ask ONE question: "Where's the
   feedback? I can pull from Slack / Notion / Linear, or you can
   paste."
5. **Extract themes.** Cluster feedback into:
   - **Strengths** — claims multiple panelists agree on.
   - **Concerns** — claims multiple panelists agree on.
   - **Contradictions** — where panelists disagreed; surface the
     disagreement and propose what would resolve it (reference
     call, follow-up interview, skip).
   - **UNKNOWNs** — rubric criteria that nobody covered.
6. **Score against the rubric.** Per rubric criterion, aggregate
   panelist scores where provided; fill gaps with "not assessed"
   where UNKNOWN. Overall band: **hire / borderline / no-hire**.
7. **Produce the decision memo.**
   - Recommendation: hire / no-hire.
   - Confidence: low / medium / high — and why.
   - Reasoning: 3-5 sentences linking themes + rubric scores.
   - Risks if we hire: 2-3 bullets.
   - Risks if we pass: 2-3 bullets (e.g. pipeline re-opens, timing).
   - Reference themes to verify — 3-5 questions to ask references.
   - **Explicit "Recommendation only — founder decides" footer.**
8. **Check escalation rules.** If any feedback touches protected-
   class topics, anti-discrimination concerns, or legal-sensitive
   matters, STOP the memo and surface an escalation note pointing
   to a human lawyer per the escalation-rules section in
   context/people-context.md. Do not produce a recommendation on those
   grounds.
9. **Write the memo.** Append a dated
   `## Debrief — {YYYY-MM-DD}` section to
   `interview-loops/{candidate-slug}.md`. Atomic write
   (`*.tmp` → rename). Never overwrite prior sections.
10. **Append to `outputs.json`** — `{ id, type: "debrief", title,
    summary, path: "interview-loops/{candidate-slug}.md",
    status: "draft", createdAt, updatedAt }`, write atomically.
11. **Summarize to user** — one paragraph: recommendation,
    confidence, top reason, top risk, path to the memo.

## Never invent

- Never invent interviewer feedback. If a panelist didn't weigh in,
  it's UNKNOWN.
- Never collapse contradictions into a false consensus — surface
  them.
- Never make the final hire/fire call; always "Recommendation only".
- Never write under `.houston/<agent>/`.

## Outputs

- `interview-loops/{candidate-slug}.md` (decision memo appended).
- Appends to `outputs.json` with type `debrief`.
