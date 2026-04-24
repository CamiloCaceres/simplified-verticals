---
name: voice-calibration
description: "Use when you say 'calibrate my voice' / 'train on how I write' — I pull 10–20 recent outbound replies from your connected inbox (Gmail / Outlook / Intercom / Help Scout), extract tone cues (greeting, sign-off, sentence length, quirks), and write `config/voice.md`. Every `draft-reply` and `write-article` reads this before drafting."
integrations: [gmail, outlook, intercom, help_scout]
---

# Voice Calibration

## When to use

- "calibrate my voice" / "train on how I write" / "pull my sent
  replies."
- After `define-support-context` when the voice section is `TBD`.
- Re-run whenever you say your tone has drifted or you want me to
  re-learn from recent replies.

## Ledger fields I read

- `domains.inbox.channels` — to know which Composio slug to search
  the "sent" folder against.

## Steps

1. **Read `context/support-context.md`.** If missing, run
   `define-support-context` first (or stop and tell me to).

2. **Discover the connected inbox.** Run `composio search inbox` or
   `composio search email-sent` (try both — the exact slug depends
   on which provider you have linked: Gmail, Outlook, Intercom,
   Help Scout, Zendesk, etc.). If no inbox is connected, tell me
   which category to link (connect one of: Gmail, Outlook, Intercom,
   Help Scout, Zendesk) and stop.

3. **Pull 10–20 recent outbound replies.** Execute the list-sent /
   search-sent tool slug. Filter to replies that look like support
   (thread depth > 1, or label/folder contains `support`, or
   recipient not internal). Aim for 10–20 most recent.

4. **Extract tone cues from the samples:**
   - Greeting pattern (e.g. "Hey Jane," vs "Hi," vs no greeting).
   - Sentence length — short / medium / long.
   - Formality — casual / professional / direct.
   - Signature / sign-off convention.
   - Repeated phrases or quirks ("I'll dig in," "to be clear,"
     em-dash use, etc.).
   - Forbidden-sounding phrases that would look wrong coming from
     them (e.g. "I apologize for the inconvenience").

5. **Write `config/voice.md`** atomically. Include:
   - A one-paragraph tone summary (direct / warm / human, specific
     traits).
   - 3–5 verbatim excerpts (the shortest-but-most-representative)
     with PII redacted via `{Customer}` / `{Email}` placeholders.
   - "Forbidden phrases" bullet list.

6. **Update `context/support-context.md`.** Read the current doc,
   find the Tone + voice section, replace with a 2-sentence summary
   that points to `config/voice.md` for the full detail. Write
   atomically (`.tmp` → rename).

7. **Update `universal.voice` in `config/context-ledger.json`** —
   `summary`, `sampleSource`, `sampleCount`, `capturedAt`.

8. **Append to `outputs.json`** with `type: "voice-calibration"`,
   `domain: "quality"`, title "Voice calibrated from {N} samples",
   summary = 2 sentences, path = `config/voice.md`, status `ready`.

9. **Summarize to me.** One paragraph: what the tone looks like
   ("direct, warm, em-dash heavy; never apologizes for inconvenience")
   and one line reminding me every draft-reply / lifecycle-message
   / article in this agent now pulls from this.

## Outputs

- `config/voice.md` (raw samples + tone summary)
- `context/support-context.md` (voice section summary pointer)
- `config/context-ledger.json` (`universal.voice` block)
- Appends to `outputs.json` with `type: "voice-calibration"`,
  `domain: "quality"`.
