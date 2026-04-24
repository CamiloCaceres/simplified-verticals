---
name: digest-linkedin-activity
description: "Use when you say 'LinkedIn digest' / 'how did my posts do' / 'weekly LinkedIn roundup' — I pull stats on your own posts (reach, engagement, new followers) plus notable posts in your network worth commenting on. A 5-minute read. Writes to `linkedin-digests/{date}.md` for Monday morning."
integrations: [linkedin]
---

# Digest LinkedIn Activity

## When to use

- User: "LinkedIn digest" / "how did my posts do this week" / "weekly
  LinkedIn roundup" / "what did my network post".
- Weekly — natural Friday / Sunday-evening routine.

## Steps

1. **Read positioning doc**:
   `context/marketing-context.md`. If missing or
   empty, stop and tell the user to run `define-positioning` first.

2. **Read `config/platforms.json`, `config/topics.json`.** Confirm
   LinkedIn is in `active` and `connectedViaComposio`. If LinkedIn is
   not connected, tell the user to link it via the Integrations tab
   and stop — this skill needs the API.

3. **Pull own-post stats.** Run `composio search linkedin` to discover
   the post-stats / list-own-posts tool. Execute to pull the user's
   posts from the last 7 days with:
   - impressions / reach
   - reactions / comments / shares / reposts
   - new followers gained that day if available
   If any metric is missing, mark it TBD and note the likely cause
   (e.g. "LinkedIn API doesn't expose per-post new-follower delta").

4. **Pull network posts.** Use the same LinkedIn category to discover
   a feed-read tool. Pull the last 7 days of posts from the user's
   connections, filter for high-engagement (top decile by reactions)
   OR topical relevance to `config/topics.json`. Keep top 5-10.

5. **Compute the roundup.** Produce:
   - **Your week at a glance** — post count, total impressions, total
     engagement, follower delta, best-performing post, worst-performing.
   - **Patterns** — one-line read on what worked (hook length, topic,
     time-of-day if surfaceable). Cite specific posts.
   - **Network highlights** — 5-10 posts from connections worth a
     reaction or a reply. For each, one-line relevance + suggested
     action (reply / react / ignore).

6. **Write** to `linkedin-digests/{YYYY-MM-DD}.md` atomically. File
   structure:
   ```markdown
   # LinkedIn Digest — week ending {YYYY-MM-DD}

   ## Your week
   - Posts: {N}
   - Impressions: {total} ({delta vs prior week})
   - Engagement: {reactions} reactions · {comments} comments · {shares} shares
   - New followers: {count or TBD}
   - Best post: [{title or hook}]({url}) — {metric}
   - Worst post: [{title or hook}]({url}) — {metric}

   ## What worked
   - {one-line pattern, cited}
   - {one-line pattern, cited}

   ## Network highlights
   1. **{Author}** — {one-line post summary} ({URL})
      Suggested action: {reply / react / ignore} · {why}
   2. ...

   ---

   ## Notes
   - Data freshness: pulled {ISO timestamp}
   - Any TBDs: {list}
   ```

7. **Append to `outputs.json`** — new entry, `type:
   "linkedin-digest"`, `path:
   "linkedin-digests/{YYYY-MM-DD}.md"`, `status: "draft"`.

8. **Summarize to user** — one paragraph: "Week ending {date}: {N}
   posts, {impressions} impressions, best was {title} ({metric}).
   {count} network highlights flagged. Full digest at {path}."

## Outputs

- `linkedin-digests/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `{ id, type: "linkedin-digest",
  title, summary, path, status: "draft", createdAt, updatedAt }`.
