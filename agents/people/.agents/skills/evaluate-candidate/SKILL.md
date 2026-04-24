---
name: evaluate-candidate
description: "Use when you say 'screen this resume' / 'screen the stack for {role}' / 'score {LinkedIn URL}' / 'is this candidate a fit' — I evaluate against the role rubric based on the `source` you pick: `resume` parses PDF(s) via Google Drive or Dropbox and produces pass / borderline / fail bands plus a ranked stack · `linkedin` scrapes a public profile via Firecrawl and scores 0-100 across 4-6 sub-criteria. Writes per-candidate records to `candidates/{candidate-slug}.md`."
integrations:
  scrape: [firecrawl]
  files: [googledrive, googlesheets]
---

# Evaluate Candidate

Two paths to the same output: one candidate file per applicant,
scored against the role's rubric. Pick the `source` based on what
you have in front of you.

## When to use

- `source=resume` — "screen this resume", "screen the resume stack
  for {role}", "rank these resumes", "who's the strongest on this
  pile". Single-resume and batch modes both supported.
- `source=linkedin` — "score {LinkedIn URL}", "is this candidate a
  fit for {role}", "rate this profile", "0-100 on this LinkedIn".
  One candidate per invocation. Batch = run multiple times.

Both chain into `prep-interviewer` and `debrief-loop`, which expect
`candidates/{slug}.md` to exist.

## Ledger fields I read

- `universal.company` — stage shapes how hard to pattern-match on
  scope vs raw credentials.
- `domains.people.ats` — optional connected ATS (Ashby / Greenhouse /
  Lever / Workable), used to write back candidate state if you ask.
- `domains.people.reqs` — active open reqs and where rubrics live.

If any required field is missing, I ask ONE targeted question with a
modality hint (Composio connection > file drop > URL > paste), write
it, continue.

## Parameter: `source`

- `resume` — parses resume PDF(s) from connected Google Drive /
  Dropbox (or pasted files) via a Composio docs tool. Batch-capable:
  if N resumes, each gets its own record AND I build a ranked
  summary. Output band: **pass / borderline / fail**.
- `linkedin` — scrapes a LinkedIn or public-profile URL via a
  Composio web-scrape tool (Firecrawl). Output: 0-100 total + 4-6
  sub-scores (level-fit, domain-fit, scope, tenure, culture-signal)
  with profile evidence cited per sub-score.

## Steps

1. **Read the ledger** and fill gaps with ONE targeted question.
2. **Read `context/people-context.md`.** If missing or empty, tell
   you: "I need the people context first — run the
   define-people-context skill." Stop. Pull the leveling framework
   for the target level.
3. **Read the req.** Open `reqs/{role-slug}.md` for the criteria
   rubric. If missing, ask ONE targeted question ("What role? Top 3
   must-haves?") and write `reqs/{role-slug}.md`.
4. **Branch on `source`:**

   - **If `source = resume`:**
     1. Locate the resumes. If attached or a folder is connected, run
        `composio search docs` to discover the docs tool slug (Google
        Drive / Dropbox) and list the PDFs. If paths were pasted, use
        those. If neither, ask ONE question naming the best modality
        ("Connect Google Drive / Dropbox from Integrations, or paste
        the resume files.") and stop.
     2. Parse each resume. Execute the docs slug to extract text.
        Pull structured fields per candidate: name, contact;
        education (school, degree, dates); roles (company, title,
        dates, tenure); skills (stated + inferred from role
        descriptions); notable projects / publications. Mark
        ambiguous fields UNKNOWN — never infer.
     3. Evaluate against the rubric. Per candidate, score each
        criterion pass / borderline / fail with a one-line reason
        citing resume evidence (or "not stated in resume" → UNKNOWN).
        Overall band. 3-5 red flags (tenure pattern, skill-gap vs
        must-haves, unexplained gaps). Never flag protected-class
        attributes.
     4. Write one record per applicant to
        `candidates/{candidate-slug}.md` (slug = kebab-case
        `{first-last}`). If the file exists, append a new dated
        `## Screen {YYYY-MM-DD}` section — never overwrite. Per
        section: Structured fields → Rubric scoring → Overall band →
        Red flags → Suggested next step (interview / reject with
        rationale). Atomic write.
     5. If more than one resume, build a ranked summary table (name →
        band → one-line reason → candidate path) and include it in
        the `outputs.json` summary text.

   - **If `source = linkedin`:**
     1. Parse the URL. Accept LinkedIn or any public-profile URL.
        Derive `{candidate-slug}` from the URL or stated name
        (kebab-case `first-last`).
     2. Discover the scrape tool: `composio search web-scrape`. If
        nothing is connected, tell you which category to link and
        stop.
     3. Scrape. Execute the slug. Extract: current title + company +
        tenure; prior roles (company, title, dates, tenure);
        education; skills (stated + inferred from role / headline);
        recent activity (posts, publications, speaking); geo if
        stated. Mark ambiguous fields UNKNOWN. If the scrape returns
        empty or gated, say so and ask for a paste of the profile
        summary.
     4. Score 0-100 against the rubric. Break into 4-6 sub-scores
        (e.g. level-fit, domain-fit, scope-signal, tenure-signal,
        culture-signal). Each sub-score is 0-25 with a one-line
        reason citing profile evidence. Total ≤ 100.
     5. Produce: background summary (3-5 sentences), total + sub-
        scores with reasoning, 3-5 red flags to probe in interviews.
        Never infer protected-class attributes.
     6. Write to `candidates/{candidate-slug}.md`. If the file
        exists, append `## LinkedIn Score {YYYY-MM-DD}` — never
        overwrite. If it doesn't exist, create it with a header stub
        then the score section. Atomic write.

5. **Append to `outputs.json`** with:
   ```json
   {
     "id": "<uuid v4>",
     "type": "candidate-evaluation",
     "title": "<source> — <candidate name or stack count>",
     "summary": "<2-3 sentences; for batch: counts by band + top 3>",
     "path": "candidates/<candidate-slug>.md",
     "status": "draft",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>",
     "domain": "hiring"
   }
   ```
   For batch resume runs, one entry per batch with
   `path: "candidates/"`.
6. **Summarize.** One paragraph.
   - `resume`: count screened, bands breakdown, top 3 named with
     file paths.
   - `linkedin`: total score, top 2 reasons high/low, top 2 red
     flags, candidate file path.

## Outputs

- `candidates/{candidate-slug}.md` per applicant (appended; created
  if missing).
- Appends to `outputs.json` with `type: "candidate-evaluation"`,
  `domain: "hiring"`.

## What I never do

- Infer or score protected-class attributes (race, gender, age 40+,
  pregnancy, disability, religion, national origin, sexual
  orientation, veteran status). Only the objective criteria rubric.
- Invent credentials, references, or claims. If a resume / LinkedIn
  is thin or gated, mark UNKNOWN and ask for a paste.
- Overwrite prior candidate sections — always append dated sections.
- Commit to a hire / no-hire. That call is yours; I band and flag.
