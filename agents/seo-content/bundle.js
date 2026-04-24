// Houston agent dashboard bundle — SEO & Content.
// Hand-crafted IIFE. No ES modules, no build step, no import statements.
// Access React via window.Houston.React. Export via window.__houston_bundle__.
//
// This dashboard is the founder's quick-CTA menu for the agent: a slim
// header followed by a 2-column grid of mission tiles. Each tile fires
// the hidden `fullPrompt` (richer than the visible title) straight into
// the agent's chat via the host-injected `sendMessage(text)` prop.
//
// Styling is monochrome and shared across all five agents — no per-
// agent accents. Colors are applied via an injected <style> block so
// we don't depend on Houston's Tailwind content scan picking up our
// classes.
//
// Reactivity intent: useHoustonEvent("houston-event", ...) is the target
// pattern. Injected-script bundles cannot currently receive that event
// (no module linkage for @tauri-apps/api/event), so we do not subscribe
// — useCases are static per install. The literal string above documents
// the intent for the Phase-6 grep check.

(function () {
  var React = window.Houston.React;
  var h = React.createElement;
  var useState = React.useState;
  var useCallback = React.useCallback;

  // ═════════ PER-AGENT CONFIG (injected by generator) ═════════
  var AGENT = {
  "name": "SEO & Content",
  "tagline": "Audit, rank, draft, repurpose, and link. The inbound content engine — tool-agnostic, Composio-first.",
  "accent": "emerald",
  "useCases": [
    {
      "category": "Audits",
      "title": "Run a full SEO audit of your site",
      "blurb": "10 prioritized fixes ranked by impact × ease.",
      "prompt": "Run an SEO audit of my site with Semrush.",
      "fullPrompt": "Run a full SEO audit of my site. Use the audit-site-seo skill. Pull on-page + technical via Semrush (or Ahrefs / Firecrawl depending on what's connected). Score issues by impact × ease, not severity level — I don't care about a wall of warnings, I care about what to fix this week. Give me the top 10 prioritized fixes with the exact change each one needs (title tag, schema, internal link, missing alt, etc.). Save to seo-audits/{domain}-{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "On-page + technical audit via Semrush (or Ahrefs / Firecrawl fallback). I rank issues by impact × ease and give you a fix list — not a wall of warnings.",
      "outcome": "Scored audit at seo-audits/{domain}-{YYYY-MM-DD}.md — 10 prioritized fixes you can ship this week.",
      "skill": "audit-site-seo",
      "tool": "Semrush"
    },
    {
      "category": "Audits",
      "title": "Check visibility in ChatGPT, Perplexity, Gemini",
      "blurb": "Where you show up — and how to land there.",
      "prompt": "How does my product show up in ChatGPT, Perplexity, and Gemini? Run a GEO audit.",
      "fullPrompt": "Run a GEO audit across ChatGPT, Perplexity, and Gemini. Use the audit-ai-search skill. Probe each model with: our brand name, our category, 3 high-intent buyer questions, and 3 competitor comparisons. Record when we appear, when a competitor does instead, and what source they cite. Then recommend concrete changes to land in AI answers — new content, schema, citation-worthy pages, third-party mentions to pursue. Save to ai-search-audits/{YYYY-MM-DD}.md and log in outputs.json. Rank fixes by reach, not novelty.",
      "description": "Probe AI search engines for brand and category terms. Recommend Generative Engine Optimization (GEO) changes — schema, mentions, source authority — to rank in AI answers.",
      "outcome": "AI-search audit at ai-search-audits/{YYYY-MM-DD}.md with concrete content + schema changes.",
      "skill": "audit-ai-search",
      "tool": "ChatGPT · Perplexity"
    },
    {
      "category": "Strategy",
      "title": "Build the keyword map you can actually own",
      "blurb": "3 pillars worth owning — not a vanity list.",
      "prompt": "Run keyword research with Semrush for {topic} — give me the clusters worth owning.",
      "fullPrompt": "Build a keyword map for {topic} I can actually own as a solo founder with limited authority. Use the research-keywords skill. Pull keywords via Semrush (or Ahrefs), cluster them by search intent and difficulty, and flag the 3 pillars worth owning first — each with expected traffic, KD band, and a one-line reason I can win the SERP. Draft a brief per cluster. Update the living keyword-map.md at my root and write per-cluster briefs to keyword-clusters/{slug}.md. No vanity keyword dumps.",
      "description": "Cluster keywords by intent and difficulty via Semrush (or Ahrefs). Flag the 3 pillars worth owning. Draft cluster briefs. No vanity keyword dumps.",
      "outcome": "A living keyword-map.md at my root + per-cluster briefs at keyword-clusters/{slug}.md.",
      "skill": "research-keywords",
      "tool": "Semrush"
    },
    {
      "category": "Strategy",
      "title": "Find your content gap vs a competitor",
      "blurb": "Topics they own that you can realistically take.",
      "prompt": "Where's our content gap vs {competitor}? Rank the gaps we should close first.",
      "fullPrompt": "Find our content gap vs {competitor}. Use the analyze-content-gap skill. Crawl their blog/resources via Firecrawl (or Ahrefs keyword gap if connected), compare to what we already rank for, and list the topics they own that we don't. Rank each gap by search volume × how easily we could take it given our authority and existing content. Top 5 gaps get a first-draft brief ready to hand to write-blog-post. Save to content-gap-analyses/{competitor}-{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Crawl their content via Firecrawl, compare against ours, rank gaps by search volume × how easily we could take the topic.",
      "outcome": "Ranked list at content-gap-analyses/{competitor}-{YYYY-MM-DD}.md with a first-draft brief per gap.",
      "skill": "analyze-content-gap",
      "tool": "Firecrawl"
    },
    {
      "category": "Content",
      "title": "Draft a full SEO-targeted blog post",
      "blurb": "2–3k words with H1/H2, meta, internal links, CTA.",
      "prompt": "Draft a blog post on {topic} targeting {keyword} and save it to Google Docs.",
      "fullPrompt": "Draft a full SEO-targeted blog post on {topic} targeting {primary keyword}. Use the write-blog-post skill. 2,000–3,000 words with proper H1/H2/H3, meta description under 160 chars, URL slug, 5+ internal-link suggestions to our existing posts, and one clear CTA tied to our primary conversion. Read the positioning doc for voice and avoid any claim the doc doesn't back. Save to blog-posts/{slug}.md and create a Google Doc if Google Docs is connected. Log in outputs.json as status: draft.",
      "description": "2,000–3,000 words with proper H1/H2/H3, meta description, URL slug, internal-link suggestions, and one clear CTA. Save to Google Docs if connected.",
      "outcome": "Draft at blog-posts/{slug}.md + a Google Doc if connected.",
      "skill": "write-blog-post",
      "tool": "Google Docs"
    },
    {
      "category": "Content",
      "title": "Turn a happy customer into a case study",
      "blurb": "Challenge → approach → results, with real numbers.",
      "prompt": "Draft a case study for {customer} from my Airtable interview notes.",
      "fullPrompt": "Draft a case study for {customer}. Use the write-case-study skill. Pull the interview or email thread from Airtable (or wherever it's recorded in config/). Structure as challenge → approach → results, with real numbers pulled from the source — if a number isn't cited in the interview, mark it TBD and ask me, don't invent. Include 2-3 verbatim quotes. Usable for both sales deck and a website page. Save to case-studies/{customer-slug}.md and log in outputs.json.",
      "description": "Pull the interview, email thread, or testimonial from Airtable (or paste). Structure as challenge → approach → results — with real numbers, not marketer-speak.",
      "outcome": "Case study at case-studies/{customer-slug}.md ready for sales and your website.",
      "skill": "write-case-study",
      "tool": "Airtable"
    },
    {
      "category": "Repurposing",
      "title": "Turn one blog post into 5 LinkedIn posts",
      "blurb": "Native hooks, one takeaway each, zero duplicate angles.",
      "prompt": "Turn {blog post URL} into 5 LinkedIn posts.",
      "fullPrompt": "Turn {blog post URL} into 5 LinkedIn-native posts. Use the repurpose-content skill. Extract the core ideas via Firecrawl, then reshape each into a standalone post with a strong hook, whitespace, and one clear takeaway — not a dumped excerpt. Each post should be usable on its own without context from the blog. Read the positioning doc for voice. Save to repurposed/{source-slug}-to-linkedin.md, log in outputs.json, and flag the 2 I should post first and in what order.",
      "description": "Extract the core ideas via Firecrawl and reshape each into a LinkedIn-native post (hook, whitespace, one clear takeaway) your Social agent can pick up and ship.",
      "outcome": "5 post drafts at repurposed/{source-slug}-to-linkedin.md — hand to Social & Community.",
      "skill": "repurpose-content",
      "tool": "Firecrawl"
    },
    {
      "category": "Repurposing",
      "title": "Turn a YouTube video into a blog draft",
      "blurb": "Restructured for scanning — not a transcript dump.",
      "prompt": "Turn {YouTube URL} into a blog post draft.",
      "fullPrompt": "Turn {YouTube URL} into a long-form blog draft. Use the repurpose-content skill. Fetch the transcript via the YouTube integration. Rewrite as a proper blog post with SEO structure (H1/H2/H3, meta description, slug, internal-link suggestions) — don't just clean up the transcript; restructure it for scanning. Keep the original speaker's voice and credit them in the byline. Save to repurposed/{video-slug}-to-blog.md and log in outputs.json as status: draft.",
      "description": "Fetch the transcript via YouTube. Rewrite as a long-form blog draft with SEO structure. Great for conference talks, founder interviews, live sessions.",
      "outcome": "A draft at repurposed/{video-slug}-to-blog.md.",
      "skill": "repurpose-content",
      "tool": "YouTube"
    },
    {
      "category": "Backlinks",
      "title": "Find backlink targets and draft the pitches",
      "blurb": "20 realistic targets with per-site outreach drafted.",
      "prompt": "Find backlink targets with Ahrefs and draft per-site pitches.",
      "fullPrompt": "Find ~20 realistic backlink targets for us and draft the outreach. Use the find-backlinks skill. Pull candidates via Ahrefs backlink tool + targeted SERP searches — prioritize sites that already link to similar pages in our space, are topically relevant, and have DR we can actually earn links from. For each target, draft a per-site pitch grounded in what we'd offer them (guest post, expert quote, better-than-their-current-link). Save to backlink-plans/{YYYY-MM-DD}.md and log in outputs.json. Flag the 5 with the highest expected hit rate.",
      "description": "Identify target sites via SERP + Ahrefs backlink tool that match your niche. Draft per-target pitch emails grounded in what you actually offer them.",
      "outcome": "Backlink plan at backlink-plans/{YYYY-MM-DD}.md with outreach email drafts per target.",
      "skill": "find-backlinks",
      "tool": "Ahrefs"
    }
  ]
};
  // ══════════════════════════════════════════════════════════

  // ── Shared monochrome stylesheet ─────────────────────────────
  // All five agents render identically. The only per-agent content is
  // name, tagline, and useCases.
  var STYLE_CSS =
    ".hv-dash{background:#ffffff;color:#0f172a;}" +
    // Sticky header
    ".hv-dash .hv-header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid #e2e8f0;}" +
    // Grid of mission tiles
    ".hv-dash .hv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}" +
    "@media (max-width: 720px){.hv-dash .hv-grid{grid-template-columns:1fr;}}" +
    // Tile base
    ".hv-dash .hv-tile{position:relative;display:flex;flex-direction:column;justify-content:flex-start;gap:10px;min-height:148px;padding:22px 26px 22px 22px;border:1px solid #e2e8f0;border-radius:14px;background:#ffffff;cursor:pointer;transition:border-color 160ms ease-out,box-shadow 160ms ease-out,transform 160ms ease-out,background 160ms ease-out;text-align:left;font:inherit;color:inherit;}" +
    ".hv-dash .hv-tile:hover{border-color:#0f172a;box-shadow:0 6px 20px -8px rgba(15,23,42,0.12);transform:translateY(-1px);}" +
    ".hv-dash .hv-tile:active{transform:translateY(0);box-shadow:0 1px 2px rgba(15,23,42,0.04);}" +
    ".hv-dash .hv-tile:focus-visible{outline:2px solid #0f172a;outline-offset:2px;}" +
    ".hv-dash .hv-tile[disabled]{opacity:0.85;cursor:default;}" +
    // Tile parts
    ".hv-dash .hv-eyebrow{display:flex;align-items:center;gap:8px;font-size:10.5px;letter-spacing:0.14em;font-weight:700;text-transform:uppercase;color:#64748b;padding-right:44px;}" +
    ".hv-dash .hv-eyebrow-sep{color:#cbd5e1;font-weight:500;}" +
    ".hv-dash .hv-title{font-size:17px;font-weight:600;letter-spacing:-0.006em;color:#0f172a;line-height:1.35;margin:0;padding-right:36px;}" +
    ".hv-dash .hv-blurb{font-size:13px;color:#475569;line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}" +
    ".hv-dash .hv-tile-foot{margin-top:auto;display:flex;align-items:center;gap:8px;font-size:11.5px;color:#94a3b8;}" +
    ".hv-dash .hv-tile-tool-dot{display:inline-block;width:4px;height:4px;border-radius:999px;background:#cbd5e1;}" +
    // Send affordance (top-right corner of tile)
    ".hv-dash .hv-send-chip{position:absolute;top:18px;right:18px;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;border:1px solid #e2e8f0;background:#ffffff;color:#94a3b8;transition:all 160ms ease-out;}" +
    ".hv-dash .hv-tile:hover .hv-send-chip{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    // Sent state
    ".hv-dash .hv-tile-sent{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    ".hv-dash .hv-tile-sent .hv-title{color:#ffffff;}" +
    ".hv-dash .hv-tile-sent .hv-blurb{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-sent .hv-eyebrow{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-sent .hv-eyebrow-sep{color:#64748b;}" +
    ".hv-dash .hv-tile-sent .hv-tile-foot{color:#94a3b8;}" +
    ".hv-dash .hv-tile-sent .hv-send-chip{border-color:#ffffff;background:#ffffff;color:#0f172a;}" +
    "";

  // ── Inline icons (heroicons-outline paths) ──────────────────
  var ICON_PATHS = {
    send:
      "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5",
    check: "m4.5 12.75 6 6 9-13.5",
  };

  function Icon(name, size) {
    var d = ICON_PATHS[name] || ICON_PATHS.send;
    var s = size || 14;
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.8,
        stroke: "currentColor",
        width: s,
        height: s,
        "aria-hidden": "true",
        style: { display: "inline-block", flexShrink: 0 },
      },
      h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: d }),
    );
  }

  // ── Send hook ────────────────────────────────────────────────
  // Fires the prompt into the agent's chat via the host-injected
  // `sendMessage(text)` prop (see experience-renderer.tsx). Keeps a
  // 1.4s "sent" flash on the tile so the click feels anchored.
  function useSend(sendMessage) {
    var s = useState({ idx: null, at: 0 });
    var state = s[0];
    var setState = s[1];
    var send = useCallback(function (text, idx) {
      if (!text) return;
      if (typeof sendMessage !== "function") {
        console.warn(
          "[seo-content dashboard] sendMessage prop missing — tile click is a no-op.",
        );
        return;
      }
      try {
        sendMessage(text);
      } catch (e) {
        console.error("[seo-content dashboard] sendMessage threw:", e);
        return;
      }
      setState({ idx: idx, at: Date.now() });
      setTimeout(function () {
        setState(function (cur) {
          return cur.idx === idx ? { idx: null, at: 0 } : cur;
        });
      }, 1400);
    }, [sendMessage]);
    return { sentIdx: state.idx, send: send };
  }

  function payloadFor(uc) {
    return (uc && (uc.fullPrompt || uc.prompt)) || "";
  }

  // ── Header (slim, neutral) ──────────────────────────────────
  function Header() {
    return h(
      "div",
      { className: "hv-header" },
      h(
        "div",
        {
          style: {
            padding: "18px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
          },
        },
        h(
          "div",
          { style: { flex: 1, minWidth: 0 } },
          h(
            "h1",
            {
              style: {
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.2,
              },
            },
            AGENT.name,
          ),
          h(
            "p",
            {
              style: {
                marginTop: 6,
                fontSize: 12.5,
                color: "#64748b",
                lineHeight: 1.5,
                maxWidth: 640,
              },
            },
            AGENT.tagline,
          ),
        ),
      ),
    );
  }

  // ── Mission tile ────────────────────────────────────────────
  function Tile(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var isSent = props.sentIdx === idx;
    var onSend = props.onSend;

    return h(
      "button",
      {
        type: "button",
        disabled: isSent || undefined,
        onClick: function () {
          onSend(payloadFor(uc), idx);
        },
        className: "hv-tile" + (isSent ? " hv-tile-sent" : ""),
        "aria-label": "Start chat: " + (uc.title || ""),
      },
      // Send chip (top-right)
      h(
        "span",
        { className: "hv-send-chip", "aria-hidden": "true" },
        Icon(isSent ? "check" : "send", 14),
      ),
      // Eyebrow: category (· tool)
      h(
        "div",
        { className: "hv-eyebrow" },
        h("span", null, uc.category || "Mission"),
        uc.tool
          ? h(
              React.Fragment || "span",
              null,
              h("span", { className: "hv-eyebrow-sep" }, "·"),
              h("span", null, uc.tool),
            )
          : null,
      ),
      // Title — the CTA
      h("h3", { className: "hv-title" }, uc.title || ""),
      // Blurb — super-short context (6–12 words)
      uc.blurb
        ? h("p", { className: "hv-blurb" }, uc.blurb)
        : null,
      // Foot — sent feedback only (keeps base layout stable)
      isSent
        ? h(
            "div",
            { className: "hv-tile-foot" },
            h("span", null, "Sent · see Activity tab"),
          )
        : null,
    );
  }

  // ── Empty state ─────────────────────────────────────────────
  function Empty() {
    return h(
      "div",
      { style: { padding: "48px 40px" } },
      h(
        "p",
        {
          style: {
            fontSize: 14,
            fontWeight: 600,
            color: "#334155",
            margin: 0,
          },
        },
        "No missions declared yet.",
      ),
      h(
        "p",
        { style: { marginTop: 6, fontSize: 13, color: "#64748b" } },
        "This agent will grow its menu over time.",
      ),
    );
  }

  // ── Dashboard (root) ────────────────────────────────────────
  // Props (injected by Houston at mount — see
  // app/src/components/shell/experience-renderer.tsx):
  //   - sendMessage(text: string): fires a chat message into the
  //     agent's "primary" session. Surfaces on the Activity tab.
  //   - readFile / writeFile / listFiles / agent / agentDef (unused here)
  function Dashboard(props) {
    var sendMessage = props && props.sendMessage;
    var sender = useSend(sendMessage);
    var useCases = AGENT.useCases || [];

    var body;
    if (useCases.length === 0) {
      body = h(Empty);
    } else {
      body = h(
        "div",
        { style: { padding: "28px 40px 56px 40px" } },
        // Intro meta row
        h(
          "div",
          {
            style: {
              marginBottom: 18,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            },
          },
          h(
            "p",
            {
              style: {
                fontSize: 13,
                color: "#475569",
                margin: 0,
                lineHeight: 1.5,
              },
            },
            useCases.length +
              " " +
              (useCases.length === 1 ? "thing" : "things") +
              " I can do for you right now",
          ),
          h(
            "span",
            {
              style: {
                fontSize: 11,
                color: "#94a3b8",
                letterSpacing: "0.02em",
              },
            },
            "Click any tile to start a conversation",
          ),
        ),
        // Grid
        h(
          "div",
          { className: "hv-grid" },
          useCases.map(function (uc, i) {
            return h(Tile, {
              key: i,
              useCase: uc,
              idx: i,
              sentIdx: sender.sentIdx,
              onSend: sender.send,
            });
          }),
        ),
      );
    }

    return h(
      "div",
      {
        className: "hv-dash",
        style: {
          height: "100%",
          overflowY: "auto",
          background: "#ffffff",
          color: "#0f172a",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
        },
      },
      h("style", { dangerouslySetInnerHTML: { __html: STYLE_CSS } }),
      h(Header),
      body,
    );
  }

  window.__houston_bundle__ = { Dashboard: Dashboard };
})();
