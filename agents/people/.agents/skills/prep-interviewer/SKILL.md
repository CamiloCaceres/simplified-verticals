---
name: prep-interviewer
description: "Use when you say 'prep me to interview {candidate}' / 'what should I ask {candidate}' / 'interview brief for {candidate}' — builds the interviewer-side brief: background summary, likely questions, red flags to probe, reference themes, scoring rubric. Writes to `interview-loops/{candidate-slug}.md`. Flipped from candidate-side prep — this is for you."
integrations: [notion, linkedin]
---

# Prep Interviewer

## When to use

- Explicit: "prep me to interview {candidate}", "what should I ask
  {candidate}", "interview brief for {candidate}", "brief me for
  the {candidate} loop".
- Implicit: called as a dependency by `coordinate-interviews` —
  every panelist needs a tailored brief.
- One invocation = one interviewer-side brief. If briefing a panel,
  call me per interviewer via `coordinate-interviews`.

## Steps

1. **Read people-context doc** at
   `context/people-context.md`. If missing or empty, tell
   the user: "I need your people context first — run the define-people-context skill." Stop.
   Pull the leveling framework, values, and escalation rules.
2. **Read the req.** Open `reqs/{role-slug}.md` for the criteria
   rubric. If missing, ask ONE targeted question and write it.
3. **Read the candidate record.** Open
   `candidates/{candidate-slug}.md`. If missing, tell the user:
   "No record for {candidate}. Run `screen-resume` or
   `score-candidate` first so I have something to brief from." Stop.
4. **Read the existing loop file** if present at
   `interview-loops/{candidate-slug}.md` — to avoid duplicating
   questions already assigned to other panelists.
5. **Ask for the interviewer's focus** if not already stated — ONE
   question: "Who's conducting the interview and what's their focus
   area (e.g. technical, systems, leadership, values)?" This scopes
   which rubric criteria this interviewer owns.
6. **Build the brief.** Structure:
   - **Candidate background summary** — 3-5 sentences drawn from
     the candidate record. No invention; cite where each claim comes
     from (screen / LinkedIn / sourcing signal).
   - **This interviewer's focus areas** — 2-3 rubric criteria they
     own for this loop.
   - **6-10 likely questions** scoped to those focus areas, each
     with a one-line "what a strong answer looks like".
   - **3-5 red flags to probe** — pulled from the candidate record's
     red-flag list. Include the question to surface each flag.
   - **Reference themes** — topics to cover in a future reference
     call (if the loop progresses).
   - **Scoring rubric** — per question: 0-3 bar with exemplars,
     tied back to the people-context leveling framework for this
     level.
7. **Write to `interview-loops/{candidate-slug}.md`.** Append a new
   dated `## Interviewer brief — {interviewer name} — {YYYY-MM-DD}`
   section — never overwrite. If the file doesn't exist, create it
   with a header stub then the brief section. Atomic write
   (`*.tmp` → rename).
8. **Append to `outputs.json`** — `{ id, type: "interview-prep",
   title, summary, path: "interview-loops/{candidate-slug}.md",
   status: "draft", createdAt, updatedAt }`, write atomically.
9. **Summarize to user** — one paragraph: interviewer named, focus
   areas, top 3 questions, path to the loop file.

## Never invent

- Every candidate claim in the background summary must trace to the
  candidate record. If something is UNKNOWN there, it's UNKNOWN here.
- Never draft questions that probe protected-class attributes.
- Never generate candidate-side prep (what the candidate should say) —
  this skill is interviewer-side only.

## Outputs

- `interview-loops/{candidate-slug}.md` (appended; created if
  missing).
- Appends to `outputs.json` with type `interview-prep`.
