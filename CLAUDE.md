# CLAUDE.md — AI Assistant Guide

This file provides context for AI assistants (Claude Code, etc.) working in this repository.

## What This Repository Is

This is **Eugene Selikhov's personal CV/portfolio website**, built on top of [Quartz 4.0](https://quartz.jzhao.xyz/) — a static site generator that publishes Markdown files as a website. The site is deployed to GitHub Pages from the `myPage` branch.

The repository is a customized fork of `jackyzha0/quartz`. The Quartz framework source lives in `quartz/` and should generally not be modified unless explicitly needed. Content and configuration changes are the primary concern.

---

## Repository Structure

```
cv/
├── content/                  # Markdown content files (the CV itself)
│   └── Curiculum Vitae.md    # Main CV page
├── quartz/                   # Quartz framework source (TypeScript + Preact)
│   ├── bootstrap-cli.mjs     # CLI entrypoint
│   ├── build.ts              # Core build orchestrator
│   ├── cfg.ts                # Config type definitions
│   ├── components/           # Preact UI components
│   │   ├── *.tsx             # Individual components
│   │   ├── scripts/          # Client-side inline scripts (*.inline.ts)
│   │   ├── styles/           # Per-component SCSS
│   │   └── types.ts          # QuartzComponent type definitions
│   ├── plugins/
│   │   ├── transformers/     # Markdown/HTML AST transformers (remark/rehype plugins)
│   │   ├── filters/          # Content filters (e.g., remove drafts)
│   │   ├── emitters/         # Output generators (HTML pages, index, RSS, etc.)
│   │   └── types.ts          # Plugin type definitions
│   ├── processors/
│   │   ├── parse.ts          # Markdown → HAST pipeline
│   │   ├── filter.ts         # Apply content filters
│   │   └── emit.ts           # Run emitters to produce output
│   ├── styles/
│   │   ├── base.scss         # Base styles
│   │   ├── custom.scss       # Custom overrides (edit this for CSS customization)
│   │   └── variables.scss    # SCSS variables / design tokens
│   ├── i18n/                 # Internationalization (locale files)
│   ├── util/                 # Shared utilities (paths, logging, theming, etc.)
│   └── worker.ts             # Worker thread for parallel parsing
├── docs/                     # Quartz project documentation (not site content)
├── quartz.config.ts          # Main site configuration (plugins, theme, analytics)
├── quartz.layout.ts          # Page layout component configuration
├── tsconfig.json             # TypeScript config
├── .prettierrc               # Prettier formatting config
└── .github/workflows/
    ├── deploy.yml            # Deploys site to GitHub Pages on push to `myPage`
    └── ci.yaml               # CI: type check, test, build (upstream Quartz only)
```

---

## Key Configuration Files

### `quartz.config.ts`
The primary configuration file. Controls:
- `pageTitle` / `pageTitleSuffix` — browser tab title
- `baseUrl` — used for sitemap and RSS feeds
- `analytics` — analytics provider (currently Plausible)
- `locale` — BCP 47 locale tag (e.g., `"en-US"`)
- `ignorePatterns` — glob patterns for files to exclude (e.g., `"private"`, `"templates"`)
- `theme` — fonts and color palette for light/dark mode
- `plugins.transformers` — Markdown/HTML processing pipeline
- `plugins.filters` — content filters (e.g., `RemoveDrafts`)
- `plugins.emitters` — output generators (pages, RSS, sitemap, etc.)

### `quartz.layout.ts`
Controls which UI components appear in which regions of the page:
- `sharedPageComponents` — components on every page (`head`, `header`, `footer`, `afterBody`)
- `defaultContentPageLayout` — layout for single-note pages (`beforeBody`, `left`, `right`)
- `defaultListPageLayout` — layout for folder/tag list pages

---

## Development Workflows

### Prerequisites
- Node.js 20 or 22+
- npm 9.3.1+

### Common Commands

| Command | Purpose |
|---|---|
| `npx quartz build --serve` | Build and serve locally with hot reload |
| `npx quartz build` | One-shot production build (outputs to `public/`) |
| `npm run docs` | Build and serve the Quartz docs site |
| `npm run check` | TypeScript type check + Prettier format check |
| `npm run format` | Auto-format all files with Prettier |
| `npm test` | Run unit tests (`path.test.ts`, `depgraph.test.ts`) |

