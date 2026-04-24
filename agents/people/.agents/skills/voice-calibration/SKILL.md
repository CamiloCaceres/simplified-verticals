---
name: voice-calibration
description: "Use when you say 'calibrate my HR voice' / 'sample my past offers' / 'learn how I write for HR comms' — pulls recent HR outbound (offers, onboarding notes, feedback) from your connected inbox (Gmail or Outlook), extracts a tone fingerprint (greeting habits, closing habits, sentence length, formality), and appends it to the voice-notes section of `context/people-context.md`."
integrations: [gmail, outlook]
---

# Voice Calibration

Offers, rejections, team announcements, PIPs, stay conversations —
every skill in this agent drafts against your voice. This skill
samples how you actually write HR comms and writes a tone fingerprint
into `context/people-context.md` that every downstream draft
references.

## When to use

- "calibrate my HR voice" / "sample my past offers" / "learn how I
  write for HR comms".
- "refresh the voice notes in the people-context doc".
- Called implicitly by `define-people-context` when the voice-notes
  section is thin or stale.

## Steps

1. **Read people-context doc** (own file): `context/people-context.md`. Read
   the existing voice-notes section so this run is an append / merge,
   not an overwrite. If the doc is missing, run
   `define-people-context` first.

2. **Pick the source — ask ONE tight question if not obvious, with
   modality hint:**
   - "I can pull 10-20 of your recent HR-ish outbound messages from
     your connected inbox, or you can paste 3-5 samples. Which?"
   - Connected: run `composio search inbox`; identify sent messages
     tagged with HR-relevant recipients (candidates, team); fetch.
   - Pasted: take the paste verbatim.

3. **If connected, fetch.** Execute the discovered inbox tool's
   list-sent-messages slug. Filter to HR-adjacent messages —
   candidates, employees, team-wide announcements. If the inbox
   can't distinguish, ask you for a label / folder name or a
   date window. Capture: send date, recipient role (inferred),
   subject, body.

4. **Extract the tone fingerprint.** For each sample, note:
   - **Greeting pattern** — "Hey {name}," vs "Hi {name} —" vs "{name},"
   - **Closing pattern** — "Talk soon,", "—{firstname}", "Best,".
   - **Sentence length** — average and range.
   - **Formality level** — 1 (casual) to 5 (formal).
   - **Forbidden phrases** — anything the founder clearly never says
     (e.g. never "circle back", never "synergy", never "reach out").
   - **Quirks** — em-dashes vs commas, one-line paragraphs vs dense,
     emoji usage, signoff variations, how they deliver hard news.
   - **Hard-news register** — specifically how they write rejections,
     layoff notices, PIP intros. Different from celebratory
     messages; capture separately.

5. **Synthesize across the batch.** Roll into 4-6 bullets:
   - Greeting habits.
   - Sentence length / cadence preference.
   - Formality level.
   - Forbidden phrases.
   - Hard-news register.
   - Any distinctive quirk.

   Plus 3-5 verbatim excerpts (short — 2-3 sentences each) that
   exemplify the voice.

6. **Append to the voice-notes section of `context/people-context.md`.** Do
   NOT overwrite the section — merge. Preserve anything the founder
   has already sharpened. Write atomically to
   `context/people-context.md.tmp` then rename.

7. **Also refresh `config/voice.md`** — same voice fingerprint, same
   verbatim excerpts, so future skills can read it locally without
   re-parsing the shared doc. Atomic write.

8. **Append to `outputs.json`.** Read-merge-write atomically — this
   is a summary entry pointing at the update, not a standalone file:

   ```json
   {
     "id": "<uuid v4>",
     "type": "voice-calibration",
     "title": "Voice calibrated — <YYYY-MM-DD>",
     "summary": "<2-3 sentences — N samples mined, top 3 fingerprint notes, what changed in context/people-context.md>",
     "path": "context/people-context.md",
     "status": "ready",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

   (The entry points at the live doc since there's no standalone
   artifact — the voice notes live inside `context/people-context.md`.)

9. **Never invent.** Every quirk / fingerprint bullet must trace to
   actual samples. If the sample set is too thin (< 5 messages), say
   so and stop — a shaky fingerprint is worse than none.

10. **Summarize to user.** One paragraph: N samples mined, top 3
    fingerprint bullets, where it landed in the people-context doc,
    what the other agents will now draft better.

## Outputs

- Updates the voice-notes section of `context/people-context.md` (live doc).
- Refreshes `config/voice.md` with the new fingerprint + excerpts.
- Appends to `outputs.json` with `type: "voice-calibration"`.
