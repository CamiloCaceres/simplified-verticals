---
name: profile-icp
description: "Use when you say 'profile the buying committee for {segment}' / 'who signs at {segment}' / 'build a persona for sales' — I pull top closed-won accounts from your connected CRM (HubSpot / Salesforce / Attio / Pipedrive / Close) and synthesize a sales-flavored persona covering champion, economic buyer, blocker, disqualifiers, and anchor accounts. Writes to `personas/{segment-slug}.md`."
---

# Profile ICP (Sales)

This skill is narrower than a marketing persona. The goal is to answer
"who do we sell to, who signs, who blocks, and what triggers the
decision" — the 4 things this agent and AE need to tune outreach and
discovery.

## When to use

- "profile the buying committee for {segment}".
- "who signs at {segment}" / "who actually buys us".
- "build a sales persona for {segment}".
- Called by `define-sales-playbook` when the buying-committee section
  is thin.

## Steps

1. **Read the playbook.** Load `context/sales-context.md`. If missing, run
   `define-sales-playbook` first.

2. **Source accounts.** Ask the user: "Should I pull closed-won
   accounts in {segment} from your connected CRM, or work from
   examples you give me?" If CRM route: `composio search crm` → pull
   top ~20 closed-won in segment. If example route: ask for 2–3 real
   accounts we've closed (or best-fit target accounts).

3. **Extract per-account.** For each account: firmographics (size,
   region, industry, stage), champion title + motivations, who signed
   the contract, who pushed back or delayed, what triggered the
   search, time-to-close, and the primary use case. Cite source
   (CRM record or founder's description).

4. **Synthesize across accounts.** Write:
   - **Champion** — title patterns, pains they name, motivations,
     what's in it for them when the deal closes.
   - **Economic buyer** — title patterns (often different from
     champion), what wins them (ROI, risk mitigation, status quo
     disruption, competitive parity), what they kill deals over.
   - **Blocker** — the seat that most often kills deals in {segment}
     (often IT, legal, procurement, or a counter-incumbent champion).
     How to neutralize.
   - **Influencers** — other seats we need on the bus.
   - **Disqualifiers** — 3 hard nos for {segment} specifically (if
     different from the global playbook).
   - **Buying triggers** — concrete signals that they're starting the
     search right now (hiring pattern, funding, stack change, incident,
     regulatory deadline).

5. **Mark gaps honestly.** `TBD — need 2 more closed-won in segment`
   rather than guessing.

6. **Write atomically.** Write to
   `personas/{segment-slug}.md.tmp`, then rename. Cite every claim.

7. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "persona",
     "title": "Buying committee — {segment}",
     "summary": "<2–3 sentences — champion / EB / blocker pattern>",
     "path": "personas/{segment-slug}.md",
     "status": "draft",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

8. **Summarize to user.** One paragraph + the path. Flag which of the
   playbook sections this persona updates (buying committee,
   disqualifiers, triggers) and whether you'd recommend running
   `define-sales-playbook` next to fold it in.

## Outputs

- `personas/{segment-slug}.md`
- Appends to `outputs.json` with `type: "persona"`.