### Local Preview
```bash
npx quartz build --serve
# Opens at http://localhost:8080 by default
```

### Deployment
Push to the `myPage` branch. GitHub Actions (`.github/workflows/deploy.yml`) will:
1. Run `npm ci`
2. Run `npx quartz build`
3. Deploy the `public/` directory to GitHub Pages

---

## Content Authoring

All website content lives in `content/`. Files are standard Markdown with optional YAML frontmatter.

### Frontmatter Fields
```yaml
---
title: Page Title
date: 2024-01-01
tags:
  - tag1
  - tag2
draft: true        # set to exclude from published site
aliases:
  - old-url-slug
---
```

### Supported Markdown Features
- GitHub Flavored Markdown (tables, task lists, strikethrough)
- Obsidian-style wikilinks: `[[Page Name]]` and `[[Page Name|Display Text]]`
- LaTeX math: inline `$...$` and block `$$...$$` (rendered with KaTeX)
- Callouts / admonitions (Obsidian syntax)
- Syntax highlighting via Shiki
- Backlinks, table of contents, graph view (auto-generated)

### Link Resolution
Links use `shortest` path resolution (`CrawlLinks` plugin). You can use:
- `[[Note Name]]` — wikilink (Obsidian-style)
- `[text](relative/path.md)` — standard Markdown relative link

### Drafts
Files with `draft: true` in frontmatter are excluded from the build by the `RemoveDrafts` filter. Files in the `private/` or `templates/` folders are also ignored by default.

---

## Code Style & Conventions

### TypeScript
- Strict mode enabled (`tsconfig.json`)
- ESNext target and module system
- Preact used for JSX (`jsxImportSource: "preact"`)
- All component files use `.tsx` extension

### Prettier (enforced via `npm run check`)
- Print width: 100 characters
- Tab width: 2 spaces
- No semicolons
- Trailing commas everywhere
- Quote props: as-needed

Always run `npm run format` before committing TypeScript/TSX changes.

### SCSS
- Component-specific styles live in `quartz/components/styles/`
- Global/custom styles go in `quartz/styles/custom.scss`
- Design tokens (colors, spacing) are in `quartz/styles/variables.scss`

---

## Plugin Architecture

Quartz uses a three-stage pipeline:

1. **Transformers** (`quartz/plugins/transformers/`) — Process Markdown and HTML AST. Each plugin can provide `markdownPlugins` (remark), `htmlPlugins` (rehype), or `textTransform` hooks.

2. **Filters** (`quartz/plugins/filters/`) — Decide which files get published. Return `true` from `shouldPublish()` to include a file.

3. **Emitters** (`quartz/plugins/emitters/`) — Generate output files. Each emitter's `emit()` method receives all processed content and writes files to the output directory.

### Creating a Custom Component
Components are Preact functional components exported as `QuartzComponent`:
```typescript
// quartz/components/MyComponent.tsx
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function MyComponent({ fileData, cfg }: QuartzComponentProps) {
  return <div class="my-component">{fileData.frontmatter?.title}</div>
}

MyComponent.css = `
  .my-component { /* styles */ }
`

export default (() => MyComponent) satisfies QuartzComponentConstructor
```

Then register it in `quartz/components/index.ts` and use it in `quartz.layout.ts`.

---

## Branches & Git Workflow

| Branch | Purpose |
|---|---|
| `master` | Main development branch |
| `myPage` | Production deployment — pushes here trigger GitHub Pages deploy |
| `claude/*` | AI assistant working branches |

- **Never push directly to `myPage`** unless intentionally deploying.
- All `claude/` branches follow the naming convention `claude/<description>-<session-id>`.

---

## Testing

```bash
npm test
```

Runs two test files using `tsx` (no test framework, just assertions):
- `quartz/util/path.test.ts` — path utilities
- `quartz/depgraph.test.ts` — dependency graph logic

---

## Notes for AI Assistants

- **Content edits** → modify files in `content/`
- **Visual/layout changes** → edit `quartz.layout.ts` or `quartz/styles/custom.scss`
- **Site-wide settings** → edit `quartz.config.ts`
- **Framework internals** (`quartz/`) → only modify when explicitly asked; these are shared Quartz framework files
- After TypeScript changes, run `npm run check` to verify types and formatting
- After content changes, no compilation needed — just verify the Markdown renders correctly with `npx quartz build --serve`
- The `docs/` directory contains Quartz framework documentation, not site content
