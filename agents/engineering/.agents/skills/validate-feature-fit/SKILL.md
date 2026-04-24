---
name: validate-feature-fit
description: "Use when you say 'validate {feature} before I build it' / 'go/no-go on {feature}' — I scrape the competitor landscape via Firecrawl and web search, assess alignment to observable demand, and produce a verdict (build / defer / skip) with the evidence behind it. Writes to `feature-fit/{slug}.md` and flags assumptions I couldn't test from the desk so you know what to probe with real users."
integrations: [firecrawl, exa, perplexityai]
---

# Validate Feature Fit

Market-fit gate before a roadmap commit. The one engineering-strategy
decision skill: build / defer / skip, grounded in evidence the
founder can audit later. Source template: Gumloop "Feature Market fit
Validator", reframed so the deliverable is a short markdown verdict
the founder can hand to `plan-roadmap` next.

## When to use

- "validate {feature} before I build it" / "is {feature} a good bet"
  / "go/no-go on {feature}".
- "someone suggested {feature} — should we build it?"
- Implicitly by `triage-inbound-request` when the request looks big
  enough to warrant market testing before routing to the roadmap.

## Steps

1. **Read engineering-context.md** (own file). If missing, STOP —
   tell the user to run `define-engineering-context` first. Feature
   fit without context (who we sell to, what we stand for) produces
   generic verdicts.

2. **Gather inputs** — ask ONE tight question for any missing piece
   (best modality hint first):
   - **Feature idea** — one-line description + the user-visible
     change. (Best: paste. Or point at a PRD URL.)
   - **Target audience** — which ICP segment benefits most. (Best:
     paste one line. Default to the context doc's priorities if
     silent.)
   - **Problem statement** — the specific pain this removes. Push
     for verbatim customer language if the founder has any (sales
     call, support email, Slack DM).

3. **Discover tools at runtime.** Do NOT hardcode tool names. Run:
   - `composio search web-scrape` — for competitor pages,
     changelogs, pricing pages.
   - `composio search web-search` — for recent news, user
     complaints, adjacent launches.

   If a needed category has no connected tool, note it in the
   verdict ("no web-scrape connection — competitor evidence:
   UNKNOWN") and continue.

4. **Scrape competitor landscape.** For each competitor named in
   the context doc (or the top 3-5 the user names):
   - Is there a feature that already solves this pain? If yes,
     capture the URL + a quote of how they position it.
   - Is there a public complaint about that feature (forums,
     reviews, Twitter)? If yes, capture verbatim.
   - Any adjacent product shipping toward this problem (e.g. a new
     API, a beta)?

5. **Assess demand signal.** Look for:
   - Direct user requests (in `call-insights/` if it exists across
     agents — skip if not connected; do not invent).
   - Competitor movement (frequency + recency of related ships).
   - Public complaints about the status quo (real quotes with URLs).

6. **Render verdict.** One of:
   - **GO (build)** — strong evidence, differentiated angle, fits
     the roadmap.
   - **DEFER** — real signal but timing wrong (missing prerequisite,
     wait for market clarity).
   - **SKIP** — thin signal, crowded market, or off-positioning.

   The verdict must name the 2-3 load-bearing pieces of evidence.
   No hand-waving. If evidence is thin, the honest verdict is
   `DEFER — insufficient evidence; probe with {specific user
   action}`.

7. **Structure the output (markdown, ~400-700 words),
   `feature-fit/{slug}.md`:**

   1. **Feature + audience + problem** — three lines, tight.
   2. **Verdict** — GO / DEFER / SKIP + one-sentence rationale.
   3. **Evidence** — bulleted with sources (URL + timestamp).
      Competitor moves, complaints, adjacent launches.
   4. **Assumptions not testable from the desk** — what you'd want
      to verify with real users before committing. Be specific:
      "run a 5-user interview asking X".
   5. **Fit to current positioning** — does this advance one of
      the top 3 priorities in the context doc? Cite the priority.
   6. **Recommended next step** — if GO, hand to `plan-roadmap`.
      If DEFER, name the trigger to revisit. If SKIP, name what
      to tell the requester.

8. **Never invent evidence.** Every claim ties to a URL with a
   fetch timestamp or is explicitly marked `UNKNOWN`. A verdict
   built on fake quotes is worse than "I don't have the evidence to
   call this — here's how to get it."

9. **Write atomically** to `feature-fit/{slug}.md` — `{path}.tmp`
   then rename. `{slug}` is kebab-case of the feature name.

10. **Append to `outputs.json`.** Read-merge-write atomically:

    ```json
    {
      "id": "<uuid v4>",
      "type": "feature-fit",
      "title": "Feature fit — <feature>",
      "summary": "<2-3 sentences — verdict + top evidence + next step>",
      "path": "feature-fit/<slug>.md",
      "status": "draft",
      "createdAt": "<ISO-8601>",
      "updatedAt": "<ISO-8601>"
    }
    ```

11. **Summarize to user.** One paragraph: verdict + the 2-3
    load-bearing pieces of evidence + the exact next move + path
    to the artifact.

## Outputs

- `feature-fit/{slug}.md`
- Appends to `outputs.json` with `type: "feature-fit"`.
