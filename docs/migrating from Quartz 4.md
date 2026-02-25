---
title: "Migrating from Quartz 4"
---

## Overview

Quartz 5 introduces a community plugin system that fundamentally changes how plugins and components are managed. Most plugins that were built into Quartz 4 are now standalone community plugins maintained under the [quartz-community](https://github.com/quartz-community) organization. This guide walks through the changes needed to migrate your configuration.

## What Changed

List the key architectural changes:

- **Plugin system**: Plugins are now standalone Git repositories, installed via `npx quartz plugin add`
- **Import pattern**: Community plugins use `ExternalPlugin.X()` (from `.quartz/plugins`) instead of `Plugin.X()` (from `./quartz/plugins`)
- **Layout structure**: `quartz.config.yaml` now uses `defaults` + `byPageType` instead of `sharedPageComponents` + per-layout objects
- **Page Types**: A new plugin category for page rendering (content, folder, tag pages)
- **Component references**: In layout files, community components use `Plugin.X()` (from `.quartz/plugins`) instead of `Component.X()` (from `./quartz/components`)

## Step-by-Step Migration

### 1. Install Community Plugins

Run the following commands to install the default set of community plugins:

```shell
npx quartz plugin add github:quartz-community/explorer
npx quartz plugin add github:quartz-community/graph
npx quartz plugin add github:quartz-community/search
npx quartz plugin add github:quartz-community/backlinks
npx quartz plugin add github:quartz-community/table-of-contents
npx quartz plugin add github:quartz-community/article-title
npx quartz plugin add github:quartz-community/tag-list
npx quartz plugin add github:quartz-community/page-title
npx quartz plugin add github:quartz-community/darkmode
npx quartz plugin add github:quartz-community/content-meta
npx quartz plugin add github:quartz-community/footer
npx quartz plugin add github:quartz-community/content-page
npx quartz plugin add github:quartz-community/folder-page
npx quartz plugin add github:quartz-community/tag-page
npx quartz plugin add github:quartz-community/created-modified-date
npx quartz plugin add github:quartz-community/syntax-highlighting
npx quartz plugin add github:quartz-community/obsidian-flavored-markdown
npx quartz plugin add github:quartz-community/github-flavored-markdown
npx quartz plugin add github:quartz-community/crawl-links
npx quartz plugin add github:quartz-community/description
npx quartz plugin add github:quartz-community/latex
npx quartz plugin add github:quartz-community/remove-draft
npx quartz plugin add github:quartz-community/alias-redirects
npx quartz plugin add github:quartz-community/content-index
npx quartz plugin add github:quartz-community/favicon
npx quartz plugin add github:quartz-community/og-image
npx quartz plugin add github:quartz-community/cname
```

Also install any optional plugins you were using:

```shell
# Only if you used these in v4:
npx quartz plugin add github:quartz-community/comments
npx quartz plugin add github:quartz-community/reader-mode
npx quartz plugin add github:quartz-community/breadcrumbs
npx quartz plugin add github:quartz-community/recent-notes
npx quartz plugin add github:quartz-community/hard-line-breaks
npx quartz plugin add github:quartz-community/citations
npx quartz plugin add github:quartz-community/ox-hugo
npx quartz plugin add github:quartz-community/roam
npx quartz plugin add github:quartz-community/explicit-publish
```

### 2. Update quartz.config.yaml

Show before (v4) and after (v5) comparison:

**Before (v4):**

```ts title="quartz.config.ts"
import * as Plugin from "./quartz/plugins"

plugins: {
  transformers: [
    Plugin.FrontMatter(),
    Plugin.CreatedModifiedDate({ priority: ["frontmatter", "git", "filesystem"] }),
    Plugin.Latex({ renderEngine: "katex" }),
  ],
  filters: [Plugin.RemoveDrafts()],
  emitters: [
    Plugin.AliasRedirects(),
    Plugin.ComponentResources(),
    Plugin.ContentPage(),
    Plugin.FolderPage(),
    Plugin.TagPage(),
    Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
    Plugin.Assets(),
    Plugin.Static(),
    Plugin.NotFoundPage(),
  ],
}
```

**After (v5):**

```yaml title="quartz.config.yaml"
plugins:
  - source: github:quartz-community/note-properties
    enabled: true
    options:
      delimiters: "---"
      language: yaml
    order: 5
  - source: github:quartz-community/created-modified-date
    enabled: true
    options:
      priority:
        - frontmatter
        - git
        - filesystem
    order: 10
  - source: github:quartz-community/latex
    enabled: true
    options:
      renderEngine: katex
    order: 80
  - source: github:quartz-community/remove-draft
    enabled: true
  - source: github:quartz-community/alias-redirects
    enabled: true
  - source: github:quartz-community/content-index
    enabled: true
    options:
      enableSiteMap: true
      enableRSS: true
  - source: github:quartz-community/favicon
    enabled: true
  - source: github:quartz-community/og-image
    enabled: true
  - source: github:quartz-community/cname
    enabled: true
  - source: github:quartz-community/content-page
    enabled: true
  - source: github:quartz-community/folder-page
    enabled: true
  - source: github:quartz-community/tag-page
    enabled: true
  # ... more plugins
```

Key changes:

- Plugins are now referenced by their GitHub source (`github:org/repo`)
- Plugin type (transformer, filter, emitter, pageType) is determined by the plugin's manifest, not by which array you place it in
- Execution order is controlled by the `order` field (lower numbers run first)
- Each plugin entry has `enabled`, `options`, `order`, and optionally `layout` fields
- Install community plugins with `npx quartz plugin add github:quartz-community/<name>`

### 3. Update layout configuration

Show before (v4) and after (v5):

**Before (v4):**

```ts title="quartz.layout.ts"
import * as Component from "./quartz/components"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({ links: { ... } }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta(), Component.TagList()],
  left: [Component.PageTitle(), Component.Search(), Component.Darkmode(), Component.Explorer()],
  right: [Component.Graph(), Component.TableOfContents(), Component.Backlinks()],
}
```

**After (v5):**

```yaml title="quartz.config.yaml"
plugins:
  - source: github:quartz-community/breadcrumbs
    enabled: true
    layout:
      position: beforeBody
      priority: 5
  - source: github:quartz-community/article-title
    enabled: true
    layout:
      position: beforeBody
      priority: 10
  - source: github:quartz-community/content-meta
    enabled: true
    layout:
      position: beforeBody
      priority: 20
  - source: github:quartz-community/tag-list
    enabled: true
    layout:
      position: beforeBody
      priority: 30
  - source: github:quartz-community/page-title
    enabled: true
    layout:
      position: left
      priority: 10
  - source: github:quartz-community/search
    enabled: true
    layout:
      position: left
      priority: 20
  - source: github:quartz-community/darkmode
    enabled: true
    layout:
      position: left
      priority: 30
  - source: github:quartz-community/explorer
    enabled: true
    layout:
      position: left
      priority: 50
  - source: github:quartz-community/graph
    enabled: true
    layout:
      position: right
      priority: 10
  - source: github:quartz-community/backlinks
    enabled: true
    layout:
      position: right
      priority: 30
  - source: github:quartz-community/footer
    enabled: true
    options:
      links:
        GitHub: https://github.com/jackyzha0/quartz
        Discord Community: https://discord.gg/cRFFHYye7t

layout:
  byPageType:
    content: {}
    folder:
      exclude:
        - reader-mode
      positions:
        right: []
    tag:
      exclude:
        - reader-mode
      positions:
        right: []
    "404":
      positions:
        beforeBody: []
        left: []
        right: []
```

Key changes:

- Layout position is now a property on each plugin entry (`layout.position`, `layout.priority`)
- `sharedPageComponents` is gone — all layout is plugin-driven
- Per-page-type overrides live in the `layout.byPageType` section
- Empty arrays (`[]`) clear a position for that page type
- The `exclude` field removes specific plugins from a page type

### 4. Update CI/CD

Add `npx quartz plugin restore` to your build pipeline, before `npx quartz build`. See [[ci-cd]] for detailed examples.

### 5. Commit and Deploy

```shell
git add quartz.ts quartz.lock.json
git commit -m "chore: migrate to Quartz 5 plugin system"
```

## Plugin Reference Table

Show a table mapping v4 Plugin names to v5 equivalents:

| v4                                  | v5                                          | Type                  |
| ----------------------------------- | ------------------------------------------- | --------------------- |
| `Plugin.FrontMatter()`              | `Plugin.FrontMatter()` (unchanged)          | Internal              |
| `Plugin.CreatedModifiedDate()`      | `ExternalPlugin.CreatedModifiedDate()`      | Community             |
| `Plugin.SyntaxHighlighting()`       | `ExternalPlugin.SyntaxHighlighting()`       | Community             |
| `Plugin.ObsidianFlavoredMarkdown()` | `ExternalPlugin.ObsidianFlavoredMarkdown()` | Community             |
| `Plugin.GitHubFlavoredMarkdown()`   | `ExternalPlugin.GitHubFlavoredMarkdown()`   | Community             |
| `Plugin.CrawlLinks()`               | `ExternalPlugin.CrawlLinks()`               | Community             |
| `Plugin.Description()`              | `ExternalPlugin.Description()`              | Community             |
| `Plugin.Latex()`                    | `ExternalPlugin.Latex()`                    | Community             |
| `Plugin.RemoveDrafts()`             | `ExternalPlugin.RemoveDrafts()`             | Community             |
| `Plugin.ContentPage()`              | `ExternalPlugin.ContentPage()`              | Community (pageTypes) |
| `Plugin.FolderPage()`               | `ExternalPlugin.FolderPage()`               | Community (pageTypes) |
| `Plugin.TagPage()`                  | `ExternalPlugin.TagPage()`                  | Community (pageTypes) |
| `Plugin.NotFoundPage()`             | `Plugin.PageTypes.NotFoundPageType()`       | Internal (pageTypes)  |
| `Plugin.ComponentResources()`       | `Plugin.ComponentResources()` (unchanged)   | Internal              |
| `Plugin.Assets()`                   | `Plugin.Assets()` (unchanged)               | Internal              |
| `Plugin.Static()`                   | `Plugin.Static()` (unchanged)               | Internal              |
| `Plugin.AliasRedirects()`           | `ExternalPlugin.AliasRedirects()`           | Community             |
| `Plugin.ContentIndex()`             | `ExternalPlugin.ContentIndex()`             | Community             |

And for components in layout:

| v4 Layout                     | v5 Layout                                  |
| ----------------------------- | ------------------------------------------ |
| `Component.Explorer()`        | `Plugin.Explorer()`                        |
| `Component.Graph()`           | `Plugin.Graph()`                           |
| `Component.Search()`          | `Plugin.Search()`                          |
| `Component.Backlinks()`       | `Plugin.Backlinks()`                       |
| `Component.Darkmode()`        | `Plugin.Darkmode()`                        |
| `Component.Footer()`          | `Plugin.Footer()`                          |
| `Component.TableOfContents()` | `Plugin.TableOfContents()`                 |
| `Component.Head()`            | `Component.Head()` (unchanged, internal)   |
| `Component.Spacer()`          | `Component.Spacer()` (unchanged, internal) |
