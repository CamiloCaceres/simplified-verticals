---
name: draft-design-doc
description: "Use when you say 'draft a design doc for {feature}' / 'write an RFC for {feature}' / 'design this before I build it' — I produce a full design doc with Context, Goals, Non-goals, Proposed design, Alternatives considered, Risks, and Open questions, grounded in the engineering context. Names at least two real alternatives, not strawmen. Writes to `design-docs/{feature-slug}.md`."
integrations: [github, exa, perplexityai]
---

# Draft Design Doc

## When to use

- Explicit: "draft a design doc for {feature}", "write an RFC",
  "design {feature} before I build it", "what's the design for
  {feature}".
- Implicit: the user describes a non-trivial feature they're about
  to build and asks for shape / approach.
- One doc per feature; re-run to iterate a v2.

## Steps

1. **Read engineering context**:
   `context/engineering-context.md`. If missing or
   empty, tell the user: "I need the engineering context doc before
   I can design anything well. Go chat with this agent's own `define-engineering-context`
   and run `define-engineering-context` first." Stop. The stack,
   invariants, and current priorities shape the whole doc.
2. **Read config**: `config/stack.json` and
   `config/sensitive-areas.md`. Cross-reference the feature against
   sensitive areas and call that out in the Risks section.
3. **If the feature brief is a one-liner, ask ONE clarifying
   question** — the user-facing problem being solved, or the
   scope boundary. Best modality: a connected issue-tracker (run
   `composio search issue-tracker` at runtime), paste, or URL to
   the linked issue. Continue.
4. **Optional research** via `composio search web-search` for prior
   art if the problem is novel to the stack — cite any sources used
   in the Alternatives section.
5. **Draft the doc** to `design-docs/{feature-slug}.md` atomically
   (`*.tmp` → rename). Sections, in order:
   - **Context** — why this is being designed now. One paragraph.
     Link the originating issue or conversation if known.
   - **Goals** — what this feature must do. Bulleted.
   - **Non-goals** — what this feature explicitly will NOT do.
     Non-goals are as load-bearing as goals.
   - **Proposed design** — the recommended approach. Data model,
     API surface, key flows, integration points, failure modes.
     Include a simple ASCII or mermaid-style sketch if the shape
     matters.
   - **Alternatives considered** — at least 2 real alternatives
     with the one-line reason each was rejected. Strawman
     alternatives don't count.
   - **Risks** — what could go wrong. Flag sensitive-area overlaps
     explicitly.
   - **Open questions** — what the doc doesn't resolve yet.
6. **Append to `outputs.json`** — `{ id, type: "design-doc", title,
   summary, path: "design-docs/{feature-slug}.md", status: "draft",
   createdAt, updatedAt }`, atomic write.
7. **Summarize to user** — the chosen approach, the top rejected
   alternative, the biggest risk, and the path to the doc. Ask for
   sign-off to flip status to `ready`.

## Never invent

If the stack doesn't support something the user asked for, say so
and propose the closest alternative — don't assume a library exists.
Mark any assumption you had to make so the user can correct it.

## Outputs

- `design-docs/{feature-slug}.md`
- Appends to `outputs.json` with type `design-doc`.
