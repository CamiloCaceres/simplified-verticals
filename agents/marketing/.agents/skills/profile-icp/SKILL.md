---
name: profile-icp
description: "Use when you say 'profile our ICP' / 'build a persona for {segment}' — I pull top closed-won accounts from a connected CRM (HubSpot / Attio) or infer from paste, then synthesize a persona with jobs-to-be-done, pains ranked by frequency, triggers, objection patterns, and 1–2 anchor accounts. Writes to `personas/{slug}.md` — ad copy and landing-page headlines pull from here."
integrations: [hubspot, salesforce, attio]
---

# Profile ICP

Source template: Gumloop "Market Segmentation: Buyer Persona Pain
Point Report". Adapted for the solo founder running everything alone.

## When to use

- "profile our ICP" / "build a persona for {segment}" / "help me
  nail the buyer persona for {role}".
- "we're going upmarket, redo the persona" / "the SMB persona
  changed, update it".
- Called implicitly when another skill (e.g. `plan-launch`,
  `define-positioning`) needs more persona depth than
  `config/icp.json` provides.

## Steps

1. **Read positioning doc** (own file, since this is HoM):
   `context/marketing-context.md`. If missing, run
   `define-positioning` first — persona work is wasted without a
   positioning anchor.

2. **Read config.** `config/icp.json`, `config/company.json`. If ICP
   config is thin and the user hasn't named the segment, ask ONE
   targeted question: "Which segment are we profiling — your core
   ICP or a new one?" (Best modality: paste a line, or point me at
   a connected CRM via Composio so I can infer from top accounts.)

3. **Gather evidence.** In priority order:
   - Existing `call-insights/` under this agent root — verbatim
     customer language is gold.
   - Connected CRM via `composio search crm` — top closed-won and
     lost accounts matching the segment.
   - Connected meeting-notes app via `composio search meeting-notes`.
   - Web research via `composio search web-search` or
     `composio search research` — market reports, role definitions,
     common workflows.
   - Founder-pasted notes.

4. **Draft the persona (markdown, ~400-600 words).** Structure:

   1. **Segment name + one-line summary** (e.g. "Series-B RevOps
      leads at 50-200-person B2B SaaS").
   2. **Demographics / firmographics** — industry, size, stage,
      geography, role, seniority, reports-to.
   3. **Jobs-to-be-done** — the 2-4 jobs they hire a product like
      ours for. Verbatim language where possible.
   4. **Pains** — ranked by intensity + frequency. Cite the source
      (call quote, CRM close-loss reason, research report).
   5. **Triggers** — signal patterns that make this persona a live
      buyer right now (hiring a role, switching a tool, a funding
      event, a compliance deadline).
   6. **Anchor accounts** — 3-5 real companies that fit, ideally 1-2
      already customers. Name them.
   7. **Objection patterns** — the top 3 objections this persona
      raises, with the best one-line response to each.
   8. **Buying process** — who initiates, who blocks, who signs,
      typical cycle length, typical committee size.
   9. **Where they hang out** — communities, newsletters, podcasts,
      conferences — actionable for the Social & Community agent.
   10. **Copy hooks** — 3-5 short lines that pattern-match this
       persona's language. Handed directly to the SEO & Content /
       Lifecycle / Social agents.

5. **Mark UNKNOWN, don't guess.** Every section with insufficient
   evidence gets a `UNKNOWN — {what would resolve it}` note. No
   invented demographics.

6. **Update `config/icp.json` if this persona sharpens the default
   ICP.** Atomic write. Ask the user before overwriting, unless
   they said "update the ICP".

7. **Write atomically** to `personas/{segment-slug}.md` — write
   `{path}.tmp`, then rename.

8. **Append to `outputs.json`.** Read existing array, append new
   entry, write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "persona",
     "title": "<Segment name>",
     "summary": "<2-3 sentences — who they are, top pain, top trigger>",
     "path": "personas/<slug>.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

9. **Summarize to user.** One paragraph: segment in one line, top
   pain + top trigger, biggest gap in the persona (what to research
   next), path to the artifact.

## Outputs

- `personas/{segment-slug}.md`
- Appends to `outputs.json` with `type: "persona"`.
- May update `config/icp.json` (with user approval).
