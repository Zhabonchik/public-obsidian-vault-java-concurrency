# Quartz v5 Architecture Overview

This document provides a bird's-eye view of the Quartz v5 rework for maintainer review. It covers the plugin-based architecture, build pipeline, page type system, layout engine, and the full catalog of community plugins.

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Build Pipeline](#build-pipeline)
- [Plugin System](#plugin-system)
  - [Plugin Categories](#plugin-categories)
  - [Plugin Lifecycle](#plugin-lifecycle)
  - [Plugin Manifest](#plugin-manifest)
  - [Plugin Template Structure](#plugin-template-structure)
- [PageType System](#pagetype-system)
  - [Matchers](#matchers)
  - [Virtual Pages](#virtual-pages)
  - [PageTypeDispatcher](#pagetypedispatcher)
- [Layout System](#layout-system)
  - [Layout Positions](#layout-positions)
  - [Priority and Ordering](#priority-and-ordering)
  - [Groups (Flex Containers)](#groups-flex-containers)
  - [Display Modifiers](#display-modifiers)
  - [Conditions](#conditions)
  - [Per-Page-Type Overrides](#per-page-type-overrides)
- [Component Architecture](#component-architecture)
  - [QuartzComponent](#quartzcomponent)
  - [Component Registry](#component-registry)
  - [Page Rendering](#page-rendering)
  - [Page Frames](#page-frames)
  - [Transclusion](#transclusion)
- [Configuration](#configuration)
  - [quartz.config.yaml](#quartzconfigyaml)
  - [TypeScript Override](#typescript-override)
- [Plugin Catalog](#plugin-catalog)
  - [Transformers](#transformers)
  - [Filters](#filters)
  - [Emitters](#emitters)
  - [PageType Plugins](#pagetype-plugins)
  - [Component Plugins](#component-plugins)

---

## High-Level Architecture

Quartz v5 is a fully plugin-based static site generator for digital gardens. Every functional unit — content transformation, filtering, page generation, and UI rendering — is implemented as an external community plugin loaded from Git repositories.

```
quartz.config.yaml           ← Single source of truth for all configuration
        │
        ▼
  ┌─────────────┐
  │ Config Loader│  Reads YAML, installs plugins from Git, validates
  │  (loader/)   │  dependencies, categorizes, sorts, instantiates
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐     ┌──────────┐     ┌──────────┐     ┌──────────────┐
  │  Transformers│────▶│  Filters │────▶│ Emitters │────▶│ Output (HTML)│
  │  (parse)     │     │ (filter) │     │  (emit)  │     │  CSS, JS, etc│
  └─────────────┘     └──────────┘     └──────────┘     └──────────────┘
                                            │
                                     ┌──────┴──────┐
                                     │  PageType    │
                                     │  Dispatcher  │
                                     │ (phase 1)    │
                                     └─────────────┘
```

**Key architectural decisions:**

1. **Everything is a plugin.** There is no monolithic core. The framework provides the pipeline, loader, and component infrastructure; all domain logic lives in plugins.
2. **Git-native plugin distribution.** Plugins are cloned from GitHub repositories into `.quartz/plugins/` via `isomorphic-git`. No npm registry required.
3. **Declarative configuration.** A single `quartz.config.yaml` declares all plugins, their options, ordering, and layout positions. TypeScript overrides are optional.
4. **PageType system.** A new abstraction that unifies content rendering, virtual page generation, and layout binding into a single plugin type.
5. **Two-phase emit.** The PageTypeDispatcher runs first (generating virtual pages), then all other emitters receive content + virtual pages together.

---

## Build Pipeline

The build pipeline lives in `quartz/build.ts` and the `quartz/processors/` directory. It follows a linear flow:

### 1. File Discovery

```
glob("**/*.*", directory, ignorePatterns)
  → allFiles (all file paths)
  → allSlugs (slugified paths)
  → Extension-stripped slug aliases for PageType extensions (.canvas, .base)
```

PageType plugins register file extensions (e.g., `.canvas`, `.base`). The build adds extension-stripped slug aliases so wikilinks like `![[file.canvas]]` resolve to the virtual page slug `file`.

### 2. Parse (`quartz/processors/parse.ts`)

Only `.md` files are parsed. The parsing pipeline:

```
Markdown source
  → textTransform()     Transformer plugins modify raw text
  → remark-parse        Markdown → mdast (Markdown AST)
  → markdownPlugins()   Transformer plugins add remark plugins
  → remark-rehype       mdast → hast (HTML AST)
  → htmlPlugins()       Transformer plugins add rehype plugins
  → ProcessedContent    [hast tree, VFile with data]
```

Each step runs every enabled transformer plugin's corresponding hook in order.

### 3. Filter (`quartz/processors/filter.ts`)

```
ProcessedContent[]
  → filter.shouldPublish(ctx, content)   For each filter plugin
  → FilteredContent[]
```

Filter plugins decide which files to publish. Examples: `remove-draft` (excludes `draft: true` frontmatter), `explicit-publish` (requires `publish: true`).

### 4. Emit (`quartz/processors/emit.ts`)

Emission is split into two phases to support virtual pages:

```
Phase 1: PageTypeDispatcher
  ├── Generate virtual pages (tag pages, folder pages, bases pages, etc.)
  ├── Populate ctx.virtualPages
  ├── Render Body components → populate htmlAst (for transclusion)
  └── Emit all pages as HTML

Phase 2: All other emitters
  ├── Receive content + virtualPages merged
  ├── ContentIndex (sitemap, RSS, search index)
  ├── AliasRedirects, CNAME, Favicon, OGImage
  └── ComponentResources (CSS, JS bundles), Assets, Static files
```

This two-phase approach ensures that emitters like ContentIndex include virtual pages in their output (sitemap, RSS, explorer data).

### Incremental Rebuild

During `--watch` mode, the same two-phase approach applies. `partialEmit` is used when available to only re-emit changed files. The content map tracks add/change/delete events, and the trie is rebuilt on each partial emit.

---

## Plugin System

### Plugin Categories

There are **4 processing categories** and **1 UI category**:

| Category        | Interface                           | Key Methods                                                            | Purpose                                 |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| **Transformer** | `QuartzTransformerPluginInstance`   | `textTransform`, `markdownPlugins`, `htmlPlugins`, `externalResources` | Transform content during parsing        |
| **Filter**      | `QuartzFilterPluginInstance`        | `shouldPublish`                                                        | Decide which files to include           |
| **Emitter**     | `QuartzEmitterPluginInstance`       | `emit`, `partialEmit`, `getQuartzComponents`, `externalResources`      | Produce output files                    |
| **PageType**    | `QuartzPageTypePluginInstance`      | `match`, `generate`, `body`, `layout`, `fileExtensions`, `priority`    | Define page rendering and virtual pages |
| **Component**   | _(registered in ComponentRegistry)_ | QuartzComponent function + static CSS/JS                               | UI components placed via layout config  |

A plugin can belong to multiple categories. For example, `content-page` is both `pageType` and `component` — it defines how content pages are matched/rendered AND provides the Body component.

### Plugin Lifecycle

```
quartz.config.yaml
  │
  ▼
1. Read YAML config (config-loader.ts)
  │
  ▼
2. For each enabled plugin entry:
  │  a. Parse source string (e.g., "github:quartz-community/explorer")
  │  b. Clone/update from GitHub via isomorphic-git (gitLoader.ts)
  │  c. Read manifest from package.json "quartz" field
  │  d. Load components into ComponentRegistry (componentLoader.ts)
  │
  ▼
3. Validate dependencies
  │  a. Check all dependencies are present and enabled
  │  b. Verify execution order (dependency must run before dependent)
  │  c. Detect circular dependencies
  │
  ▼
4. Categorize plugins
  │  a. Read category from manifest
  │  b. For dual-category (e.g., ["pageType", "component"]), resolve processing category
  │  c. Component-only plugins are loaded into registry but not into processing pipeline
  │  d. If category unknown, detect by instantiating and inspecting exported methods
  │
  ▼
5. Sort by order within each category (entry.order ?? manifest.defaultOrder ?? 50)
  │
  ▼
6. Instantiate plugins
  │  a. Import module from dist/index.js
  │  b. Find factory function (default export, or "plugin" export, or first matching export)
  │  c. Merge options: { ...manifest.defaultOptions, ...entry.options }
  │  d. Call factory(mergedOptions) → plugin instance
  │
  ▼
7. Build layout (loadQuartzLayout)
  │  a. Resolve component references from ComponentRegistry
  │  b. Apply display wrappers (MobileOnly/DesktopOnly)
  │  c. Apply condition wrappers (ConditionalRender)
  │  d. Resolve flex groups
  │  e. Build per-page-type layout overrides
  │
  ▼
8. Add built-in plugins
  │  a. ComponentResources, Assets, Static (emitters)
  │  b. NotFoundPageType (built-in 404 page)
  │  c. PageTypeDispatcher (wired with resolved layout)
  │
  ▼
9. Return QuartzConfig { configuration, plugins }
```

### Plugin Manifest

Each plugin declares metadata in its `package.json` under the `"quartz"` field:

```json
{
  "quartz": {
    "name": "explorer",
    "displayName": "Explorer",
    "category": "component",
    "version": "1.0.0",
    "quartzVersion": ">=5.0.0",
    "dependencies": [],
    "defaultOrder": 50,
    "defaultEnabled": true,
    "defaultOptions": {},
    "components": {
      "Explorer": {
        "displayName": "Explorer",
        "defaultPosition": "left",
        "defaultPriority": 50
      }
    }
  }
}
```

| Field            | Type                                | Description                                                                 |
| ---------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| `name`           | `string`                            | Plugin identifier (kebab-case)                                              |
| `displayName`    | `string`                            | Human-readable name                                                         |
| `category`       | `string \| string[]`                | One or more of: `transformer`, `filter`, `emitter`, `pageType`, `component` |
| `version`        | `string`                            | Plugin version                                                              |
| `quartzVersion`  | `string`                            | Compatible Quartz version range                                             |
| `dependencies`   | `string[]`                          | Required plugin sources (e.g., `"github:quartz-community/crawl-links"`)     |
| `defaultOrder`   | `number`                            | Default execution order (0-100, lower = runs first)                         |
| `defaultEnabled` | `boolean`                           | Whether enabled by default on install                                       |
| `defaultOptions` | `object`                            | Default options merged with user config                                     |
| `configSchema`   | `object`                            | JSON Schema for options validation                                          |
| `components`     | `Record<string, ComponentManifest>` | UI components provided by this plugin                                       |

### Plugin Template Structure

Every community plugin follows this structure:

```
plugin-name/
├── src/
│   ├── index.ts              # Main exports (plugin factory + manifest)
│   ├── [plugin-type].ts      # Plugin implementation
│   ├── types.ts              # Type definitions
│   └── components/           # UI components (if any)
│       ├── index.ts          # Component exports
│       ├── Component.tsx     # Preact component
│       └── Component.scss    # Styles
├── dist/                     # Compiled output (tsup)
│   ├── index.js / index.d.ts
│   └── components/
├── package.json              # With "quartz" metadata field
├── tsconfig.json             # TypeScript config
├── tsup.config.ts            # Build config (sass.compile for SCSS)
├── vitest.config.ts          # Test config
├── .eslintrc.json
├── .prettierrc
├── README.md
├── LICENSE
├── CHANGELOG.md
└── .github/                  # CI workflows
```

**Build configuration (`tsup.config.ts`):**

All plugins use `tsup` for building. Plugins with SCSS styles use a custom `esbuildPlugins` entry that compiles SCSS via `sass.compile()` and injects the CSS as a string export.

---

## PageType System

The PageType system is the central innovation of v5. It replaces the previous monolithic page rendering approach with a pluggable, extensible system where each page "type" (content, folder, tag, canvas, bases) is a separate plugin.

### Core Interface

```typescript
interface QuartzPageTypePluginInstance {
  name: string
  priority?: number // Higher = matched first (descending sort)
  fileExtensions?: string[] // e.g., [".canvas"] — registers for slug aliasing
  match: PageMatcher // Determines if this page type handles a given page
  generate?: PageGenerator // Produces virtual pages (tag listings, folder pages, etc.)
  layout: string // Layout key (used for per-page-type overrides)
  frame?: string // PageFrame name (e.g. "full-width", "minimal") — defaults to "default"
  body: QuartzComponentConstructor // The Body component for rendering page content
}
```

### Matchers

The `matchers.ts` module provides composable matcher factories:

```typescript
import { match } from "quartz/plugins/pageTypes/matchers"

match.ext(".canvas") // Matches files with .canvas extension
match.slugPrefix("tags/") // Matches slugs starting with "tags/"
match.frontmatter(
  "layout", // Matches based on frontmatter values
  (v) => v === "custom",
)
match.and(m1, m2) // Logical AND
match.or(m1, m2) // Logical OR
match.not(m1) // Logical NOT
match.all() // Always matches
match.none() // Never matches
```

### Virtual Pages

PageType plugins with a `generate` method produce virtual pages — pages that don't exist as files on disk but are rendered as if they do. Examples:

- **Tag pages**: One virtual page per tag (e.g., `/tags/javascript`)
- **Folder pages**: One virtual page per folder (e.g., `/posts/`)
- **Bases pages**: View-based aggregate pages from `.base` files

Virtual pages are represented as:

```typescript
interface VirtualPage {
  slug: string
  title: string
  data: Partial<QuartzPluginData> & Record<string, unknown>
}
```

They are converted to `ProcessedContent` (with a synthetic hast tree and VFile) by the PageTypeDispatcher.

### PageTypeDispatcher

The PageTypeDispatcher (`quartz/plugins/pageTypes/dispatcher.ts`) is a special emitter plugin that orchestrates all PageType plugins. It runs as Phase 1 of emission and has a 3-phase internal flow:

```
Phase 1: Generate Virtual Pages
  For each PageType plugin with a generate() method:
    → Call generate({ content, cfg, ctx })
    → Create ProcessedContent entries (defaultProcessedContent)
    → Push to ctx.virtualPages (except 404)
    → Collect in virtualEntries[]

Phase 2: Populate htmlAst
  For each virtual entry:
    → Render BodyComponent via preact-render-to-string
    → Parse HTML string to hast via hast-util-from-html
    → Set tree.children and vfile.data.htmlAst
  (This enables transclusion of virtual pages, e.g., ![[file.canvas]])

Phase 3: Emit Pages
  a. Emit regular pages:
     For each file in content:
       → Find first matching PageType (sorted by priority, descending)
       → Resolve layout (defaults + per-page-type overrides)
       → renderPage() → write HTML
  b. Emit virtual pages:
     For each virtual entry:
       → renderPage() → write HTML
```

**Priority:** PageType plugins are sorted by `priority` (descending, higher = matched first). The first match wins. This allows specialized types (canvas, bases) to take precedence over the generic content type.

---

## Layout System

The layout system determines which UI components appear on each page and where they are positioned. It is fully declarative via `quartz.config.yaml`.

### Layout Positions

Each component is placed in one of four positions:

| Position     | Location           | Rendered As                         |
| ------------ | ------------------ | ----------------------------------- |
| `left`       | Left sidebar       | `<div class="left sidebar">`        |
| `right`      | Right sidebar      | `<div class="right sidebar">`       |
| `beforeBody` | Above page content | Inside `<div class="popover-hint">` |
| `afterBody`  | Below page content | Inside `<div class="page-footer">`  |

Additionally, there are structural slots not user-configurable per-component:

- `head` — Built-in `<Head>` component (meta tags, CSS links)
- `header` — Page header area
- `footer` — Footer component (from `footer` plugin)

### Full Page Layout Structure

```html
<html>
  <head />
  <!-- head -->
  <body>
    <div class="page">
      <body>
        <div class="left sidebar">
          <!-- left[] components by priority -->
        </div>
        <div class="center">
          <div class="page-header">
            <header>
              <!-- header[] components -->
            </header>
            <div class="popover-hint">
              <!-- beforeBody[] components by priority -->
            </div>
          </div>
          <content />
          <!-- pageBody (from PageType) -->
          <hr />
          <div class="page-footer">
            <!-- afterBody[] components by priority -->
          </div>
        </div>
        <div class="right sidebar">
          <!-- right[] components by priority -->
        </div>
        <footer />
        <!-- footer -->
      </body>
    </div>
  </body>
</html>
```

### Priority and Ordering

Each component has a numeric `priority`. Lower values render first (closer to the top/start of the position).

```yaml
plugins:
  - source: github:quartz-community/page-title
    layout:
      position: left
      priority: 10 # Renders first in left sidebar

  - source: github:quartz-community/search
    layout:
      position: left
      priority: 20 # Renders second
```

### Groups (Flex Containers)

Components sharing the same `group` name are collected into a `Flex` container. The group itself is treated as a single unit with its own priority.

```yaml
plugins:
  - source: github:quartz-community/search
    layout:
      position: left
      priority: 20
      group: toolbar
      groupOptions:
        grow: true

  - source: github:quartz-community/darkmode
    layout:
      position: left
      priority: 30
      group: toolbar

  - source: github:quartz-community/reader-mode
    layout:
      position: left
      priority: 35
      group: toolbar

layout:
  groups:
    toolbar:
      priority: 15 # Group renders at priority 15 (before search's 20)
      direction: row
      gap: 0.5rem
```

**Group resolution:** The `resolveGroups()` function builds a unified list of ungrouped components and Flex groups, each with a priority. Groups use their explicit `priority` from `layout.groups` config, falling back to the first member's priority. The final list is sorted by priority.

**FlexGroupConfig options:**

| Option      | Type                                                     | Default                 | Description                 |
| ----------- | -------------------------------------------------------- | ----------------------- | --------------------------- |
| `priority`  | `number`                                                 | First member's priority | Sort priority for the group |
| `direction` | `"row" \| "column" \| "row-reverse" \| "column-reverse"` | `"row"`                 | Flex direction              |
| `wrap`      | `"nowrap" \| "wrap" \| "wrap-reverse"`                   | —                       | Flex wrap                   |
| `gap`       | `string`                                                 | `"1rem"`                | Gap between items           |

**Per-component groupOptions:**

| Option    | Type                                                    | Description        |
| --------- | ------------------------------------------------------- | ------------------ |
| `grow`    | `boolean`                                               | `flex-grow: 1`     |
| `shrink`  | `boolean`                                               | `flex-shrink: 1`   |
| `basis`   | `string`                                                | `flex-basis` value |
| `order`   | `number`                                                | CSS `order`        |
| `align`   | `"start" \| "end" \| "center" \| "stretch"`             | `align-self`       |
| `justify` | `"start" \| "end" \| "center" \| "between" \| "around"` | `justify-self`     |

### Display Modifiers

Components can be conditionally shown based on viewport:

```yaml
layout:
  display: mobile-only     # Only visible on mobile
  display: desktop-only    # Only visible on desktop
  display: all             # Always visible (default)
```

Under the hood, `mobile-only` wraps the component in `MobileOnly()` (renders a `<div>` with `display: contents` that hides on desktop via CSS media query), and `desktop-only` wraps in `DesktopOnly()`.

### Conditions

Components can be conditionally rendered based on page data:

```yaml
layout:
  condition: not-index # Don't render on the index page
```

**Built-in conditions:**

| Condition       | Description                  |
| --------------- | ---------------------------- |
| `not-index`     | Page slug is not `"index"`   |
| `has-tags`      | Page has at least one tag    |
| `has-backlinks` | Page has backlinks           |
| `has-toc`       | Page has a table of contents |

**Custom conditions** can be registered via:

```typescript
import { registerCondition } from "quartz/plugins/loader/conditions"

registerCondition("my-condition", (props) => {
  return props.fileData.frontmatter?.myField === true
})
```

### Per-Page-Type Overrides

The `layout.byPageType` section allows overriding the layout for specific page types:

```yaml
layout:
  byPageType:
    "404":
      positions:
        beforeBody: [] # No beforeBody components on 404
        left: [] # No left sidebar on 404
        right: [] # No right sidebar on 404

    folder:
      exclude:
        - reader-mode # No reader-mode on folder pages
      positions:
        right: [] # No right sidebar on folder pages

    tag:
      exclude:
        - reader-mode
      positions:
        right: []
```

**Override resolution:** For each page type, the config loader:

1. Starts with the full default layout
2. Removes excluded plugins
3. Rebuilds positions from remaining entries
4. Overwrites positions that have explicit overrides (empty array = clear that position)

---

## Component Architecture

### QuartzComponent

A `QuartzComponent` is a Preact function component with optional static resource declarations:

```typescript
type QuartzComponent = ((props: QuartzComponentProps) => any) & {
  displayName?: string
  css?: StringResource // CSS injected into page
  beforeDOMLoaded?: StringResource // JS that runs before DOM ready
  afterDOMLoaded?: StringResource // JS that runs after DOM ready
}

type QuartzComponentConstructor<Options> = (opts: Options) => QuartzComponent
```

**Props received by every component:**

```typescript
type QuartzComponentProps = {
  ctx: BuildCtx // Build context (config, slugs, etc.)
  externalResources: StaticResources // CSS/JS resources
  fileData: QuartzPluginData // Current page's data (frontmatter, slug, etc.)
  cfg: GlobalConfiguration // Site configuration
  children: (QuartzComponent | JSX.Element)[]
  tree: Node // Current page's hast tree
  allFiles: QuartzPluginData[] // All files (including virtual pages)
}
```

### Component Registry

The `ComponentRegistry` (`quartz/components/registry.ts`) is a singleton `Map` that stores all loaded components. Components are registered under multiple keys for flexible lookup:

1. **Fully-qualified**: `"pluginName/ExportName"` (e.g., `"explorer/Explorer"`)
2. **Export name**: `"Explorer"` (PascalCase)
3. **Plugin name**: `"explorer"` (kebab-case, only if plugin has exactly one component)

The layout builder looks up components by:

1. Plugin name (kebab-case from source URL)
2. Fully-qualified key (`source/name`)
3. PascalCase conversion of plugin name

### Page Rendering

`renderPage()` in `quartz/components/renderPage.tsx`:

1. Deep-clones the hast tree (to preserve the cached version)
2. Resolves transclusions (see below)
3. Destructures the layout into Head, header[], beforeBody[], Content, afterBody[], left[], right[], Footer, and frame name
4. Resolves the frame via `resolveFrame(frameName)` — falls back to `DefaultFrame` if unset
5. Delegates the inner page structure to `frame.render({...all slots...})`
6. Wraps the frame output in the stable outer shell: `<html>` → `<Head/>` → `<body data-slug>` → `<div id="quartz-root" data-frame={frame.name}>` → `<Body>`
7. Serializes to HTML string via `preact-render-to-string`

The `data-frame` attribute on `#quartz-root` enables CSS targeting per-frame (see [Page Frames](#page-frames)).
### Page Frames

The PageFrame system allows page types to optionally define completely different inner HTML structures (e.g. with/without sidebars, horizontal layouts, minimal chrome) while the outer shell remains stable for SPA navigation.

#### Architecture

```
┌──────────────────────────────────────────────────┐
│ <html>                                           │  Stable outer shell
│   <head />                                       │  (never changes)
│   <body data-slug="...">                         │
│     <div id="quartz-root" data-frame="...">      │
│       <Body>                                     │
│         ┌──────────────────────────────────┐     │
│         │     PageFrame.render()            │     │  ← Frame controls this
│         │  (sidebars, header, content, etc.)│     │
│         └──────────────────────────────────┘     │
│       </Body>                                    │
│     </div>                                       │
│   </body>                                        │
│ </html>                                          │
└──────────────────────────────────────────────────┘
```

#### Interfaces

```typescript
interface PageFrame {
  name: string                                     // e.g. "default", "full-width", "minimal"
  render: (props: PageFrameProps) => JSX.Element   // Renders the inner page structure
  css?: string                                     // Optional frame-specific CSS
}

interface PageFrameProps {
  componentData: QuartzComponentProps   // Shared props for all components
  head: QuartzComponent                 // Head component (for completeness)
  header: QuartzComponent[]             // Header slot
  beforeBody: QuartzComponent[]         // Before-body slot
  pageBody: QuartzComponent             // Content component (from PageType)
  afterBody: QuartzComponent[]          // After-body slot
  left: QuartzComponent[]               // Left sidebar components
  right: QuartzComponent[]              // Right sidebar components
  footer: QuartzComponent               // Footer component
}
```

#### Built-in Frames

| Frame | Name | Description | Used By |
| --- | --- | --- | --- |
| **DefaultFrame** | `"default"` | Original three-column layout: left sidebar + center (header, beforeBody, content, afterBody) + right sidebar + footer | All page types by default |
| **FullWidthFrame** | `"full-width"` | No sidebars. Single center column spanning full width with header, content, afterBody, and footer | `canvas-page` |
| **MinimalFrame** | `"minimal"` | No sidebars, no header/beforeBody chrome. Only content + footer | `404` page |

#### Frame Resolution Priority

Frames are resolved in the `PageTypeDispatcher.resolveLayout()` function with this priority chain:

```
1. YAML config override:  layout.byPageType.<name>.template
2. Page type declaration: pageType.frame (in plugin source)
3. Default:               "default"
```

This means site authors can override any page type's frame via configuration without touching plugin code:

```yaml
layout:
  byPageType:
    canvas:
      template: minimal   # Override canvas pages to use minimal frame
```

#### Creating Custom Frames

New frames are added in `quartz/components/frames/`:

1. Create a new `.tsx` file implementing the `PageFrame` interface
2. Register it in `quartz/components/frames/index.ts` → `builtinFrames` registry
3. Reference it by name in page type plugins or YAML config

```typescript
// quartz/components/frames/PresentationFrame.tsx
import { PageFrame, PageFrameProps } from "./types"

export const PresentationFrame: PageFrame = {
  name: "presentation",
  render({ componentData, pageBody: Content, footer: Footer }: PageFrameProps) {
    return (
      <>
        <div class="center presentation">
          <Content {...componentData} />
        </div>
        <Footer {...componentData} />
      </>
    )
  },
}
```

#### CSS Targeting

The `data-frame` attribute on `#quartz-root` enables frame-specific CSS without class conflicts:

```scss
// Full-width: single column, no sidebar grid areas
.page[data-frame="full-width"] > #quartz-body {
  grid-template-columns: 1fr;
  grid-template-areas: "center";
}

// Minimal: content-only grid
.page[data-frame="minimal"] > #quartz-body {
  grid-template-columns: 1fr;
  grid-template-areas: "center";
}
```

#### SPA Safety

Frame changes between pages are SPA-safe because:

1. The SPA router (`micromorph`) morphs `document.body` — it does not hardcode selectors like `.center` or `.sidebar`
2. The `data-frame` attribute updates naturally during the morph
3. CSS grid overrides apply immediately based on the new `data-frame` value
4. `collectComponents()` collects components from ALL slots regardless of frame, ensuring all component resources (CSS/JS) are available globally

#### Source Files

| File | Purpose |
| --- | --- |
| `quartz/components/frames/types.ts` | `PageFrame` and `PageFrameProps` interfaces |
| `quartz/components/frames/DefaultFrame.tsx` | Default three-column layout |
| `quartz/components/frames/FullWidthFrame.tsx` | Full-width single-column layout |
| `quartz/components/frames/MinimalFrame.tsx` | Minimal content-only layout |
| `quartz/components/frames/index.ts` | Frame registry and `resolveFrame()` |

### Transclusion

Transclusion (`![[page]]` syntax) is resolved at render time. The `renderTranscludes()` function walks the hast tree looking for `<blockquote class="transclude">` nodes and replaces them with the target page's content.

**Resolution strategy:**

1. Look up target slug directly in `allFiles`
2. If not found, strip the file extension and try again (handles virtual page slugs like `CanvasPage.canvas` → `CanvasPage`)
3. Support block references (`#^blockId`) and header references (`#heading`)
4. Detect and prevent circular transclusions

**Virtual page transclusion:** The PageTypeDispatcher populates `htmlAst` on virtual pages by rendering their Body component via `preact-render-to-string` and parsing the result with `hast-util-from-html`. This allows wikilinks like `![[navigation.base]]` to inline the virtual page's rendered content.

---

## Configuration

### quartz.config.yaml

The single configuration file has three top-level sections:

```yaml
# Site-wide settings
configuration:
  pageTitle: "My Site"
  pageTitleSuffix: ""
  enableSPA: true
  enablePopovers: true
  analytics:
    provider: plausible
  locale: en-US
  baseUrl: example.com
  ignorePatterns:
    - private
    - templates
    - .obsidian
  defaultDateType: modified
  theme:
    fontOrigin: googleFonts
    cdnCaching: true
    typography:
      header: Schibsted Grotesk
      body: Source Sans Pro
      code: IBM Plex Mono
    colors:
      lightMode:
        light: "#faf8f8"
        lightgray: "#e5e5e5"
        gray: "#b8b8b8"
        darkgray: "#4e4e4e"
        dark: "#2b2b2b"
        secondary: "#284b63"
        tertiary: "#84a59d"
        highlight: "rgba(143, 159, 169, 0.15)"
        textHighlight: "#fff23688"
      darkMode:
        light: "#161618"
        lightgray: "#393639"
        gray: "#646464"
        darkgray: "#d4d4d4"
        dark: "#ebebec"
        secondary: "#7b97aa"
        tertiary: "#84a59d"
        highlight: "rgba(143, 159, 169, 0.15)"
        textHighlight: "#b3aa0288"

# Plugin declarations (order matters for transformers)
plugins:
  - source: github:quartz-community/obsidian-flavored-markdown
    enabled: true
    options:
      enableInHtmlEmbed: false
      enableCheckbox: true
    order: 30

  - source: github:quartz-community/explorer
    enabled: true
    layout:
      position: left
      priority: 50

  - source: github:quartz-community/search
    enabled: true
    layout:
      position: left
      priority: 20
      group: toolbar
      groupOptions:
        grow: true

# Global layout configuration
layout:
  groups:
    toolbar:
      priority: 15
      direction: row
      gap: 0.5rem
  byPageType:
    "404":
      positions:
        beforeBody: []
        left: []
        right: []
    folder:
      exclude:
        - reader-mode
      positions:
        right: []
```

**Plugin entry fields:**

| Field     | Type                      | Required | Description                                              |
| --------- | ------------------------- | -------- | -------------------------------------------------------- |
| `source`  | `string`                  | Yes      | Git source (e.g., `github:quartz-community/plugin-name`) |
| `enabled` | `boolean`                 | Yes      | Whether the plugin is active                             |
| `options` | `object`                  | No       | Plugin-specific options (merged with `defaultOptions`)   |
| `order`   | `number`                  | No       | Execution order override (default: 50)                   |
| `layout`  | `PluginLayoutDeclaration` | No       | Layout placement for component plugins                   |

**Layout declaration fields:**

| Field          | Type                                               | Required | Description                     |
| -------------- | -------------------------------------------------- | -------- | ------------------------------- |
| `position`     | `"left" \| "right" \| "beforeBody" \| "afterBody"` | Yes      | Where to place the component    |
| `priority`     | `number`                                           | Yes      | Sort order (lower = first)      |
| `display`      | `"all" \| "mobile-only" \| "desktop-only"`         | No       | Viewport visibility             |
| `condition`    | `string`                                           | No       | Conditional rendering predicate |
| `group`        | `string`                                           | No       | Flex group name                 |
| `groupOptions` | `object`                                           | No       | Per-component flex options      |

### TypeScript Override

For advanced use cases, `quartz.ts` can override the YAML-loaded config:

```typescript
import * as ExternalPlugin from "./.quartz/plugins"

// Override plugin options programmatically
ExternalPlugin.Explorer({
  title: "Explorer",
  folderDefaultState: "collapsed",
  folderClickBehavior: "link",
  useSavedState: true,
})
```

The config loader first reads `quartz.config.yaml`, then applies any overrides from `quartz.ts`.

---

## Plugin Catalog

All 40 community plugins are hosted under the [`quartz-community`](https://github.com/quartz-community) GitHub organization.

### Transformers

Transform content during the markdown parsing pipeline.

| Plugin                         | Description                                                                     | Repository                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **note-properties**            | Extracts and renders YAML/TOML frontmatter properties                           | [quartz-community/note-properties](https://github.com/quartz-community/note-properties)                       |
| **created-modified-date**      | Extracts creation/modification dates from frontmatter, git, or filesystem       | [quartz-community/created-modified-date](https://github.com/quartz-community/created-modified-date)           |
| **syntax-highlighting**        | Syntax highlighting for code blocks (Shiki-based, light/dark themes)            | [quartz-community/syntax-highlighting](https://github.com/quartz-community/syntax-highlighting)               |
| **obsidian-flavored-markdown** | Obsidian-specific markdown extensions (callouts, wikilinks, embeds, checkboxes) | [quartz-community/obsidian-flavored-markdown](https://github.com/quartz-community/obsidian-flavored-markdown) |
| **github-flavored-markdown**   | GFM extensions (tables, strikethrough, autolinks, task lists)                   | [quartz-community/github-flavored-markdown](https://github.com/quartz-community/github-flavored-markdown)     |
| **table-of-contents**          | Generates table of contents from headings                                       | [quartz-community/table-of-contents](https://github.com/quartz-community/table-of-contents)                   |
| **crawl-links**                | Resolves and rewrites internal links (wikilinks, relative paths)                | [quartz-community/crawl-links](https://github.com/quartz-community/crawl-links)                               |
| **description**                | Extracts or generates page descriptions for meta tags and previews              | [quartz-community/description](https://github.com/quartz-community/description)                               |
| **latex**                      | LaTeX math rendering (KaTeX or MathJax)                                         | [quartz-community/latex](https://github.com/quartz-community/latex)                                           |
| **citations**                  | Academic citation support (BibTeX)                                              | [quartz-community/citations](https://github.com/quartz-community/citations)                                   |
| **hard-line-breaks**           | Treats single newlines as `<br>` tags                                           | [quartz-community/hard-line-breaks](https://github.com/quartz-community/hard-line-breaks)                     |
| **ox-hugo**                    | Compatibility layer for ox-hugo exported markdown                               | [quartz-community/ox-hugo](https://github.com/quartz-community/ox-hugo)                                       |
| **roam**                       | Compatibility layer for Roam Research exports                                   | [quartz-community/roam](https://github.com/quartz-community/roam)                                             |

### Filters

Decide which content files to include in the build output.

| Plugin               | Description                                            | Repository                                                                                |
| -------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **remove-draft**     | Excludes pages with `draft: true` frontmatter          | [quartz-community/remove-draft](https://github.com/quartz-community/remove-draft)         |
| **explicit-publish** | Requires `publish: true` frontmatter to include a page | [quartz-community/explicit-publish](https://github.com/quartz-community/explicit-publish) |

### Emitters

Produce output files (HTML, JSON, XML, images, etc.).

| Plugin              | Description                                                                   | Repository                                                                              |
| ------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **alias-redirects** | Generates redirect pages for frontmatter aliases                              | [quartz-community/alias-redirects](https://github.com/quartz-community/alias-redirects) |
| **content-index**   | Generates sitemap.xml, RSS feed, and contentIndex.json (search/explorer data) | [quartz-community/content-index](https://github.com/quartz-community/content-index)     |
| **favicon**         | Generates favicon files                                                       | [quartz-community/favicon](https://github.com/quartz-community/favicon)                 |
| **og-image**        | Generates Open Graph social preview images                                    | [quartz-community/og-image](https://github.com/quartz-community/og-image)               |
| **cname**           | Generates CNAME file for custom domain hosting                                | [quartz-community/cname](https://github.com/quartz-community/cname)                     |

### PageType Plugins

Define how different types of pages are matched, generated, and rendered. All PageType plugins are dual-category (`pageType` + `component`).

| Plugin           | Match Strategy                           | Generates Virtual Pages?         | Description                                                                            | Repository                                                                        |
| ---------------- | ---------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **content-page** | `match.all()` (lowest priority fallback) | No                               | Default page type for regular markdown content                                         | [quartz-community/content-page](https://github.com/quartz-community/content-page) |
| **folder-page**  | Folder index pages                       | Yes (one per folder)             | Renders folder listing pages with file trees                                           | [quartz-community/folder-page](https://github.com/quartz-community/folder-page)   |
| **tag-page**     | Tag index pages                          | Yes (one per tag + tag index)    | Renders tag listing pages                                                              | [quartz-community/tag-page](https://github.com/quartz-community/tag-page)         |
| **canvas-page**  | `match.ext(".canvas")`                   | No (reads `.canvas` files)       | Interactive JSON Canvas visualization (pan/zoom)                                       | [quartz-community/canvas-page](https://github.com/quartz-community/canvas-page)   |
| **bases-page**   | `match.ext(".base")`                     | Yes (view-based aggregate pages) | Extensible view-based pages from `.base` files (table, list, board, gallery, calendar) | [quartz-community/bases-page](https://github.com/quartz-community/bases-page)     |

### Component Plugins

UI components placed via the layout system. These are pure `component` category plugins (no processing hooks).

| Plugin            | Default Position | Description                                               | Repository                                                                          |
| ----------------- | ---------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **page-title**    | `left`           | Site title with link to home page                         | [quartz-community/page-title](https://github.com/quartz-community/page-title)       |
| **search**        | `left`           | Full-text search with keyboard navigation                 | [quartz-community/search](https://github.com/quartz-community/search)               |
| **darkmode**      | `left`           | Light/dark theme toggle                                   | [quartz-community/darkmode](https://github.com/quartz-community/darkmode)           |
| **reader-mode**   | `left`           | Reader mode toggle (hides sidebars)                       | [quartz-community/reader-mode](https://github.com/quartz-community/reader-mode)     |
| **explorer**      | `left`           | Interactive file tree navigation with collapsible folders | [quartz-community/explorer](https://github.com/quartz-community/explorer)           |
| **spacer**        | `left`           | Visual spacer element (often used as `mobile-only`)       | [quartz-community/spacer](https://github.com/quartz-community/spacer)               |
| **article-title** | `beforeBody`     | Page title (h1)                                           | [quartz-community/article-title](https://github.com/quartz-community/article-title) |
| **breadcrumbs**   | `beforeBody`     | Breadcrumb navigation trail                               | [quartz-community/breadcrumbs](https://github.com/quartz-community/breadcrumbs)     |
| **content-meta**  | `beforeBody`     | Creation/modification dates and reading time              | [quartz-community/content-meta](https://github.com/quartz-community/content-meta)   |
| **tag-list**      | `beforeBody`     | Displays page tags as clickable links                     | [quartz-community/tag-list](https://github.com/quartz-community/tag-list)           |
| **graph**         | `right`          | Interactive link graph visualization (D3-based)           | [quartz-community/graph](https://github.com/quartz-community/graph)                 |
| **backlinks**     | `right`          | Lists pages that link to the current page                 | [quartz-community/backlinks](https://github.com/quartz-community/backlinks)         |
| **comments**      | `afterBody`      | Comment system integration (Giscus, Utterances, etc.)     | [quartz-community/comments](https://github.com/quartz-community/comments)           |
| **recent-notes**  | —                | Lists recently modified notes                             | [quartz-community/recent-notes](https://github.com/quartz-community/recent-notes)   |
| **footer**        | _(structural)_   | Page footer with configurable links                       | [quartz-community/footer](https://github.com/quartz-community/footer)               |

### Dual-Category Plugins

Some plugins span multiple categories:

| Plugin              | Categories                  | Notes                                                          |
| ------------------- | --------------------------- | -------------------------------------------------------------- |
| **note-properties** | `transformer` + `component` | Transforms frontmatter AND renders a properties view component |
| **content-page**    | `pageType` + `component`    | Matches content pages AND provides the Body component          |
| **folder-page**     | `pageType` + `component`    | Matches folder pages AND provides the FolderContent component  |
| **tag-page**        | `pageType` + `component`    | Matches tag pages AND provides the TagContent component        |
| **canvas-page**     | `pageType` + `component`    | Matches `.canvas` files AND provides the CanvasBody component  |
| **bases-page**      | `pageType` + `component`    | Matches `.base` files AND provides the BasesBody component     |

---

## Key Source Files Reference

| File                                       | Purpose                                                       |
| ------------------------------------------ | ------------------------------------------------------------- |
| `quartz.config.yaml`                       | All configuration (site settings, plugins, layout)            |
| `quartz.ts`                                | Entry point — loads config from config-loader                 |
| `quartz/build.ts`                          | Build orchestration (glob, parse, filter, emit, watch)        |
| `quartz/cfg.ts`                            | `GlobalConfiguration`, `FullPageLayout`, `QuartzConfig` types |
| `quartz/plugins/types.ts`                  | All plugin type interfaces                                    |
| `quartz/plugins/vfile.ts`                  | `ProcessedContent`, `QuartzPluginData`                        |
| `quartz/processors/parse.ts`               | Markdown parsing with transformer hooks                       |
| `quartz/processors/filter.ts`              | Content filtering                                             |
| `quartz/processors/emit.ts`                | Two-phase emit orchestration                                  |
| `quartz/plugins/pageTypes/dispatcher.ts`   | PageTypeDispatcher (3-phase emit)                             |
| `quartz/plugins/pageTypes/matchers.ts`     | Composable page matchers                                      |
| `quartz/plugins/loader/config-loader.ts`   | YAML config loading, plugin instantiation, layout building    |
| `quartz/plugins/loader/types.ts`           | `PluginManifest`, layout types, config types                  |
| `quartz/plugins/loader/gitLoader.ts`       | Git clone/update for plugins                                  |
| `quartz/plugins/loader/componentLoader.ts` | Component loading and registry population                     |
| `quartz/plugins/loader/conditions.ts`      | Built-in and custom condition predicates                      |
| `quartz/components/types.ts`               | `QuartzComponent`, `QuartzComponentProps`                     |
| `quartz/components/registry.ts`            | `ComponentRegistry` singleton                                 |
| `quartz/components/renderPage.tsx`         | Page rendering with frame delegation and transclusion         |
| `quartz/components/frames/`                | PageFrame system (types, registry, built-in frames)           |
| `quartz/components/Flex.tsx`               | Flex layout container for grouped components                  |
| `quartz/components/MobileOnly.tsx`         | Mobile display wrapper                                        |
