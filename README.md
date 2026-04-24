# Simplified Verticals

A Houston workspace of **full-stack single-agent verticals**. One
agent per vertical, covering the surface area of a whole team —
without the cross-agent handoffs.

This is the counterpart to the multi-agent founder workspaces
(`founder-sales-workspace/`, `founder-marketing-workspace/`). Those
give you a team with a shared source-of-truth doc and routing rules.
**This workspace gives you one agent per vertical with all the
skills collapsed behind one conversation.**

Use this workspace when:

- You want one agent to talk to, not six.
- You don't want to juggle which agent does what.
- You prefer an agent that asks for what it needs just-in-time rather
  than an 18-question upfront onboarding across a team.

---

## The agents

| Agent | Hired to… | Domains covered | Good first prompt |
|-------|-----------|-----------------|-------------------|
| **Marketing** | Full-stack marketing operator | Positioning · SEO & content · email & lifecycle · social · paid & growth · conversion copy | "Help me write my positioning statement" |

More verticals will be added here as single-agent versions.

---

## Install

**Via Houston:**

1. Open Houston.
2. **Settings → Add workspace from GitHub**.
3. Paste this repository's URL.
4. Houston installs every agent in this workspace at once.

**On first open of any agent:** no upfront onboarding. Click any
tile on the Overview tab — the agent gets to work and asks for what
it needs inline (best modality first: Composio connection from the
Integrations tab > file drop > URL > paste).

---

## What makes these "simplified"

Compared to the multi-agent founder workspaces:

| Dimension | Multi-agent (`founder-marketing-workspace`) | Simplified (this workspace) |
|---|---|---|
| Agents per vertical | 6 | 1 |
| Upfront onboarding | 3 questions per agent | None — asks just-in-time |
| Positioning / voice | Shared file read across agents | Local to the single agent |
| Routing | Each agent's skill list + "which agent?" | One CLAUDE.md grouped by domain |
| Skills | ~50 narrow skills | ~25 consolidated (5 use a parameter) |
| Overview | Per-agent tile grid | One tile grid with domain filter chips |

**Output quality is the same.** The consolidation is behind the
user — each skill still produces the same markdown artifacts to the
same folder patterns, just now everything lives under one agent root.

---

## Conventions

Every agent in this workspace:

- **Is a full-stack operator for its vertical.** No cross-agent reads;
  no "talk to the positioning agent first."
- **Is chat-first.** Overview tab is a tile grid that fires chat
  messages. All real work starts with a conversation.
- **Writes markdown outputs.** Everything the agent produces is a
  markdown file in a flat folder at the agent root.
- **Uses Composio as the only external transport.** Connected
  accounts are discovered at runtime via `composio search <category>`
  — no hardcoded tool names. If a connection is missing, the agent
  tells you which category to link and stops.
- **Never publishes without approval.** Drafts only. You ship.

---

## Structure

```
simplified-verticals/
├── workspace.json          # bundle manifest
├── README.md               # this file
├── .gitignore
└── agents/
    └── marketing/          # (and more verticals as they land)
        ├── houston.json        # includes useCases for the tile grid
        ├── CLAUDE.md           # identity + domain-grouped skill index
        ├── data-schema.md      # context ledger + artifact folders
        ├── bundle.js           # Overview tiles with filter chips
        ├── icon.png
        └── .agents/skills/     # 23 skills (17 ports + 6 consolidated)
```
