---
name: source-candidates
description: "Use when you say 'find candidates for {role}' / 'source engineers from GitHub' / 'build a sourcing list for {role}' — given a role and signal source (GitHub, LinkedIn, community posts, conference lists, OSS repos), pulls candidates matching the role's rubric via Firecrawl or a connected scrape tool, scores each against the must-haves, and writes a ranked sourcing list to `sourcing-lists/{role-slug}-{YYYY-MM-DD}.md`."
integrations: [firecrawl, github, linkedin]
---

# Source Candidates

## When to use

- Explicit: "find candidates for {role}", "source engineers from
  GitHub", "build a sourcing list for {role}", "source 20 candidates
  for {role} from {signal}".
- Implicit: kicked off by the founder at the start of a hiring push,
  or during a req-planning session.
- Safe to run per-role per-signal; keep lists short (≤ 30 per pass)
  so rankings are meaningful.

## Steps

1. **Read people-context doc** at
   `context/people-context.md`. If missing or empty, tell
   the user: "I need your people context first — run the define-people-context skill." Stop.
   Extract the leveling framework and any existing team-shape notes
   for the target role.
2. **Read the req.** Look for `reqs/{role-slug}.md`. If missing, ask
   ONE targeted question ("What's the level target and the top 3
   must-haves for {role}? I'll save a short rubric to
   `reqs/{role-slug}.md` and continue."). Write it and continue.
3. **Read the ledger.** `config/context-ledger.json` — the connected
   ATS (for duplicate checks later) and the list of open reqs
   (`domains.people.reqs`).
4. **Confirm the signal source** you named (GitHub repo / org,
   LinkedIn search URL, community post / forum, conference attendee
   list, OSS contributor graph). If none named, ask one targeted
   question.
5. **Discover tools via Composio.** Run `composio search web-scrape`
   for LinkedIn / public-profile scraping and `composio search ats`
   if the ATS will be consulted for dedup. If the required category
   is unconnected, tell you which to link from Integrations and
   stop.
6. **Pull candidates.** Execute the discovered tool slugs against the
   signal source. Cap at ~30 results. For each candidate, capture:
   name, profile / signal URL, current role + company, tenure, key
   skills observable in the signal, one-line "why this signal is
   relevant" note.
7. **Score against the rubric.** For each candidate, mark
   must-haves hit / missing vs the rubric from step 2. Produce a
   0-3 fit band: **strong / maybe / weak**. Surface up to 3 red
   flags per candidate (tenure pattern, geo / authorization if
   stated, overlap with excluded companies per founder instruction).
   Never infer protected-class attributes.
8. **Write** the sourcing list to
   `sourcing-lists/{role-slug}-{YYYY-MM-DD}.md` atomically
   (`*.tmp` → rename). Structure: Role summary (level + must-haves
   pulled from rubric) → Top 5 highest-conviction reach-outs →
   Ranked table of all candidates (name, link, fit band, 1-line
   reason, red flags).
9. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "sourcing", title, summary, path, status: "draft",
   createdAt, updatedAt }`, write atomically.
10. **Summarize to user** — one paragraph naming the top 5
    reach-outs, the path to the full list, and the category / tool
    I used.

## Never invent

Every candidate must trace to a real, verifiable signal URL. If a
profile is private / 404 / ambiguous, mark the candidate UNKNOWN on
that field — don't guess tenure, title, or skills.

## Outputs

- `sourcing-lists/{role-slug}-{YYYY-MM-DD}.md`
- Appends to `outputs.json` with type `sourcing`.
