---
name: write-adr
description: "Use when you say 'write an ADR for {decision}' / 'record this decision' / 'ADR for {choice}' — I produce a Michael Nygard-style Architecture Decision Record with Title, Status, Context, Decision, and Consequences, so future-you (or a new hire) understands WHY the decision was made, not just what it was. Writes to `adrs/{YYYY-MM-DD}-{slug}.md`."
---

# Write ADR

## When to use

- Explicit: "write an ADR for {decision}", "record this decision as
  an ADR", "ADR for {X}", "capture why we chose {X} over {Y}".
- Implicit: the user just made a meaningful architectural choice
  (DB, framework, boundary, protocol, data-flow) in conversation
  and the decision is worth preserving.
- One ADR per decision. New information? Write a new ADR that
  supersedes the old one — don't edit in place.

## Steps

1. **Read engineering context**:
   `context/engineering-context.md`. If missing,
   tell the user to run `define-engineering-context` first and stop.
   The current stack is part of the ADR's Context section.
2. **Read config**: `config/stack.json` if present. Useful if the
   decision is stack-local.
3. **If the decision is ambiguous, ask ONE question** — what the
   alternatives were and why this one won. Best modality: paste, or
   point at the design-doc that led to the decision.
4. **Optional web-search** via `composio search web-search` if the
   decision references prior art / canonical sources worth citing in
   Context.
5. **Draft the ADR** to `adrs/{YYYY-MM-DD}-{slug}.md` atomically
   (`*.tmp` → rename). Michael Nygard template:
   - **Title** — `ADR-{nnn}: {decision in one line}`. Use the next
     sequential number by scanning existing files in `adrs/` (start
     at `001` if empty).
   - **Status** — one of `Proposed` / `Accepted` / `Deprecated` /
     `Superseded by ADR-{nnn}`. Default to `Accepted` if the user
     says the decision is made, `Proposed` otherwise.
   - **Context** — 1-3 paragraphs. Why this decision is being made
     now, what forces are at play (technical, organizational,
     product). Ground in the engineering context doc.
   - **Decision** — the change that was chosen. Active voice, clear.
     ("We will use Postgres for the orders service.")
   - **Consequences** — positive, negative, and neutral. What becomes
     easier, what becomes harder, what trade-offs we're signing up
     for. Be honest about the downsides — the point of an ADR is
     that future-them can audit the reasoning.
   One page is the target. Padding defeats the purpose.
6. **If this ADR supersedes an earlier one**, update the earlier
   ADR's Status line to `Superseded by ADR-{nnn}` (atomic write) and
   note it in the new ADR's Context.
7. **Append to `outputs.json`** — `{ id, type: "adr", title,
   summary, path, status: "ready" (if Accepted) or "draft" (if
   Proposed), createdAt, updatedAt }`, atomic write.
8. **Summarize to user** — one paragraph with the decision, the
   key consequence, and the path to the ADR.

## Never invent

The Decision section must match what the user actually chose. If
you're inferring — say "I inferred X from our conversation; is that
right?" before writing. Don't fabricate trade-offs.

## Outputs

- `adrs/{YYYY-MM-DD}-{slug}.md`
- Updates earlier ADR's Status line if superseded.
- Appends to `outputs.json` with type `adr`.
