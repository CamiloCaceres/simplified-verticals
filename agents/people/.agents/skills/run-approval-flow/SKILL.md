---
name: run-approval-flow
description: "Use when you say 'review this {PTO / comp / promotion / expense} request' / 'approve this ask' / 'should we {X}' — reads the approval rubric from `context/people-context.md`, evaluates the request, classifies it as approved / escalate / denied with reasoning, and produces an escalation note for out-of-rubric asks. Writes to `approvals/{request-slug}.md`."
integrations: [slack, notion]
---

# Run Approval Flow

## When to use

- Explicit: "review this {PTO / comp / promotion / expense}
  request", "approve this ask", "should we {X}", "run the
  approval check on {request}".
- Implicit: routed from the helpdesk channel when a team member
  files a request that needs a rubric check.
- Frequency: per request.

## Steps

1. **Read people-context doc.** Read
   `context/people-context.md` for the relevant rubric
   section — PTO policy, comp bands by level, promotion criteria,
   expense thresholds, and the escalation rules (who the
   out-of-rubric note routes to). If missing or empty, tell the
   user: "I need your people-context doc first — run the define-people-context skill."
   Stop.
2. **Read config.** `config/context-ledger.json` (HRIS) for any HRIS data needed to
   contextualize the request (employee level for comp checks,
   tenure for PTO accrual, manager chain for promotion). HRIS is
   read-only.
3. **Parse the request.** Extract: requester (employee-slug),
   request type (PTO / comp / promotion / expense / other),
   amount / dates / scope, justification if provided. If any
   required field is missing, ask ONE targeted question.
4. **Evaluate against the rubric.** Walk each rubric criterion and
   record a PASS / FAIL / N/A with a one-line reason tied to the
   exact rubric clause (e.g. "PASS — within band range for L3
   per people-context § Comp bands").
5. **Classify** into exactly one of three buckets:
   - **Approved** — all required criteria PASS. Draft a short
     approval note.
   - **Escalate** — the request is out of band (comp delta beyond
     a band, PTO beyond policy, promotion outside cycle, expense
     over threshold) OR the rubric is silent. Draft the escalation
     note routing to the named human per the escalation rules —
     never approve a request that falls outside the rubric
     without surfacing the exception for founder sign-off.
   - **Denied** — one or more criteria FAIL with a clear "not
     permitted" in the rubric. Draft the denial reasoning in
     plain, non-hedging language — citing the clause.
6. **Write** the decision memo atomically to
   `approvals/{request-slug}.md` (`*.tmp` → rename). Include:
   classification bucket at the top, the full PASS/FAIL walk of
   rubric criteria, the reasoning, and the drafted reply or
   escalation note. Never send — founder sends after sign-off.
7. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "approval", title, summary, path, status:
   "draft", createdAt, updatedAt }`. Summary leads with the
   classification bucket. Write atomically.
8. **Summarize to user** — one paragraph: classification, the
   one-sentence reason, and the path to the memo.

## Never

- Never auto-approve an out-of-rubric request to be "helpful."
  Escalate every exception.
- Never deny on vibes. Every denial cites a specific rubric clause.
- Never modify HRIS records. Reads only.
- Never send the reply directly — founder sends after review.

## Outputs

- `approvals/{request-slug}.md` (classification + reasoning + draft
  reply or escalation note).
- Appends to `outputs.json` with type `approval` and the
  classification bucket in the summary.
