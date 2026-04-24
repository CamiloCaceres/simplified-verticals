---
name: draft-reply
description: "Use when you say 'draft a reply for {id}' / 'draft my response' / 'answer this ticket' — I pull the customer dossier, match your voice from past sent messages, and write `conversations/{id}/draft.md` without sending. Addresses the specific ask (bug / how-to / billing) and never promises a date you haven't approved."
integrations:
  inbox: [gmail, outlook]
  helpdesk: [intercom, help_scout, zendesk]
---

# Draft Reply

## When to use

- You explicitly say "draft a reply for {conversation id}" or "draft
  my response."
- `scan-inbox` surfaced a thread in the morning brief and you
  clicked into it.
- A triaged conversation has status `open` / `waiting_founder` and
  no `draft.md` exists yet.
- **Never** called to send — this skill drafts only.

## Ledger fields I read

- `universal.positioning` — to know `context/support-context.md`
  exists; the doc carries product surface, voice, routing rules,
  forbidden phrases, and SLA tiers.
- `universal.voice` — sample summary + count. If missing or
  `sampleCount < 5`, run `voice-calibration` first (or ask you to
  paste 3–5 of your own recent replies).
- `domains.inbox.channels` — to know which Composio slug to pull
  the "sent" folder from for tone sampling.

If any required field is missing, ask ONE targeted question with a
modality hint (Composio connection > file drop > URL > paste),
write the field, and continue.

## Steps

1. **Read `context/support-context.md`.** If missing or empty, stop
   and tell me to run `define-support-context` first.
2. **Load the thread** from `conversations/{id}/thread.json`.
   Identify the latest customer message — that's what the draft
   responds to.
3. **Chain `customer-view view=dossier`** for the customer on this
   thread. Pull: plan, MRR, open bug-candidates, open followups
   (from `followups.json`), any `churn-flags.json` entry, last 3
   conversations from history.
4. **Sample my voice.** Read `config/voice.md`. If missing or
   sampleCount < 5, run `voice-calibration` first. Mirror my tone
   cues: greeting, sign-off, sentence length, whether I use the
   customer's first name. No "I apologize for the inconvenience."
   No corporate hedging.
5. **Draft the reply.** Match the ask:
   - **Bug** — acknowledge, confirm repro if possible, state the
     next step. Never promise a fix date I haven't approved — say
     "I'll get back to you with a timeline."
   - **How-to** — answer crisply, link to a KB article if one
     exists at `articles/{slug}.md` (check before linking).
   - **Billing** — state facts, propose an action (refund / credit /
     plan change). Escalate to me before committing.
   - **Churn language** — tight, honest, no guilt. Offer a genuine
     option; never promise what isn't policy in
     `context/support-context.md`.
6. **Append a dossier snippet** to `conversations/{id}/notes.md`
   (plan, MRR, open bugs, churn status) so I have context when
   approving.
7. **Write `conversations/{id}/draft.md`** atomically. Update the
   `conversations.json` entry: status = `waiting_founder`, refresh
   `updatedAt`.
8. **Append to `outputs.json`** with `type: "reply-draft"`,
   `domain: "inbox"`, title = "Reply to {customer} re {subject}",
   summary = the opening line, path.
9. **Chain `promise-tracker`.** If the draft contains a commitment
   ("I'll check with engineering by Friday", "I'll ship next week"),
   run `promise-tracker` so the due date lands in `followups.json`.

## Outputs

- `conversations/{id}/draft.md`
- `conversations/{id}/notes.md` (append dossier snippet)
- `conversations.json` entry update
- Appends to `outputs.json` with `type: "reply-draft"`,
  `domain: "inbox"`.

## What I never do

- Send the reply. You ship every outbound.
- Promise a date / refund / exception not in `context/support-context.md`.
- Invent customer history if the dossier is thin — mark UNKNOWN and
  ask.
