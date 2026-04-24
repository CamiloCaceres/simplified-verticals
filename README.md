# Simplified Verticals

A Houston workspace of **single-agent, opinionated verticals**. Each
agent is a focused hire for one coherent job — narrow scope, fast
onboarding, ready to produce markdown artifacts the same day you
install.

This is the counterpart to the multi-agent founder workspaces
(`founder-sales-workspace/`, `founder-marketing-workspace/`). Those
give you a whole team with a shared source-of-truth doc. **This one
gives you one excellent specialist at a time** — same output quality,
none of the team coordination.

Use this workspace when:

- You want to try one vertical without committing to a full team.
- You already have your own people / tools and just need a specific
  capability.
- You're evaluating Houston and want the shortest path to a useful
  artifact.

---

## The agents

| Agent | Hired to… | Good first prompt |
|-------|-----------|-------------------|
| **SEO & Content** | Run the inbound content engine — audits, keyword clusters, blog drafts, case studies, content repurposing, backlinks, AI-search (GEO) visibility | "Run an SEO audit of my site" |

More agents will be added here as they reach the simplified-standalone
bar — each must work end-to-end without depending on a sibling.

---

## Install

**Via Houston:**

1. Open Houston.
2. Go to **Settings → Add workspace from GitHub**.
3. Paste this repository's URL.
4. Houston installs all agents in this workspace at once.

On first open of any agent, the **Activity** tab shows an **"Onboard
me"** card in the **Needs you** column — click it, send any message,
answer 3 quick questions (~90s). The agent is ready.

---

## Conventions

Every agent in this workspace:

- **Is standalone.** No cross-agent paths in default skills. Install
  it alone and it works.
- **Is chat-first.** The Overview tab is a menu of first-action tiles
  that open a chat; all real work starts with a conversation.
- **Writes markdown outputs.** Everything the agent produces is a
  markdown file you can open, edit, version, paste into your tools.
- **Uses Composio as the only external transport.** Connected
  accounts are discovered at runtime via `composio search <category>`
  — no hardcoded tool names. If a connection is missing, the agent
  tells you which category to link and stops.
- **Never publishes without approval.** Drafts only. You ship.

---

## Structure

```
simplified-verticals/
├── workspace.json          # bundle manifest (this workspace + its agents)
├── README.md               # this file
├── .gitignore
└── agents/
    └── seo-content/        # (and more as they land)
```

Each agent folder contains `houston.json`, `CLAUDE.md`, `bundle.js`,
`icon.png`, `data-schema.md`, and `.agents/skills/*/SKILL.md`.
