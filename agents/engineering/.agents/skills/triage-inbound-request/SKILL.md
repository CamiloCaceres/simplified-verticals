---
name: triage-inbound-request
description: "Use when a feature request, bug report, or idea arrives from outside engineering (user email, sales call note, support ticket, founder shower thought) — I classify it as roadmap-change / ticket / design-doc / skip with reasoning, and write a copy-paste prompt for whichever skill owns it next (plan-roadmap / triage-bug-report / draft-design-doc). Writes to `inbound-triage/{slug}.md`."
---

# Triage Inbound Request

Founders get feature requests from everywhere — users, sales calls,
customer emails, investor suggestions, their own shower thoughts.
Without a triage step, requests either pile up or get built
impulsively. This skill catches them and routes them.

## When to use

- "someone filed a feature request — where should this go?"
- "a user emailed us asking for {X} — triage it".
- "here's a sales call note about {pain} — what do we do with it".
- The founder has an idea and wants to know if it's roadmap-sized,
  sprint-sized, design-doc-sized, or not-this-quarter-sized.

## Steps

1. **Read engineering-context.md** (own file). If missing, STOP —
   tell the user to run `define-engineering-context` first. Routing
   without knowing our priorities or quality bar is coin flipping.

2. **Ingest the raw request.** The founder will paste raw text (user
   email, call note, Slack DM, idea one-liner) or give a URL. Fetch
   the URL if needed via `composio search web-scrape`. Never edit or
   clean up the language — preserve the user's verbatim ask so
   downstream agents see what the requester actually said.

3. **Extract 4 fields from the request** (ask ONE question only if
   a field is genuinely unclear from the raw text):
   - **Who** — the requester (user / prospect / internal / founder).
   - **What** — the feature or change, in one sentence.
   - **Why** — the pain or outcome they're after, in one sentence.
   - **Evidence** — how strong is the signal? Is this one user, a
     pattern, or an investor opinion?

4. **Classify.** Pick ONE verdict:

   - **`roadmap-change`** — significant enough to alter the current
     quarter's plan. Signal: bigger than a ticket, multiple users or
     a strategic driver, changes priority ordering. Route to HoE's
     own `plan-roadmap` (or flags a delta on the current roadmap).
   - **`ticket`** — small, well-scoped, actionable today. Signal: one
     user pain, known fix, fits in a sprint. Route to `backlog-triage`.
   - **`design-doc`** — technical question or architectural change
     that needs thinking before it becomes a ticket. Signal: "should
     we" or "how would we", multiple valid approaches, breaking
     changes. Route to `tech-lead`.
   - **`skip`** — off-strategy, solved elsewhere, one-off preference,
     or insufficient signal. Name the reason; write a kind
     user-facing decline note the founder can send back.

   A request can only get ONE verdict. If you find yourself wanting
   two, split the request into two and triage each.

5. **State reasoning.** Two or three sentences. Cite the context
   doc's priorities when the verdict is `skip` or `roadmap-change`.
   Cite the quality bar when the verdict is `design-doc`. No
   hand-waving.

6. **Write the copy-paste handoff prompt.** Exact text the founder
   sends to the receiving agent's chat. Examples:
   - `roadmap-change` → paste to HoE chat:
     *"Re-evaluate Q{n} roadmap. Inbound: {summary}. Evidence:
     {signal}. Use plan-roadmap; cite this triage doc at
     {path}."*
   - `ticket` → paste to `backlog-triage` chat:
     *"Triage this incoming request to a ticket: {verbatim ask
     with requester attribution}. Use triage-bug-report or
     score-ticket-priority as applicable."*
   - `design-doc` → paste to `tech-lead` chat:
     *"Draft a design doc exploring: {question}. Constraints from
     context doc: {cite}. See triage at {path}."*
   - `skip` → user-facing decline message:
     *"Thanks for flagging {feature}. We're not planning to
     build this right now because {reason}. {What we ARE doing
     that might help}."*

7. **Structure the output (markdown, ~200-400 words),
   `inbound-triage/{slug}.md`:**

   1. **Source** — requester, channel, date.
   2. **Verbatim request** — quoted, unedited.
   3. **Extracted fields** — who / what / why / evidence.
   4. **Verdict** — one of `roadmap-change` / `ticket` /
      `design-doc` / `skip`.
   5. **Reasoning** — 2-3 sentences citing context doc.
   6. **Handoff prompt** — exact copy-paste text.
   7. **Follow-up** — what to watch for (e.g. "if 2 more users ask
      for this in the next 30 days, flip to roadmap-change").

8. **Never invent the user's pain.** If the request is vague,
   mark fields as `UNKNOWN — ask the requester for {specific
   follow-up question}`.

9. **Write atomically** to `inbound-triage/{slug}.md` — `{path}.tmp`
   then rename. `{slug}` is kebab-case of a short summary (e.g.
   `inbound-triage/sso-saml-enterprise.md`).

10. **Append to `outputs.json`.** Read-merge-write atomically:

    ```json
    {
      "id": "<uuid v4>",
      "type": "inbound-triage",
      "title": "Triage — <short summary>",
      "summary": "<2-3 sentences — verdict + why + target agent>",
      "path": "inbound-triage/<slug>.md",
      "status": "ready",
      "createdAt": "<ISO-8601>",
      "updatedAt": "<ISO-8601>"
    }
    ```

    (Triage is a factual routing decision — ships as `ready`, not
    `draft`.)

11. **Summarize to user.** One paragraph: verdict + receiving agent
    + the copy-paste prompt + path to the artifact.

## Outputs

- `inbound-triage/{slug}.md`
- Appends to `outputs.json` with `type: "inbound-triage"`.
