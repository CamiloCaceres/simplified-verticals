---
name: write-docs
description: "Use when you say 'draft API docs for {endpoint}' / 'human docs for our OpenAPI spec' / 'write the onboarding guide' / 'new-engineer day-1 doc' / 'write a how-to for {feature}' / 'tutorial for {integration}' — I draft the `type` you pick: `api` reads an OpenAPI spec from GitHub or GitLab (or accepts a paste) and writes Stripe-grade per-endpoint docs · `tutorial` produces a Diátaxis-aligned how-to with numbered steps and working code · `onboarding-guide` maintains a single running `onboarding-guide.md` at the agent root. Draft only — I never auto-commit or publish."
integrations:
  dev: [github, gitlab]
  search: [exa, perplexityai]
---

# Write Docs

One skill for three doc types. The `type` parameter picks the
shape; grounding against the engineering context and "drafts only,
never publish" are shared.

## Parameter: `type`

- `api` — per-endpoint human API documentation from an OpenAPI /
  Swagger spec (or a pasted representative request/response). One
  doc per endpoint at `api-docs/{endpoint-slug}.md` with purpose,
  params table, request body, response body, error codes, curl
  example, SDK snippet.
- `tutorial` — Diátaxis-aligned tutorial (learning-oriented,
  concrete end-to-end flow the reader can run) with overview,
  prerequisites, numbered steps with working code blocks,
  troubleshooting, next steps. Writes to `tutorials/{slug}.md`.
- `onboarding-guide` — single running doc at the agent root
  (`onboarding-guide.md`) with First day / First week / First
  month, repo map, verified setup steps, conventions, ownership
  (if team > 1), FAQ. Read-merge-update, never wholesale-overwrite.

If the user names the type in plain English ("API docs for
{endpoint}", "how-to for {feature}", "new-engineer onboarding"),
infer it. If ambiguous, ask ONE question naming the 3 options.

## When to use

- Explicit per-type phrases above.
- Implicit: inside `coordinate-release` for user-visible features
  (queue a `tutorial`), or after `audit surface=readme` when the
  lede is solid but setup steps need their own page
  (`onboarding-guide`).

## Ledger fields I read

Reads `config/context-ledger.json` first.

- `universal.engineeringContext` — required for all types. If
  missing: "want me to draft your engineering context first? (one
  skill, ~5m) I ground docs against it." Stop until written.
- `universal.product` — all types use it for voice + audience
  framing.
- `domains.docs.docsHome`, `domains.docs.audience` — ask ONE
  question if missing (best-modality: "connect your docs tool via
  Composio > tell me where your docs live").

## Steps

1. **Read ledger + engineering context.** Gather missing required
   fields (ONE question each, best-modality first). Write
   atomically.

2. **Discover tools via Composio.** Run `composio search
   code-hosting` for `api` (to fetch OpenAPI specs) and
   `onboarding-guide` (to read README / CONTRIBUTING / Makefile /
   package.json scripts / docker-compose / .env.example / CI
   config). Run `composio search web-search` for `tutorial`
   prior-art lookups. If a required category has no connection,
   accept a paste and continue.

3. **Branch on type.**

   - `api`:
     - Fetch the spec from conventional paths (`openapi.yaml`,
       `openapi.json`, `swagger.json`) via the connected code host,
       or accept a pasted request/response.
     - For each endpoint (or the named one): extract method +
       path + summary + description + params + request schema +
       response schemas + error codes from the spec. Do not
       invent behavior the spec doesn't describe.
     - Write per-endpoint doc with sections: Purpose (one
       sentence, what it's for, not what it does) · Auth ·
       Parameters (table: name · in · type · required · notes) ·
       Request body (schema + one real example) · Response body
       (one real 200 example + one 4xx / 5xx each) · Error codes
       (table) · curl example · SDK snippet (if an SDK language
       is named in the engineering context).
     - Save to `api-docs/{endpoint-slug}.md`. Slug = METHOD-path,
       kebab-cased (e.g. `post-v1-charges`).

   - `tutorial`:
     - Ask ONE question to pin down: the feature / integration,
       the target reader (skill level + role), and what "done"
       looks like at the end (the reader should have X running).
     - Structure (Diátaxis tutorial — learning-oriented):
       Overview · Prerequisites (exact versions, connected
       services, API keys needed) · Numbered steps with working
       code blocks · Verify (a command or check that confirms the
       step worked) · Troubleshooting (2-4 common errors and
       what to do) · Next steps.
     - Every code block must run. If any step can't be verified
       from the repo / spec / engineering context, mark `TBD —
       needs verification` and name exactly what to bring.
     - Save to `tutorials/{slug}.md`.

   - `onboarding-guide`:
     - Read the existing `onboarding-guide.md` at the agent root
       if it exists — this is a read-merge-update, not a rewrite.
     - Pull repo structure via the connected code host: top-level
       layout, CONTRIBUTING, Makefile, package.json scripts,
       docker-compose, .env.example, CI config, README.
     - Sections (stable order): First day (clone, setup, first
       successful local run) · First week (repo map, conventions
       from engineering context, how PRs work here, sensitive
       areas from engineering context) · First month (owned
       systems, where on-call rotates if applicable, FAQ).
     - Verify every setup step against the actual Makefile /
       scripts — if a step can't be verified, mark it `TBD —
       verify with {command}`. Never guess a setup command.
     - Log the update in `outputs.json` with a summary of what
       changed this pass.

4. **Write atomically** to the target path (`*.tmp` → rename).

5. **Append to `outputs.json`** — read-merge-write atomically:
   `{ id (uuid v4), type, title, summary, path, status, createdAt,
   updatedAt, domain: "docs" }`. Type: `"api-doc"` / `"tutorial"` /
   `"onboarding-guide"`. Status `"draft"`.

6. **Summarize to user.** One paragraph: what shipped, what's
   marked `TBD`, and the exact next move (e.g. "connect your code
   host and I'll fill the SDK snippet"). End with: "I have not
   committed, pushed, or published anything — review and commit
   yourself."

## What I never do

- Auto-commit docs to the repo or publish to your docs site
  (Mintlify / GitBook / Docusaurus / Notion). I draft markdown at
  the agent root — you review and commit.
- Invent API behavior the spec doesn't describe. Missing field →
  `UNKNOWN` + what to bring.
- Guess setup commands. If a Makefile target or script isn't
  verifiable, mark `TBD — verify with {command}`.
- Wholesale-overwrite `onboarding-guide.md`. Always
  read-merge-update.
- Hardcode tool names — Composio discovery at runtime only.

## Outputs

- `api-docs/{endpoint-slug}.md` (for `type = api`)
- `tutorials/{slug}.md` (for `type = tutorial`)
- `onboarding-guide.md` at the agent root (for
  `type = onboarding-guide`)
- Appends an entry to `outputs.json` per run.
