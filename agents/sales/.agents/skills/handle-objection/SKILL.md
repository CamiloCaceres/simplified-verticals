---
name: handle-objection
description: "Use when you say 'they said \"{objection}\" — draft my reframe' / 'how do I handle \"{objection}\"' — I look up the objection in your playbook and recent call insights, then draft a 3-sentence in-call reframe (acknowledge → concrete anchor-account example → dated next step) plus a short post-call email in your voice. Writes to `deals/{slug}/objections/{YYYY-MM-DD}-{slug}.md`."
---

# Handle Objection

Single-objection handler. Two outputs: the in-call reframe (short,
verbal) and the post-call follow-up email (short, written).

## When to use

- "they said '{objection}' on the {deal} call — draft my reframe".
- "how do I handle '{objection}'".
- Called by `analyze subject=discovery-call` for any OBJECTION
  surfaced in the call.

## Steps

1. **Read the playbook.** Load `context/sales-context.md`.
   Find the matching entry in the Objection handbook. If the playbook
   is missing, ask the user to run `define-playbook` first and stop.

2. **Read the ledger.** Load `config/context-ledger.json`. The
   `universal.icp` field grounds the reframe; progressive captures
   there may supersede the playbook's initial objection list.

3. **Check recent call-insights** — read `call-insights/*.md` (top 3
   most recent) for any pattern that touched this objection. Prefer
   verbatim successful reframes from past calls.

4. **Draft the in-call reframe (3 sentences):**

   1. **Acknowledge** — don't backpedal, don't dismiss.
   2. **Reframe** with a concrete customer example or data point
      (use anchor accounts from `context/sales-context.md`).
   3. **Propose the next step** — specific, time-boxed.

5. **Draft the post-call follow-up email** — 5–8 lines:

   - Subject: "Re: {their pain, in their words}"
   - Open: confirm we heard them.
   - 2–3 bullets: facts/proof addressing the specific objection.
   - Close: concrete next step + date.

   Match voice from `config/voice.md` (or capture samples on first
   run if missing).

6. **Write atomically** to
   `deals/{slug}/objections/{YYYY-MM-DD}-{slug}.md.tmp` → rename.
   Structure: objection (verbatim) · reframe (3 lines) · follow-up
   email (body) · sources (playbook + calls referenced).

7. **Update the ledger** — if this objection surfaced a new variant,
   append it to `universal.icp.pains` via an atomic read-merge-write
   of `config/context-ledger.json`.

8. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "objection",
     "title": "Objection — {objection short}",
     "summary": "<reframe first line + follow-up CTA>",
     "path": "deals/{slug}/objections/{date}-{slug}.md",
     "status": "draft",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

9. **Summarize.** Print the 3-sentence reframe inline so the user can
   use it verbally on the next touch. Path to the full artifact.

## Outputs

- `deals/{slug}/objections/{YYYY-MM-DD}-{slug}.md`
- Possibly updates `config/context-ledger.json`.
- Appends to `outputs.json` with `domain: "meetings"`, type
  `objection-reframe`.
