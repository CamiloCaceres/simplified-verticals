---
name: pitch-podcast
description: "Use when you say 'pitch me onto podcasts' / 'podcast outreach' / 'find shows for our ICP' — I identify target shows by audience fit (via Listen Notes or similar) and draft per-show pitches: hook based on your positioning, angle, proof, clear ask. No template spam. Writes to `podcast-pitches/{date}.md` — one per show, send from your own email."
integrations:
  podcasts: [listennotes]
---

# Pitch Podcast

## When to use

- User: "pitch me onto podcasts" / "podcast outreach" / "find shows
  for our ICP" / "draft pitches for {N} shows".
- Monthly cadence natural — can be routinized.

## Steps

1. **Read positioning doc**:
   `context/marketing-context.md`. If missing or
   empty, stop and tell the user to run `define-positioning` first.

2. **Read `config/voice.md` and `config/podcast-targets.json` (if
   exists).** If `podcast-targets.json` is missing, ask one targeted
   question:
   > "What angle do you want to pitch? E.g. 'solo-founder SaaS ops',
   > 'AI for back-office accounting', 'bootstrapped-to-profitability'.
   > And which audience — founders, operators, investors, technical
   > buyers? I'll write this to `config/podcast-targets.json`."
   Capture `{ angle, audience, excludeShows?, capturedAt }`.

3. **Discover target podcasts.** Run `composio search podcast` (or
   `composio search listen-notes`) to find the podcast-directory tool.
   Execute with the angle + audience to pull 10-20 candidates. If no
   directory tool is connected, tell the user which category to link
   and stop. Do not fabricate shows.

4. **Rank and filter.** For each candidate, judge:
   - **Audience fit.** Matches ICP from positioning doc? Named
     audience segment?
   - **Show health.** Publishes at least monthly, recent episodes in
     last 90 days.
   - **Host angle.** Does the host interview operators / founders in
     our space?
   - **Reachability.** Is there a contact surface (email, form,
     Twitter)?
   Keep top 5-8. Drop dormant / off-topic / unreachable.

5. **Draft per-show pitches.** For each kept show:
   - **Hook** (subject line + opening sentence) — reference a
     specific recent episode or angle so the host can tell we listened.
   - **Angle** — the specific episode idea we'd bring, tied to the
     positioning statement. 2-3 sentences.
   - **Proof** — 2-3 bullets: your role, a specific outcome / metric,
     a surprising take you'd share on air.
   - **Ask** — low-friction: "15 min to see if it's a fit?" / "Reply
     if the angle resonates and I'll send a one-pager."
   - Voice: match `config/voice.md`; err toward warm and specific.

6. **Write** all pitches into one file at
   `podcast-pitches/{YYYY-MM-DD}.md` atomically. Per-show sections.
   File structure:
   ```markdown
   # Podcast Pitch Batch — {YYYY-MM-DD}

   **Angle:** {from config}
   **Audience:** {from config}
   **Shows targeted:** {count}

   ---

   ## 1. {Show name} — host: {host}
   - Audience: {description}
   - Why this show: {one line}
   - Recent episode referenced: {title + URL}
   - Contact: {email / form URL / handle}

   **Subject:** {subject line}

   {full pitch email body}

   ---

   ## 2. {Show name} ...
   ```

7. **Append to `outputs.json`** — new entry, `type: "podcast-pitch"`,
   `path: "podcast-pitches/{YYYY-MM-DD}.md"`, `status: "draft"`.

8. **Summarize to user** — one paragraph: "{N} shows pitched: {list of
   show names}. Top match: {show} — host interviews {ICP} and ran a
   recent episode on {angle}. Review, pick which to send, then send
   from your inbox — I never send."

## Outputs

- `podcast-pitches/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `{ id, type: "podcast-pitch", title,
  summary, path, status: "draft", createdAt, updatedAt }`.
