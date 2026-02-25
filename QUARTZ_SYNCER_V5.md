# Quartz Syncer v5 Integration Notes

Notes and decisions for implementing Quartz v5 plugin management support in Quartz Syncer (Obsidian plugin). This document captures the architectural changes that affect Syncer and the specific integration points.

---

## Table of Contents

- [Overview of Changes](#overview-of-changes)
- [File Ownership Model](#file-ownership-model)
- [quartz.config.yaml — The Syncer's Interface](#quartzconfigyaml--the-syncers-interface)
- [Operations Syncer Can Perform](#operations-syncer-can-perform)
- [Plugin Installation Lifecycle](#plugin-installation-lifecycle)
- [Schema Validation](#schema-validation)
- [Layout System](#layout-system)
- [Plugin Manifest (package.json quartz field)](#plugin-manifest-packagejson-quartz-field)
- [Migration Considerations](#migration-considerations)
- [Edge Cases and Gotchas](#edge-cases-and-gotchas)
- [Syncer Issue #35 Resolution](#syncer-issue-35-resolution)

---

## Overview of Changes

Quartz v5 moves all user configuration from TypeScript files (`quartz.config.ts`, `quartz.layout.ts`) into a single YAML file (`quartz.config.yaml`). This eliminates the need for AST parsing or TypeScript manipulation — Syncer can now manage the entire Quartz configuration through plain YAML read/write operations. In v5, these TypeScript files are consolidated into a single `quartz.ts` wrapper.

**Before (v4):**

- Configuration spread across `quartz.config.ts` (TypeScript) and `quartz.layout.ts` (TypeScript) in v4
- Syncer could not safely edit these files (no TS parser in isomorphic-git/LightningFS environment)
- Plugin management required manual file editing

**After (v5):**

- All user configuration in `quartz.config.yaml` (YAML)
  36: #JJ|- TypeScript files are upstream-owned thin templates (consolidated into `quartz.ts`) that read from the YAML config
- Syncer can fully manage configuration via YAML read/write → git commit → push

---

## File Ownership Model

| File                         | Owner    | Syncer Can Edit? | Notes                                                         |
| ---------------------------- | -------- | ---------------- | ------------------------------------------------------------- | ------ | --------------------------------------------- |
| `quartz.config.yaml`         | **User** | **Yes**          | The source of truth. Syncer's primary interface.              |
| `quartz.config.default.yaml` | Upstream | **No**           | Reference only. Seed file copied on `npx quartz create`.      |
| 47: #RS                      |          | `quartz.ts`      | Upstream                                                      | **No** | Thin template. Just imports from YAML loader. |
| `quartz.lock.json`           | CLI      | Read only        | Tracks installed plugin versions/commits. Useful for display. |
| `.quartz/plugins/`           | CLI      | **No**           | Git clones managed by CLI. `.gitignore`d.                     |
| `content/`                   | User     | **Yes**          | Existing Syncer behavior unchanged.                           |

**Key insight:** Syncer only needs to read/write `quartz.config.yaml`. Everything else is handled by the CLI on the build side.

---

## quartz.config.yaml — The Syncer's Interface

### Top-Level Structure

```yaml
# yaml-language-server: $schema=./quartz/plugins/quartz-plugins.schema.json
configuration:
  # GlobalConfiguration fields
  pageTitle: My Quartz Site
  enableSPA: true
  # ...

plugins:
  # Array of plugin entries
  - source: "github:quartz-community/explorer"
    enabled: true
    options: {}
    order: 50

layout:
  # Global layout overrides
  groups: {}
  byPageType: {}
```

### configuration Object

Maps directly to Quartz's `GlobalConfiguration` type. Fields Syncer should support editing:

| Field             | Type     | Description                              |
| ----------------- | -------- | ---------------------------------------- |
| `pageTitle`       | string   | Site title                               |
| `pageTitleSuffix` | string   | Appended to page titles in `<title>`     |
| `enableSPA`       | boolean  | Single-page app navigation               |
| `enablePopovers`  | boolean  | Link preview popovers                    |
| `analytics`       | object   | Analytics provider config                |
| `locale`          | string   | Locale string (e.g., `"en-US"`)          |
| `baseUrl`         | string   | Base URL for deployment                  |
| `ignorePatterns`  | string[] | Glob patterns to ignore                  |
| `defaultDateType` | string   | `"created"`, `"modified"`, `"published"` |
| `theme`           | object   | Colors, typography                       |

### plugins Array

Each entry:

```yaml
- source: "github:quartz-community/explorer"
  enabled: true
  options: {}
  order: 50
  layout:
    position: left
    priority: 50
    display: all
    condition: null
    group: null
    groupOptions: null
```

| Field     | Type    | Required | Description                                                |
| --------- | ------- | -------- | ---------------------------------------------------------- |
| `source`  | string  | Yes      | Plugin identifier (`github:org/repo` or npm package name)  |
| `enabled` | boolean | Yes      | Whether the plugin is active                               |
| `options` | object  | No       | Plugin-specific configuration (passed to factory function) |
| `order`   | number  | No       | Execution order within its category (lower = earlier)      |
| `layout`  | object  | No       | Only for component-providing plugins                       |

### layout Object (Global)

```yaml
layout:
  groups:
    toolbar:
      direction: row
      gap: "0.5rem"
  byPageType:
    folder:
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

---

## Operations Syncer Can Perform

### Read Operations

| Operation               | How                                                         |
| ----------------------- | ----------------------------------------------------------- |
| List all plugins        | Read `plugins` array                                        |
| Get plugin status       | Check `enabled` field                                       |
| Get plugin options      | Read `options` field                                        |
| Get site configuration  | Read `configuration` object                                 |
| Get layout arrangement  | Read `layout` fields on plugin entries + global `layout`    |
| Check installed version | Read `quartz.lock.json` for commit hashes                   |
| Get plugin metadata     | Read `.quartz/plugins/{name}/package.json` → `quartz` field |

### Write Operations

| Operation             | How                                                        |
| --------------------- | ---------------------------------------------------------- |
| Enable plugin         | Set `plugins[i].enabled = true`                            |
| Disable plugin        | Set `plugins[i].enabled = false`                           |
| Change plugin options | Update `plugins[i].options`                                |
| Reorder plugins       | Change `plugins[i].order` values                           |
| Rearrange layout      | Change `plugins[i].layout.position` and `.priority`        |
| Change site config    | Update fields in `configuration`                           |
| Add plugin            | Append new entry to `plugins` array with source + defaults |
| Remove plugin         | Remove entry from `plugins` array                          |

### Add Plugin Flow (Syncer-initiated)

1. Syncer appends a new plugin entry to `quartz.config.yaml`:
   ```yaml
   - source: "github:quartz-community/some-plugin"
     enabled: true
     options: {}
     order: 50
   ```
2. Syncer commits and pushes the change
3. On next `npx quartz build` (or CI), the build process detects the plugin is declared but not installed
4. Build automatically runs `npx quartz plugin restore` to install missing plugins
5. Alternatively, user runs `npx quartz plugin restore` manually

**Important:** Syncer does NOT need to handle git clone or npm install. It only edits the YAML config.

### Remove Plugin Flow (Syncer-initiated)

1. Syncer removes the plugin entry from `plugins` array
2. Syncer commits and pushes
3. On next build, the orphaned plugin clone in `.quartz/plugins/` is harmless (ignored)
4. User can run `npx quartz plugin remove <name>` to clean up the clone

---

## Schema Validation

The JSON Schema is at `quartz/plugins/quartz-plugins.schema.json`. Syncer can use this for:

1. **Client-side validation** before committing changes
2. **Autocomplete hints** for configuration fields
3. **Type checking** for plugin options

The `quartz.config.yaml` file references the schema via a YAML language server comment on the first line:

```yaml
# yaml-language-server: $schema=./quartz/plugins/quartz-plugins.schema.json
```

This provides IDE autocompletion and validation when using editors that support the YAML language server (VS Code with YAML extension, IntelliJ, etc.). Syncer should preserve this comment when writing the file.

### Validation Points

- `configuration` fields have defined types and constraints
- `plugins[].source` must be a non-empty string
- `plugins[].enabled` must be boolean
- `plugins[].order` must be a number
- `plugins[].layout.position` must be one of: `"head"`, `"header"`, `"beforeBody"`, `"left"`, `"right"`, `"afterBody"`, `"footer"`
- `plugins[].layout.display` must be one of: `"all"`, `"mobile"`, `"desktop"`

---

## Layout System

### Positions

Components can be placed in these layout positions:

| Position     | Description                |
| ------------ | -------------------------- |
| `head`       | HTML `<head>` metadata     |
| `header`     | Top header area            |
| `beforeBody` | Between header and content |
| `left`       | Left sidebar               |
| `right`      | Right sidebar              |
| `afterBody`  | Between content and footer |
| `footer`     | Bottom footer area         |

### Priority

Within a position, components are sorted by `priority` (ascending). Lower numbers appear first/higher.

### Display Modifiers

| Value       | Effect                     |
| ----------- | -------------------------- |
| `"all"`     | Show on all viewport sizes |
| `"mobile"`  | Show only on mobile        |
| `"desktop"` | Show only on desktop       |

### Conditions

Named presets that control when a component renders:

| Condition     | Effect                                          |
| ------------- | ----------------------------------------------- |
| `"not-index"` | Hide on the root index page                     |
| `"has-tags"`  | Only show when the page has tags                |
| `"has-toc"`   | Only show when the page has a table of contents |
| `"not-tag"`   | Hide on tag listing pages                       |

### Groups

Components can be grouped into flex containers:

```yaml
# Per-plugin layout entry
layout:
  group: toolbar
  groupOptions:
    grow: true
```

Global group definitions:

```yaml
layout:
  groups:
    toolbar:
      direction: row
      gap: "0.5rem"
```

### Per-Page-Type Overrides

The global `layout.byPageType` object can override layout for specific page types:
`content` — standard markdown content pages
`folder` — folder listing pages
`tag` — tag listing pages
`canvas` — Obsidian canvas pages
`bases` — Obsidian Bases database pages
`404` — not found page

Each can `exclude` specific plugins or override `positions` entirely.

---

## Plugin Manifest (package.json quartz field)

Each plugin's `package.json` contains a `quartz` field with metadata. Syncer can read this for display purposes (plugin names, descriptions, categories) but should NOT modify it.

```json
{
  "quartz": {
    "name": "explorer",
    "displayName": "Explorer",
    "category": "emitter",
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

> **Note:** Plugin manifests remain JSON (they live in `package.json`). Only the user-facing config file is YAML.

### Categories

| Category      | Description                                     |
| ------------- | ----------------------------------------------- |
| `transformer` | Processes markdown/HTML during build            |
| `filter`      | Filters which pages to include/exclude          |
| `emitter`     | Generates output files and provides components  |
| `pageType`    | Defines how specific content types are rendered |

### Using Manifest Defaults

When adding a new plugin via Syncer, use the manifest's defaults to populate the initial entry:

```javascript
// Pseudo-code for Syncer
const manifest = readPackageJson(pluginPath).quartz
const entry = {
  source: `github:quartz-community/${manifest.name}`,
  enabled: manifest.defaultEnabled,
  options: manifest.defaultOptions || {},
  order: manifest.defaultOrder || 50,
}

// Add layout if plugin has components
if (manifest.components) {
  const [componentName, componentMeta] = Object.entries(manifest.components)[0]
  entry.layout = {
    position: componentMeta.defaultPosition,
    priority: componentMeta.defaultPriority,
    display: "all",
  }
}
```

---

## Migration Considerations

### Detecting v5 vs v4

- **v5 (new system):** `quartz.config.yaml` exists at repository root (legacy fallback: `quartz.plugins.json`)
- **v4 (old system):** Neither `quartz.config.yaml` nor `quartz.plugins.json` exists; `quartz.config.ts` contains full configuration

Syncer should check for `quartz.config.yaml` first, then fall back to `quartz.plugins.json` for legacy v5 installs, to determine which mode to operate in.

### Recommending Migration

If Syncer detects v4 mode (no config file), it should prompt the user:

> "Your Quartz site uses the v4 configuration format. Run `npx quartz migrate` to enable plugin management from Obsidian."

Syncer should NOT attempt to run the migration itself — it requires Node.js/tsx to extract TypeScript config values.

### Post-Migration

386: #TT|After migration, `quartz.ts` becomes a thin template:
387: #JV|
388: #SH|`typescript
389: #TW|import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
390: #QW|const config = await loadQuartzConfig()
391: #WJ|export default config
392: #KJ|export const layout = await loadQuartzLayout()
393: #WV|`
Syncer should not modify these files.

---

## Edge Cases and Gotchas

### 1. Plugin Not Yet Installed

A plugin can be declared in `quartz.config.yaml` but not yet installed (no clone in `.quartz/plugins/`). This is normal — the build process handles installation. Syncer should:

- Show the plugin in the list
- Mark it as "pending install" if the lockfile doesn't have it
- Allow enabling/disabling/configuring it regardless

### 2. Multiple Components per Plugin

Some plugins provide multiple components (though currently none do). The `components` object in the manifest is a map, not a single entry. Syncer should handle this gracefully.

### 3. Dependency Validation

Plugins can declare `dependencies` on other plugins. When disabling a plugin via Syncer, warn the user if other enabled plugins depend on it. The dependency is declared by plugin `name` (e.g., `"content-index"`).

### 4. Order Conflicts

Multiple plugins can have the same `order` value. This is fine — they'll be sorted stably. Syncer does not need to enforce unique order values.

### 5. YAML Comments

`quartz.config.yaml` is YAML, which natively supports comments. Users can add comments to annotate their configuration, and Syncer should preserve them when possible. The YAML parser (`yaml` npm package v2.x) supports comment roundtrip preservation via `keepSourceTokens: true`.

### 6. Schema Reference

The first line of `quartz.config.yaml` should contain the YAML language server schema reference comment:

```yaml
# yaml-language-server: $schema=./quartz/plugins/quartz-plugins.schema.json
```

This comment should be preserved as-is when editing. It's a relative path to the schema file in the Quartz installation and provides IDE autocompletion.

### 7. quartz.lock.json Format

```json
{
  "explorer": {
    "source": "github:quartz-community/explorer",
    "commit": "abc1234",
    "resolved": "https://github.com/quartz-community/explorer"
  }
}
```

This is CLI-managed. Syncer should only read it for display (showing installed versions), never write to it.

> **Note:** The lock file remains JSON. Only the user-facing config is YAML.

### 8. Configuration Field Types

Some `configuration` fields have complex types:

- `theme.colors` has `lightMode` and `darkMode` sub-objects with specific color fields
- `theme.typography` has `header`, `body`, `code` font family strings
- `analytics` has a `provider` field that determines the shape of the rest of the object

Refer to the JSON Schema for exact types and constraints.

### 9. Legacy JSON Fallback

The Quartz CLI includes backward compatibility for `quartz.plugins.json`. If Syncer encounters a site with the legacy JSON config instead of `quartz.config.yaml`, it should:

1. Read/write the JSON file normally (standard `JSON.parse` / `JSON.stringify`)
2. Optionally suggest migration: "Consider running `npx quartz migrate` to upgrade to the YAML config format"

The CLI's `plugin-data.js` handles this fallback automatically — it checks for `quartz.config.yaml` first, then falls back to `quartz.plugins.json`.

---

## Syncer Issue #35 Resolution

This architecture directly addresses [Quartz Syncer Issue #35](https://github.com/saberzero1/quartz-syncer/issues/35) — "Manage Quartz configuration from Obsidian."

### What Syncer Can Now Do

1. **Plugin Management UI** — List, enable/disable, configure, reorder plugins
2. **Layout Editor** — Drag-and-drop component arrangement (positions + priorities)
3. **Site Settings** — Edit pageTitle, theme colors, analytics, etc.
4. **Plugin Discovery** — Read manifests to show available plugins with descriptions
5. **Validation** — Use JSON Schema to validate changes before committing

### Minimal Implementation Path

1. Read `quartz.config.yaml` on sync
2. Parse YAML (using the `yaml` npm package)
3. Present a settings UI in Obsidian
4. On save: write updated YAML, commit, push
5. Let the CI/build pipeline handle the rest

No TypeScript parsing. No AST manipulation. No Node.js subprocess. Just YAML.

---

## Quick Reference: All 40 Default Plugins

| Plugin                     | Category    | Default Enabled | Has Component | Default Position |
| -------------------------- | ----------- | --------------- | ------------- | ---------------- |
| note-properties            | transformer | ✅              | ✅            | beforeBody       |
| created-modified-date      | transformer | ✅              | ❌            | -                |
| syntax-highlighting        | transformer | ✅              | ❌            | -                |
| obsidian-flavored-markdown | transformer | ✅              | ❌            | -                |
| github-flavored-markdown   | transformer | ✅              | ❌            | -                |
| table-of-contents          | transformer | ✅              | ✅            | right            |
| crawl-links                | transformer | ✅              | ❌            | -                |
| description                | transformer | ✅              | ❌            | -                |
| latex                      | transformer | ✅              | ❌            | -                |
| citations                  | transformer | ❌              | ❌            | -                |
| hard-line-breaks           | transformer | ❌              | ❌            | -                |
| ox-hugo                    | transformer | ❌              | ❌            | -                |
| roam                       | transformer | ❌              | ❌            | -                |
| remove-draft               | filter      | ✅              | ❌            | -                |
| explicit-publish           | filter      | ❌              | ❌            | -                |
| alias-redirects            | emitter     | ✅              | ❌            | -                |
| content-index              | emitter     | ✅              | ❌            | -                |
| favicon                    | emitter     | ✅              | ❌            | -                |
| og-image                   | emitter     | ✅              | ❌            | -                |
| cname                      | emitter     | ✅              | ❌            | -                |
| canvas-page                | pageType    | ✅              | ❌            | -                |
| content-page               | pageType    | ✅              | ❌            | -                |
| bases-page                 | pageType    | ✅              | ❌            | -                |
| folder-page                | pageType    | ✅              | ❌            | -                |
| tag-page                   | pageType    | ✅              | ❌            | -                |
| explorer                   | emitter     | ✅              | ✅            | left             |
| graph                      | emitter     | ✅              | ✅            | right            |
| search                     | emitter     | ✅              | ✅            | left             |
| backlinks                  | emitter     | ✅              | ✅            | right            |
| article-title              | emitter     | ✅              | ✅            | beforeBody       |
| content-meta               | emitter     | ✅              | ✅            | beforeBody       |
| tag-list                   | emitter     | ✅              | ✅            | beforeBody       |
| page-title                 | emitter     | ✅              | ✅            | left             |
| darkmode                   | emitter     | ✅              | ✅            | left             |
| reader-mode                | emitter     | ✅              | ✅            | left             |
| breadcrumbs                | emitter     | ✅              | ✅            | beforeBody       |
| comments                   | emitter     | ❌              | ✅            | afterBody        |
| footer                     | emitter     | ✅              | ✅            | footer           |
| recent-notes               | emitter     | ❌              | ❌            | -                |
| spacer                     | component   | ✅              | ✅            | left             |
