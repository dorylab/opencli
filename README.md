# OpenCLI

> **Make any website your CLI.**  
> Zero risk · Reuse Chrome login · AI-powered discovery

[中文文档](./README.zh-CN.md)

[![npm](https://img.shields.io/npm/v/@jackwener/opencli?style=flat-square)](https://www.npmjs.com/package/@jackwener/opencli)
[![Node.js Version](https://img.shields.io/node/v/@jackwener/opencli?style=flat-square)](https://nodejs.org)
[![License](https://img.shields.io/npm/l/@jackwener/opencli?style=flat-square)](./LICENSE)

A CLI tool that turns **any website** into a command-line interface. **47 commands** across **17 sites** — bilibili, zhihu, xiaohongshu, twitter, reddit, xueqiu, github, v2ex, hackernews, bbc, weibo, boss, yahoo-finance, reuters, smzdm, ctrip, youtube — powered by browser session reuse and AI-native discovery.

---

## Table of Contents

- [Highlights](#highlights)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Built-in Commands](#built-in-commands)
- [Output Formats](#output-formats)
- [For AI Agents (Developer Guide)](#for-ai-agents-developer-guide)
- [Troubleshooting](#troubleshooting)
- [Releasing New Versions](#releasing-new-versions)
- [License](#license)

---

## Highlights

- **Account-safe** — Reuses Chrome's logged-in state; your credentials never leave the browser.
- **AI Agent ready** — `explore` discovers APIs, `synthesize` generates adapters, `cascade` finds auth strategies.
- **Dynamic Loader** — Simply drop `.ts` or `.yaml` adapters into the `clis/` folder for auto-registration.
- **Dual-Engine Architecture** — Supports both YAML declarative data pipelines and robust browser runtime typescript injections.

## Prerequisites

- **Node.js**: >= 18.0.0
- **Chrome** running **and logged into the target site** (e.g. bilibili.com, zhihu.com, xiaohongshu.com).
- **[Playwright MCP Bridge](https://chromewebstore.google.com/detail/playwright-mcp-bridge/mmlmfjhmonkocbjadbfplnigmagldckm)** extension installed in Chrome.

This is the default connection mode — no extra configuration needed beyond installing the extension.

#### Alternative: Chrome 144+ CDP Auto-Discovery

For Chrome 144+, you can skip the extension and use built-in remote debugging instead:

1. Open `chrome://inspect#remote-debugging` in Chrome
2. Check **"Allow remote debugging for this browser instance"**
3. Set `OPENCLI_USE_CDP=1` before running opencli

You can also manually specify an endpoint via `OPENCLI_CDP_ENDPOINT` env var. (Note: Public API commands like `hackernews`, `github search`, `v2ex` need no browser at all.)

> **⚠️ Important**: Browser commands reuse your Chrome login session. You must be logged into the target website in Chrome before running commands. If you get empty data or errors, check your login status first.

## Quick Start

### Install via npm (recommended)

```bash
npm install -g @jackwener/opencli
```

Then use directly:

```bash
opencli list                              # See all commands
opencli hackernews top --limit 5          # Public API, no browser
opencli bilibili hot --limit 5            # Browser command
opencli zhihu hot -f json                 # JSON output
```

### Install from source (for developers)

```bash
git clone git@github.com:jackwener/opencli.git
cd opencli 
npm install
npm run build
npm link      # Link binary globally
opencli list  # Now you can use it anywhere!
```

### Update

```bash
npm install -g @jackwener/opencli@latest
```

## Built-in Commands

| Site | Commands | Mode |
|------|----------|------|
| **bilibili** | `hot` `search` `me` `favorite` ... (11 commands) | 🔐 Browser |
| **zhihu** | `hot` `search` `question` | 🔐 Browser |
| **xiaohongshu** | `search` `notifications` `feed` `me` `user` | 🔐 Browser |
| **xueqiu** | `feed` `hot-stock` `hot` `search` `stock` `watchlist` | 🔐 Browser |
| **twitter** | `trending` `bookmarks` `profile` `search` `timeline` | 🔐 Browser |
| **reddit** | `hot` `frontpage` `search` `subreddit` | 🔐 Browser |
| **weibo** | `hot` | 🔐 Browser |
| **boss** | `search` | 🔐 Browser |
| **youtube** | `search` | 🔐 Browser |
| **yahoo-finance** | `quote` | 🔐 Browser |
| **reuters** | `search` | 🔐 Browser |
| **smzdm** | `search` | 🔐 Browser |
| **ctrip** | `search` | 🔐 Browser |
| **github** | `search` | 🌐 Public |
| **v2ex** | `hot` `latest` `topic` | 🌐 Public |
| **hackernews** | `top` | 🌐 Public |
| **bbc** | `news` | 🌐 Public |

## Output Formats

Commands support various format outputs:

```bash
opencli bilibili hot -f table   # Default: rich terminal table
opencli bilibili hot -f json    # JSON (pipe to jq or LLMs)
opencli bilibili hot -f md      # Markdown
opencli bilibili hot -f csv     # CSV
opencli bilibili hot -v         # Verbose: show pipeline debug steps
```

## For AI Agents (Developer Guide)

If you are an AI assistant tasked with creating a new command adapter for `opencli`, please follow the AI Agent workflow below:

> **Information for AI:** 
> Before writing any adapter code, you **must** read [CLI-CREATOR.md](./CLI-CREATOR.md). It contains the complete browser exploration workflow, the 5-tier authentication strategy decision tree, and debugging guide. Skipping this will lead to preventable errors.

```bash
# 1. Deep Explore — discover APIs, infer capabilities, detect framework
opencli explore https://example.com --site mysite

# 2. Synthesize — generate YAML adapters from explore artifacts
opencli synthesize mysite

# 3. Generate — one-shot: explore → synthesize → register
opencli generate https://example.com --goal "hot"

# 4. Strategy Cascade — auto-probe: PUBLIC → COOKIE → HEADER
opencli cascade https://api.example.com/data
```

Explore outputs to `.opencli/explore/<site>/` (manifest.json, endpoints.json, capabilities.json, auth.json).

## Troubleshooting

- **"Failed to connect to Playwright MCP Bridge"**
  - Ensure the Playwright MCP extension is installed and **enabled** in your running Chrome.
  - Restart the Chrome browser if you just installed the extension.
- **"CDP command failed" or "boss search blocked"**
  - Some sites (like BOSS Zhipin) actively block Chrome DevTools Protocol connections. OpenCLI falls back to cookie extraction, but ensure you didn't force `--chrome-mode` unnecessarily. 
- **Empty data returns or 'Unauthorized' error**
  - Your login session in Chrome might have expired. Open a normal Chrome tab, navigate to the target site, and log in or refresh the page to prove you are human.
- **Node API errors**
  - Make sure you are using Node.js >= 18. Some dependencies require modern Node APIs.

## Releasing New Versions

```bash
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0
git push --follow-tags
```

The CI will automatically build, create a GitHub release, and publish to npm.

## License

[BSD-3-Clause](./LICENSE)
