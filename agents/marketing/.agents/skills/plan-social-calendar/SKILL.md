---
name: plan-social-calendar
description: "Use when you say 'plan this week's social' / 'social calendar' / 'content for next week' — I build a Mon–Fri plan per platform (LinkedIn / X / Reddit), keyed to your topics, mixing original posts with repurposed content from the SEO agent's outputs (zero duplicate angles). Writes to `social-calendars/{YYYY-WNN}.md` + appends to a living `social-calendar.md`."
---

# Plan Social Calendar

## When to use

- User: "plan this week's social" / "social calendar" / "what should I
  post next week" / "content for {platform} this week".
- Weekly — can be put on a routine (Monday 9am).

## Steps

1. **Read positioning doc**:
   `context/marketing-context.md`. If missing or
   empty, stop and tell the user to run `define-positioning` first.

2. **Read `config/platforms.json`, `config/voice.md`,
   `config/topics.json`, `config/calendar-cadence.json` (if exists).**
   If `calendar-cadence.json` is missing, ask one targeted question:
   > "How many posts per week per platform do you want to aim for?
   > Default: LinkedIn 3, X 5, Reddit 2. I'll write this to
   > `config/calendar-cadence.json`."
   Capture and continue.

3. **Cross-agent read — repurpose candidates.** Read
   `outputs.json` (if it exists). Filter for `type` in
   `blog-post`, `case-study`, `repurposed` created in the last 14
   days. These become candidate slots (e.g. blog post → LinkedIn
   highlight, YouTube → X thread). If the file is missing, skip this
   step — no error.

4. **Determine the week range.** Default: the upcoming Mon-Fri (use
   ISO week; today's week if before Wed, next week if Wed+). Honor an
   explicit range from the user.

5. **Build the plan.** For each day × platform slot:
   - Pick a topic from `config/topics.json` (rotate across themes).
   - Pick a format: original post / thread / repurpose / reply /
     engagement block (15 min skim + comment on 5 posts).
   - Respect cadence from `config/calendar-cadence.json`.
   - Aim for mix: roughly 60% original, 20% repurposed, 20%
     engagement / replies.
   - Time-of-day hint (LinkedIn 8-10am local, X 11am / 4pm, Reddit
     evening). Note it; don't schedule.

6. **Write per-week detail** to `social-calendars/{YYYY-WNN}.md`
   atomically. File structure:
   ```markdown
   # Social Calendar — {YYYY}-W{NN}

   **Range:** {Mon date} → {Fri date}
   **Cadence:** {from config}
   **Topics in rotation:** {list}

   ---

   ## Monday

   - **LinkedIn — original** · topic: {slug} · angle: {one-line} ·
     suggested skill: `draft-linkedin-post`
   - **X — engagement block (15 min)** · comment on 5 posts from
     {handles / hashtags}
   ...

   ## Tuesday
   ...

   (Fri)

   ---

   ## Repurpose candidates pulled from SEO
   - {title} ({type}, created {date}) → {target platform + format}
   ```

7. **Append a short summary section** (newest-on-top) to the living
   `social-calendar.md` at the agent root. Structure:
   ```markdown
   ## Week {YYYY}-W{NN} — {Mon date} to {Fri date}
   - LinkedIn: {N} originals + {M} engagement blocks
   - X: {N} threads + {M} replies
   - Reddit: {N} replies
   - Repurpose: {N} candidates pulled
   - Full detail: [social-calendars/{YYYY-WNN}.md](social-calendars/{YYYY-WNN}.md)
   ```
   Read existing file, prepend (do not overwrite), atomic write.

8. **Append to `outputs.json`** — new entry, `type:
   "social-calendar"`, `title: "Social calendar — {YYYY-WNN}"`,
   `path: "social-calendars/{YYYY-WNN}.md"`, `status: "draft"`.

9. **Summarize to user** — one paragraph with the week range, total
   slots per platform, and a nudge: "Want me to draft any of these
   now? Say `draft the Monday LinkedIn from the calendar`."

## Outputs

- `social-calendars/{YYYY-WNN}.md`
- Appends a week section to `social-calendar.md` (living doc).
- Appends to `outputs.json` with `{ id, type: "social-calendar",
  title, summary, path, status: "draft", createdAt, updatedAt }`.
