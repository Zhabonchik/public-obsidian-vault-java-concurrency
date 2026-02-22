# Quartz v5 Plugin Management & Update System

## Design Principle

**Separate what the user configures from what upstream ships.** User customization lives in files that upstream never touches. This makes both plugin management and framework updates conflict-free by design.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Architecture Overview](#architecture-overview)
- [File Ownership Model](#file-ownership-model)
- [quartz.config.yaml — The Source of Truth](#quartzconfigyaml--the-source-of-truth)
- [Plugin Manifest](#plugin-manifest)
- [Thin Template Files](#thin-template-files)
- [Plugin Ordering & Dependencies](#plugin-ordering--dependencies)
- [Layout System](#layout-system)
- [JSON Schema](#json-schema)
- [CLI Commands](#cli-commands)
- [Quartz Update Mechanism](#quartz-update-mechanism)
- [Quartz Syncer Integration](#quartz-syncer-integration)
- [Migration Path](#migration-path)
- [Implementation Plan](#implementation-plan)

---

## Problem Statement

### Current Pain Points

Users must manually edit multiple files to use a plugin:

1. **`quartz.config.ts` → `externalPlugins` array**: List of `"github:org/repo"` strings — declares _what_ to install
2. **`quartz.config.ts` → `plugins.transformers/filters/emitters/pageTypes` arrays**: Plugin factory calls with options — declares _how_ to use plugins
3. **`quartz.layout.ts`**: Layout configuration for component-providing plugins (Explorer, Graph, Search, etc.)
4. **`quartz.lock.json`**: Tracks installed versions/commits (managed by CLI)

Additionally:

- **No auto-enable**: `npx quartz plugin add` installs but the user must manually edit TypeScript files to activate.
- **No dependencies**: Plugins cannot declare that they need other plugins.
- **No ordering**: Plugin execution order is determined by manual array position.
- **Update = apply**: No way to check for available updates without also installing them.
- **TypeScript config**: `quartz.config.ts` and `quartz.layout.ts` are not safely machine-editable by external tools (Quartz Syncer).
- **Merge conflicts on update**: `npx quartz update` pulls upstream via git. Since `quartz.config.ts` and `quartz.layout.ts` are the primary files users edit, merge conflicts are frequent and frustrating.

---

## Architecture Overview

Introduce a machine-readable **`quartz.config.yaml`** as the single source of truth for all user configuration. The existing TypeScript files become thin, upstream-owned templates that read from this YAML file.

```
quartz-site/
├── quartz/                          # Upstream framework code
├── quartz.config.ts                 # Upstream template — reads from YAML
├── quartz.layout.ts                 # Upstream template — reads from YAML
├── quartz.config.default.yaml       # Upstream defaults (reference/seed file)
├── quartz.config.yaml               # USER-OWNED — all user configuration
├── quartz.lock.json                 # CLI-managed — installed plugin versions
├── .quartz/plugins/                 # CLI-managed — git clones of plugins
├── content/                         # User content
└── package.json
```

---

## File Ownership Model

| File                         | Owner    | Tracked by upstream?  | User edits?               | Updated by `npx quartz update`? |
| ---------------------------- | -------- | --------------------- | ------------------------- | ------------------------------- |
| `quartz/`                    | Upstream | Yes                   | No (power users only)     | Yes                             |
| `quartz.config.ts`           | Upstream | Yes                   | **No** — thin template    | Yes                             |
| `quartz.layout.ts`           | Upstream | Yes                   | **No** — thin template    | Yes                             |
| `quartz.config.default.yaml` | Upstream | Yes                   | No — reference only       | Yes                             |
| `quartz.config.yaml`         | **User** | No (user's fork only) | **Yes** — source of truth | **Never**                       |
| `quartz.lock.json`           | **CLI**  | Yes (user's fork)     | No                        | No                              |
| `.quartz/plugins/`           | **CLI**  | No (`.gitignore`d)    | No                        | No                              |
| `content/`                   | **User** | Yes (user's fork)     | Yes                       | No                              |

The key insight: **upstream never ships or modifies `quartz.config.yaml`**. It ships `quartz.config.default.yaml` as a seed/reference. On `npx quartz create`, the default is copied to `quartz.config.yaml`. On `npx quartz update`, only framework code and the default file are updated — the user's config is untouched.

This is analogous to the `.env.example` / `.env` pattern.

---

## quartz.config.yaml — The Source of Truth

This file contains all user configuration: site settings, plugin declarations, plugin options, layout positions, and ordering.

```yaml
# yaml-language-server: $schema=./quartz/plugins/quartz-plugins.schema.json

configuration:
  pageTitle: My Quartz Site
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

plugins:
  - source: github:quartz-community/created-modified-date
    enabled: true
    options:
      priority:
        - frontmatter
        - git
        - filesystem
    order: 10

  - source: github:quartz-community/syntax-highlighting
    enabled: true
    options:
      theme:
        light: github-light
        dark: github-dark
      keepBackground: false
    order: 20

  - source: github:quartz-community/obsidian-flavored-markdown
    enabled: true
    options:
      enableInHtmlEmbed: false
      enableCheckbox: true
    order: 30

  - source: github:quartz-community/github-flavored-markdown
    enabled: true
    order: 40

  - source: github:quartz-community/table-of-contents
    enabled: true
    order: 50

  - source: github:quartz-community/crawl-links
    enabled: true
    options:
      markdownLinkResolution: shortest
    order: 60

  - source: github:quartz-community/description
    enabled: true
    order: 70

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

  - source: github:quartz-community/canvas-page
    enabled: true

  - source: github:quartz-community/content-page
    enabled: true

  - source: github:quartz-community/folder-page
    enabled: true

  - source: github:quartz-community/tag-page
    enabled: true

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

  - source: github:quartz-community/search
    enabled: true
    layout:
      position: left
      priority: 20
      group: toolbar
      groupOptions:
        grow: true

  - source: github:quartz-community/backlinks
    enabled: true
    layout:
      position: right
      priority: 30

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

  - source: github:quartz-community/darkmode
    enabled: true
    layout:
      position: left
      priority: 30
      group: toolbar

  - source: github:quartz-community/reader-mode
    enabled: true
    layout:
      position: left
      priority: 35
      group: toolbar

  - source: github:quartz-community/spacer
    enabled: true
    layout:
      position: left
      priority: 15
      display: mobile-only

  - source: github:quartz-community/breadcrumbs
    enabled: true
    layout:
      position: beforeBody
      priority: 5
      condition: not-index

  - source: github:quartz-community/comments
    enabled: false
    options:
      provider: giscus
      options: {}
    layout:
      position: afterBody
      priority: 10

  - source: github:quartz-community/footer
    enabled: true
    options:
      links:
        GitHub: https://github.com/jackyzha0/quartz
        Discord Community: https://discord.gg/cRFFHYye7t

layout:
  groups:
    toolbar:
      direction: row
      gap: "0.5rem"
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
    canvas: {}
```

### Plugin Entry Fields

| Field     | Required | Description                                                                                                                                                           |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`  | Yes      | Plugin source identifier (e.g., `"github:quartz-community/explorer"`)                                                                                                 |
| `enabled` | Yes      | Whether the plugin is active                                                                                                                                          |
| `options` | No       | Plugin-specific configuration (object, validated against plugin's `configSchema`)                                                                                     |
| `order`   | No       | Numeric execution order (lower = runs first). Primarily relevant for transformers. Defaults to the plugin's `defaultOrder` from its manifest, or `50` if unspecified. |
| `layout`  | No       | Layout configuration for component-providing plugins (see [Layout System](#layout-system))                                                                            |

---

## Plugin Manifest

Each plugin declares metadata in its `package.json` under a `quartz` field, or in a dedicated `quartz-plugin.json` file at the plugin root.

### Standard Plugin Manifest

```json
{
  "quartz": {
    "name": "obsidian-flavored-markdown",
    "displayName": "Obsidian Flavored Markdown",
    "category": "transformer",
    "version": "1.0.0",
    "quartzVersion": ">=5.0.0",
    "dependencies": [],
    "defaultOrder": 30,
    "defaultEnabled": true,
    "defaultOptions": {
      "enableInHtmlEmbed": false,
      "enableCheckbox": true
    },
    "configSchema": {
      "type": "object",
      "properties": {
        "enableInHtmlEmbed": {
          "type": "boolean",
          "description": "Parse Obsidian-flavored markdown inside HTML embed tags",
          "default": false
        },
        "enableCheckbox": {
          "type": "boolean",
          "description": "Enable interactive checkboxes with custom task characters",
          "default": true
        }
      }
    }
  }
}
```

### Component-Providing Plugin Manifest

```json
{
  "quartz": {
    "name": "explorer",
    "displayName": "Explorer",
    "category": "emitter",
    "version": "1.0.0",
    "quartzVersion": ">=5.0.0",
    "dependencies": [],
    "defaultEnabled": true,
    "defaultOptions": {},
    "components": {
      "Explorer": {
        "displayName": "Explorer",
        "description": "File tree navigator sidebar",
        "defaultPosition": "left",
        "defaultPriority": 50
      }
    },
    "configSchema": {
      "type": "object",
      "properties": {}
    }
  }
}
```

### Manifest Fields

| Field            | Required | Description                                                                            |
| ---------------- | -------- | -------------------------------------------------------------------------------------- |
| `name`           | Yes      | Unique plugin identifier                                                               |
| `displayName`    | Yes      | Human-readable name                                                                    |
| `category`       | Yes      | Plugin type: `"transformer"`, `"filter"`, `"emitter"`, or `"pageType"`                 |
| `version`        | Yes      | Semver version string                                                                  |
| `quartzVersion`  | No       | Minimum compatible Quartz version (semver range)                                       |
| `dependencies`   | No       | Array of plugin sources this plugin requires                                           |
| `defaultOrder`   | No       | Default numeric execution order (0-100 convention). Defaults to `50`.                  |
| `defaultEnabled` | No       | Whether the plugin is enabled by default on install. Defaults to `true`.               |
| `defaultOptions` | No       | Default options applied when no user options are specified                             |
| `configSchema`   | No       | JSON Schema for the plugin's `options` object. Used for validation and TUI generation. |
| `components`     | No       | Components provided by this plugin, with layout defaults                               |

---

## Thin Template Files

### quartz.config.ts

```typescript
import { loadQuartzConfig } from "./quartz/plugins/loader/config-loader"

// Configuration and plugins are loaded from quartz.config.yaml.
// Users should edit quartz.config.yaml instead of this file.
export default await loadQuartzConfig()
```

### quartz.layout.ts

```typescript
import { loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

// Layout is assembled from plugin declarations in quartz.config.yaml.
// Users should edit quartz.config.yaml instead of this file.
export const layout = await loadQuartzLayout()
```

### What `loadQuartzConfig()` Does

1. Reads `quartz.config.yaml` (falls back to `quartz.plugins.json` for backward compatibility)
2. Resolves all plugin sources (git clone if not already installed)
3. Reads each plugin's manifest for category, dependencies, default options
4. Merges user options over plugin defaults
5. Validates dependencies and ordering (see [Plugin Ordering & Dependencies](#plugin-ordering--dependencies))
6. Instantiates plugin factories with resolved options
7. Assembles the `QuartzConfig` object
8. Returns the fully resolved config

### What `loadQuartzLayout()` Does

1. Reads `quartz.config.yaml` (falls back to `quartz.plugins.json` for backward compatibility)
2. Finds all enabled plugins with `layout` declarations
3. Groups components by `position` (`left`, `right`, `beforeBody`, `afterBody`)
4. Sorts within each position by `priority`
5. Applies display modifiers (`display`, `condition`)
6. Resolves `group` references into Flex wrappers
7. Applies `byPageType` overrides
8. Assembles the `FullPageLayout` object
9. Falls back to upstream defaults for structural positions (`head`, `header`, `footer`)

---

## Plugin Ordering & Dependencies

### Numeric Order

Plugins within each category are sorted by their `order` value (lower = runs first). The convention is 0-100, with the default being `50`.

```
order: 10  →  CreatedModifiedDate  (runs first among transformers)
order: 20  →  SyntaxHighlighting
order: 30  →  ObsidianFlavoredMarkdown
order: 40  →  GitHubFlavoredMarkdown
order: 50  →  TableOfContents        (default order)
order: 60  →  CrawlLinks
order: 70  →  Description
order: 80  →  Latex                  (runs last among transformers)
```

Order values only affect execution within the same plugin category (transformers sort independently from filters, etc.).

### Dependency Declaration

Plugins declare dependencies in their manifest:

```json
{
  "quartz": {
    "dependencies": ["github:quartz-community/crawl-links"]
  }
}
```

### Dependency Validation

At config load time, the resolver performs the following checks:

1. **Missing dependency**: If plugin A depends on plugin B, but B is not installed → **error** with message: `Plugin "A" requires "B". Run: npx quartz plugin add B`
2. **Disabled dependency**: If plugin A depends on plugin B, but B has `"enabled": false` → **warning**: `Plugin "A" depends on "B" which is disabled. "A" may not function correctly.`
3. **Order violation**: If plugin A depends on plugin B, but A has a _lower_ order than B (meaning A would run before its dependency) → **error**: `Plugin "A" (order: 20) depends on "B" (order: 50), but "A" is configured to run first. Either increase "A"'s order above 50 or decrease "B"'s order below 20.`
4. **Circular dependency**: If A depends on B and B depends on A → **error**: `Circular dependency detected: A → B → A`

These checks run at build time. The CLI also validates after `plugin add` / `plugin config` operations and reports issues immediately.

---

## Layout System

### Position-Based Component Placement

Each component-providing plugin can declare a `layout` field in `quartz.config.yaml`:

```yaml
- source: github:quartz-community/explorer
  enabled: true
  layout:
    position: left
    priority: 50
```

Available positions map to the `FullPageLayout` structure:

| Position     | Description            |
| ------------ | ---------------------- |
| `left`       | Left sidebar           |
| `right`      | Right sidebar          |
| `beforeBody` | Above the main content |
| `afterBody`  | Below the main content |

The structural positions `head`, `header` (page-level header), and `footer` are handled by specific plugins (Head is built-in, Footer is a plugin with a dedicated role) and don't use the generic position system.

### Display Modifiers

Components can be restricted to specific viewport sizes:

```yaml
layout:
  position: left
  priority: 15
  display: mobile-only
```

| Value             | Effect                                                |
| ----------------- | ----------------------------------------------------- |
| `"all"` (default) | Shown on all viewports                                |
| `"mobile-only"`   | Only shown on mobile (adds `mobile-only` CSS class)   |
| `"desktop-only"`  | Only shown on desktop (adds `desktop-only` CSS class) |

At build time, the layout loader wraps components with `display` modifiers using the existing `MobileOnly` / `DesktopOnly` higher-order components.

### Conditional Rendering

Components can declare a condition for when they should render:

```yaml
- source: github:quartz-community/breadcrumbs
  layout:
    position: beforeBody
    priority: 5
    condition: not-index
```

Conditions are named presets that cover common use cases:

| Condition         | Behavior                                         |
| ----------------- | ------------------------------------------------ |
| `"not-index"`     | Hidden on the site index page                    |
| `"has-tags"`      | Only shown when the page has tags                |
| `"has-backlinks"` | Only shown when the page has backlinks           |
| `"has-toc"`       | Only shown when the page has a table of contents |

At build time, the layout loader wraps components with conditions using the existing `ConditionalRender` higher-order component with the appropriate predicate function.

Plugins can declare additional named conditions in their manifest. The condition registry is extensible.

### Component Grouping (Flex)

Multiple components can be grouped into a flex container using the `group` field:

```yaml
- source: github:quartz-community/search
  layout:
    position: left
    priority: 20
    group: toolbar
    groupOptions:
      grow: true
```

Groups are configured in the top-level `layout.groups` section:

```yaml
layout:
  groups:
    toolbar:
      direction: row
      gap: "0.5rem"
```

All components sharing the same `group` name within the same `position` are collected and wrapped in a `Flex` component. The `groupOptions` on each component control its flex behavior within the group (`grow`, `shrink`, `basis`, `order`, `align`).

### Per-Page-Type Overrides

The default layout applies to all page types. Overrides for specific page types are declared in `layout.byPageType`:

```yaml
layout:
  byPageType:
    folder:
      exclude:
        - reader-mode
        - table-of-contents
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

| Field       | Description                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| `exclude`   | Array of plugin names to hide for this page type                                |
| `positions` | Override specific positions. An empty array `[]` clears that position entirely. |

---

## JSON Schema

The JSON Schema (`quartz-plugins.schema.json`) is **standardized for the structure** of `quartz.config.yaml` while **leaving room for plugin-specific configuration**.

### Schema Design

The schema defines:

- The shape of a plugin entry (`source`, `enabled`, `options`, `order`, `layout`)
- The shape of `configuration` (site settings, theme, analytics)
- The shape of `layout` (groups, byPageType overrides)
- Valid values for enums (`position`, `display`, `condition` presets)

The `options` field on each plugin entry is typed as `"type": "object"` with no additional constraints at the schema level. Individual plugins define their own options schema via `configSchema` in their manifest. Validation tooling can merge the base schema with plugin-specific schemas for full validation.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["configuration", "plugins"],
  "properties": {
    "configuration": {
      "type": "object",
      "description": "Global site configuration",
      "required": ["pageTitle", "enableSPA", "locale", "theme"],
      "properties": {
        "pageTitle": { "type": "string" },
        "enableSPA": { "type": "boolean" },
        "locale": { "type": "string" },
        "theme": { "type": "object" }
      }
    },
    "plugins": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["source", "enabled"],
        "properties": {
          "source": { "type": "string" },
          "enabled": { "type": "boolean" },
          "options": { "type": "object" },
          "order": { "type": "number", "minimum": 0 },
          "layout": {
            "type": "object",
            "properties": {
              "position": { "enum": ["left", "right", "beforeBody", "afterBody"] },
              "priority": { "type": "number" },
              "display": { "enum": ["all", "mobile-only", "desktop-only"] },
              "condition": { "type": "string" },
              "group": { "type": "string" },
              "groupOptions": { "type": "object" }
            }
          }
        }
      }
    },
    "layout": {
      "type": "object",
      "properties": {
        "groups": { "type": "object" },
        "byPageType": { "type": "object" }
      }
    }
  }
}
```

This schema ships with Quartz (under `quartz/plugins/`). The YAML config file references the schema via a `# yaml-language-server: $schema=...` header comment, which provides editor autocompletion and validation when using a YAML language server (e.g., the Red Hat YAML extension in VS Code).

---

## CLI Commands

### Plugin Management

```
npx quartz plugin add <source>           Install plugin and add to quartz.config.yaml
npx quartz plugin remove <name>          Remove from quartz.config.yaml and uninstall
npx quartz plugin enable <name>          Set enabled: true in quartz.config.yaml
npx quartz plugin disable <name>         Set enabled: false in quartz.config.yaml
npx quartz plugin update [name]          Fetch latest and rebuild (specific or all)
npx quartz plugin check                  Check for available updates without applying
npx quartz plugin list                   Show all plugins with status and version info
npx quartz plugin config <name>          Show or edit plugin options
npx quartz plugin restore                Reinstall all plugins from quartz.lock.json
```

### Framework Management

```
npx quartz update                        Update Quartz framework from upstream
npx quartz migrate                       Convert old config to quartz.config.yaml (one-time)
npx quartz create                        Create new Quartz site (copies default YAML)
```

### `npx quartz plugin add` Flow

```
1. Parse source (e.g., "github:quartz-community/explorer")
2. Clone to .quartz/plugins/<name>/, run npm install + npm run build
3. Read plugin manifest → get category, defaultOptions, defaultOrder, dependencies, components
4. Check dependencies → if missing, prompt user and auto-install
5. Validate order against existing plugins and dependencies
6. Add entry to quartz.config.yaml:
   - source: as provided
   - enabled: manifest.defaultEnabled (default: true)
   - options: manifest.defaultOptions (default: {})
   - order: manifest.defaultOrder (default: 50, for transformers)
   - layout: from manifest.components defaults (if component-providing)
7. Update quartz.lock.json with commit hash + metadata
8. Print summary: "Installed <name> as <category>. Active on next build."
```

### `npx quartz plugin check` Flow

```
1. For each plugin in quartz.lock.json:
   a. git ls-remote to get latest commit on tracked branch
   b. Compare to locked commit hash
   c. If different → fetch commit message for display
2. Print table:

   Plugin                          Installed    Available    Status
   obsidian-flavored-markdown      abc1234      def5678      3 commits behind
   explorer                        —            —            up to date
   graph                           111aaaa      222bbbb      1 commit behind

3. Exit without changes
```

### `npx quartz plugin config` Flow

```
# Show current config
npx quartz plugin config obsidian-flavored-markdown
→ Prints current options from quartz.config.yaml

# Set a value
npx quartz plugin config obsidian-flavored-markdown --set enableCheckbox=true
→ Updates quartz.config.yaml, validates against configSchema
```

---

## Quartz Update Mechanism

### Current Problem

`npx quartz update` runs:

```bash
git pull --no-rebase --autostash -s recursive -X ours upstream v5
```

This causes:

- Merge conflicts in `quartz.config.ts` and `quartz.layout.ts` (the only files users typically edit)
- `-X ours` silently drops upstream improvements to those files
- Users unfamiliar with git resolution get stuck

### Solution: Conflict-Free by Design

With this architecture, `quartz.config.ts` and `quartz.layout.ts` are upstream-owned templates that users never edit. All user customization is in `quartz.config.yaml`, which upstream never ships or modifies.

### Updated `npx quartz update` Flow

```
1. Show current version
2. Stash content folder (existing behavior)
3. git fetch upstream
4. git merge upstream/v5 (no -X ours needed — no conflicts expected)
5. Restore content folder
6. npm install (update dependencies for new framework version)
7. npx quartz plugin restore (rebuild all plugins against new Quartz version)
8. Validate: check all plugin manifests' quartzVersion against new version
9. Report results:
   - "Updated Quartz from v5.1.0 to v5.2.0"
   - "All 34 plugins compatible" or "Warning: plugin X requires Quartz >=5.3.0"
```

Since the user's configuration lives in `quartz.config.yaml` (not tracked upstream) and the `.ts` files are thin templates (no user modifications), `git merge` applies cleanly.

### Edge Case: Power Users

Users who modify framework internals (files under `quartz/components/`, `quartz/styles/`, etc.) may still encounter merge conflicts. This is expected and acceptable — these users are sufficiently versed in development to resolve conflicts manually.

---

## Quartz Syncer Integration

With all user configuration in a single YAML file, Quartz Syncer (Obsidian plugin using isomorphic-git with LightningFS) can fully manage Quartz configuration:

| Operation                 | Implementation                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| **Read plugin list**      | Parse `quartz.config.yaml`                                                               |
| **Enable/disable plugin** | Toggle `enabled` field                                                                   |
| **Change plugin options** | Edit `options` object                                                                    |
| **Reorder plugins**       | Change `order` values                                                                    |
| **Rearrange layout**      | Change `layout.position` and `layout.priority`                                           |
| **Change site config**    | Edit `configuration` object (pageTitle, theme, etc.)                                     |
| **Validate options**      | Fetch plugin's `configSchema` from manifest                                              |
| **Commit + push**         | Existing isomorphic-git flow                                                             |
| **Add plugin**            | Append to `plugins` array, commit, push. Plugin install happens on next build or via CI. |

No TypeScript parsing. No AST manipulation. Plain YAML read/write → git commit → push.

This directly addresses Quartz Syncer Issue #35 ("Manage Quartz configuration from Obsidian").

### Plugin Installation from Quartz Syncer

When Quartz Syncer adds a plugin entry to `quartz.config.yaml`, the actual git clone and build happens on the next `npx quartz build` (or `npx quartz plugin restore`). The build process detects plugins declared in the config but not yet installed and installs them automatically.

Alternatively, if the user's Quartz site has CI (e.g., GitHub Actions), the CI pipeline handles `plugin restore` as part of the build.

---

## Migration Path

### For Existing Users

A `npx quartz migrate` command handles the one-time conversion:

1. Imports current `quartz.config.ts` at runtime (no AST parsing needed — just `import()`)
2. Reads `quartz.lock.json` for installed plugin metadata
3. Imports `quartz.layout.ts` and inspects the layout object
4. Generates `quartz.config.yaml` with:
   - All `configuration` fields from the current config
   - All plugins (built-in and external) with their current options
   - Layout positions inferred from the layout object
5. Replaces `quartz.config.ts` and `quartz.layout.ts` with thin templates
6. Prints migration summary

### For Plugin Authors

Plugins need to add a `quartz` field to their `package.json` or ship a `quartz-plugin.json`:

- `category` — already exists in current `PluginManifest`
- `dependencies` — **new field**
- `defaultOrder` — **new field**
- `defaultEnabled` — **new field**
- `defaultOptions` — **new field**
- `configSchema` — already exists (optional, now more important)
- `components` — already partially exists, extended with layout defaults

Plugins without the extended manifest fields still load with sensible defaults (`defaultOrder: 50`, `defaultEnabled: true`, no dependencies).

### Backward Compatibility

- A `quartz.config.ts` that doesn't use the thin template pattern continues to work (direct import, bypasses YAML)
- If `quartz.config.yaml` doesn't exist, `plugin-data.js` falls back to `quartz.plugins.json` for backward compatibility
- Plugins without the extended manifest fields still load normally
- The migration is opt-in via `npx quartz migrate`

---

## Implementation Plan

### Phase 1: Foundation

1. **Extended PluginManifest type** — Add `dependencies`, `defaultOrder`, `defaultEnabled`, `defaultOptions`, and `components` layout defaults to `PluginManifest` in `quartz/plugins/loader/types.ts`
2. **`quartz.config.yaml` type and loader** — Create `config-loader.ts` with `loadQuartzConfig()` and `loadQuartzLayout()` functions that read the YAML, resolve plugins, validate dependencies/ordering, and return the assembled config and layout objects
3. **JSON Schema** — Create `quartz-plugins.schema.json` with the standardized structure
4. **`quartz.config.default.yaml`** — Create the upstream default configuration file

### Phase 2: Layout Resolution

5. **Layout resolver** — Implement the logic that converts YAML layout declarations (position, priority, display, condition, group) into the `FullPageLayout` object, including Flex grouping, MobileOnly/DesktopOnly wrapping, and ConditionalRender wrapping
6. **Condition registry** — Implement the named condition preset system (`not-index`, `has-tags`, etc.)
7. **Spacer plugin** — Extract the current `Spacer` component into a minimal plugin

### Phase 3: CLI

8. **`npx quartz plugin add` refactor** — Update to write to `quartz.config.yaml` instead of just cloning + lockfile
9. **`npx quartz plugin remove/enable/disable/config`** — Implement YAML-editing CLI commands
10. **`npx quartz plugin check`** — Implement update checking without applying
11. **`npx quartz migrate`** — Implement the one-time migration command
12. **`npx quartz update` refactor** — Remove `-X ours`, add plugin compatibility validation
13. **`npx quartz create` update** — Copy `quartz.config.default.yaml` → `quartz.config.yaml` on new site creation

### Phase 4: Thin Templates

14. **`quartz.config.ts` template** — Replace with thin loader template
15. **`quartz.layout.ts` template** — Replace with thin loader template
16. **Build pipeline update** — Ensure `build.ts` works with the new config loading path

### Phase 5: Plugin Author Support

17. **Update existing plugin manifests** — Add `quartz` metadata to all `quartz-community/*` plugins
18. **Plugin authoring documentation** — Document the manifest format, config schema, and layout declarations
19. **User documentation** — Document `quartz.config.yaml`, CLI commands, and migration
