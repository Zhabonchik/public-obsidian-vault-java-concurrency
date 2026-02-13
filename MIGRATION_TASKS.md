# Quartz v5 Migration Tasks

> Roadmap for migrating internal components to community plugins and adopting `@quartz-community/types` in core.

## Table of Contents

1. [Plan Overview](#plan-overview)
2. [Architecture Summary](#architecture-summary)
3. [Component Analysis](#component-analysis)
4. [Migration Plan](#migration-plan)
   - [Phase A: Delete Internal Duplicates](#phase-a-delete-internal-duplicates)
   - [Phase B: Migrate Feature Components](#phase-b-migrate-feature-components-optional)
   - [Phase C: Adopt @quartz-community/types in Core](#phase-c-adopt-quartz-communitytypes-in-core)
   - [Phase D: PageType System](#phase-d-pagetype-system)
5. [Execution Order](#execution-order)
6. [Migration Checklist Templates](#migration-checklist-templates)
   - [Component Migration Checklist](#component-migration-checklist)
   - [PageType Migration Checklist](#pagetype-migration-checklist)

---

## Plan Overview

Quartz v5 is transitioning from a monolithic component architecture to a plugin-first model where community plugins are first-class citizens. This migration has four phases:

1. **Phase A — Delete Internal Duplicates**: Remove internal components that already have community plugin equivalents.
2. **Phase B — Migrate Feature Components**: Extract additional feature components to community plugins.
3. **Phase C — Type Unification**: Adopt `@quartz-community/types` in Quartz core's `quartz/components/types.ts`, eliminating `as QuartzComponent` casts in `quartz.layout.ts`.
4. **Phase D — PageType System**: Introduce PageType as a new first-class plugin category. Reclassify current emitters into PageTypes, FileEmitters, and StaticFiles. Migrate all three page-rendering emitters (Content, Folder, Tags) to community plugins. Keep 404 as a core default fallback.

### Current State

- **10 community plugins** exist across `quartz-community/*` repos: `explorer`, `graph`, `search`, `table-of-contents`, `backlinks`, `comments`, `breadcrumbs`, `recent-notes`, `latex`, and the `plugin-template`.
- **6 of these** have corresponding internal duplicates still in `quartz/components/` that should be removed.
- **`quartz.layout.ts`** uses `as QuartzComponent` casts to bridge type incompatibility between core and community types.
- All community plugins import from `@quartz-community/types` (via `github:quartz-community/types`).

### Goal State

- Internal duplicates deleted from `quartz/components/`.
- Additional feature components migrated to community plugins.
- Core `quartz/components/types.ts` re-exports from `@quartz-community/types` (or aligns structurally), eliminating the need for `as QuartzComponent` casts.
- `quartz.layout.ts` uses plugin components without type casts.
- PageType introduced as a new first-class plugin category — page-rendering emitters replaced by declarative PageType plugins.
- All three page types (Content, Folder, Tags) migrated to community plugins. 404 stays in core as a default fallback.
- Current emitters reclassified into PageTypes, FileEmitters, StaticFiles, and core infrastructure.
- Layout configuration restructured to `layout.defaults` (universal) + `layout.byPageType` (per-page-type slots).

---

## Architecture Summary

### How Components Are Used

```
quartz.config.ts          → declares externalPlugins (community plugin sources)
quartz.layout.ts          → composes components into page layouts
quartz/components/        → internal component definitions
.quartz/plugins/          → installed community plugins (git-cloned)

Emitters (contentPage, tagPage, folderPage, 404) receive layouts and call:
  renderPage(cfg, slug, componentData, layout, resources)
    ├─ Head       (from sharedPageComponents.head — hardcoded in layout)
    ├─ Body       (hardcoded in renderPage.tsx as BodyConstructor)
    ├─ Header     (hardcoded in renderPage.tsx as HeaderConstructor)
    ├─ beforeBody (from layout — configurable)
    ├─ left       (from layout — configurable)
    ├─ pageBody   (from emitter — Content, TagContent, FolderContent, NotFound)
    ├─ right      (from layout — configurable)
    ├─ afterBody  (from layout — configurable)
    └─ Footer     (from sharedPageComponents.footer — hardcoded in layout)
```

### The Type Cast Problem

Core defines `QuartzComponent` as:

```typescript
// quartz/components/types.ts
type QuartzComponent = ComponentType<QuartzComponentProps> & {
  css?: StringResource
  beforeDOMLoaded?: StringResource
  afterDOMLoaded?: StringResource
}
```

Community types define it as:

```typescript
// @quartz-community/types
type QuartzComponent = ((props: QuartzComponentProps) => unknown) & {
  css?: string | string[] | undefined
  beforeDOMLoaded?: string | string[] | undefined
  afterDOMLoaded?: string | string[] | undefined
}
```

The difference: core uses `ComponentType<P>` (preact-specific, returns `VNode | null`), community uses `(props) => unknown` (preact-agnostic). Because community plugins have their own `node_modules` with separate preact/hast types, TypeScript sees them as distinct types even though they're structurally compatible at runtime.

This is why `quartz.layout.ts` currently needs:

```typescript
const searchComponent = Plugin.Search() as QuartzComponent
```

**Eliminating these casts** is Phase B of this migration.

---

## Component Analysis

### Classification Legend

| Category               | Meaning                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| 🔴 Core Infrastructure | Must stay in core — hardcoded in rendering pipeline or emitters             |
| 🟡 Core Utility        | Layout wrappers / composition — must stay, used to arrange other components |
| 🟢 Already Migrated    | Community plugin exists, internal copy is a duplicate to be deleted         |
| 🔵 Migration Candidate | Feature component that can be extracted to a community plugin               |
| ⚪ Supporting          | Helper component, not a QuartzComponent — used internally by others         |

---

### 🔴 Core Infrastructure (MUST stay in core)

These are hardcoded in emitters or `renderPage.tsx` and are fundamental to the build pipeline.

| Component          | File                      | Used By                                        | Why Core                                                                                    |
| ------------------ | ------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Head**           | `Head.tsx`                | All emitters via `sharedPageComponents.head`   | Renders `<head>` with meta, SEO, styles, scripts. Required for every page.                  |
| **Body**           | `Body.tsx`                | `renderPage.tsx` (as `BodyConstructor`)        | Page `<body>` wrapper. Includes clipboard script. Hardcoded in render pipeline.             |
| **Header**         | `Header.tsx`              | `renderPage.tsx` (as `HeaderConstructor`)      | Page header wrapper. Hardcoded in render pipeline.                                          |
| **Content**        | `pages/Content.tsx`       | `contentPage.tsx` emitter                      | Renders article HTML content. Tightly coupled to emitter.                                   |
| **TagContent**     | `pages/TagContent.tsx`    | `tagPage.tsx` emitter                          | Renders tag listing page. Depends on `PageList`. Tightly coupled to emitter.                |
| **FolderContent**  | `pages/FolderContent.tsx` | `folderPage.tsx` emitter                       | Renders folder listing page. Depends on `PageList`. Tightly coupled to emitter.             |
| **NotFound**       | `pages/404.tsx`           | `404.tsx` emitter                              | 404 page content. Tightly coupled to emitter.                                               |
| **registry.ts**    | `registry.ts`             | `external.ts`, `componentResources.ts` emitter | Component registration system for dynamic plugin lookup.                                    |
| **external.ts**    | `external.ts`             | `quartz.layout.ts` (via `External()`)          | External component loader. Required for plugin system.                                      |
| **types.ts**       | `types.ts`                | Every component                                | Type definitions (`QuartzComponent`, `QuartzComponentProps`, `QuartzComponentConstructor`). |
| **index.ts**       | `index.ts`                | Everywhere                                     | Barrel exports for all built-in components.                                                 |
| **renderPage.tsx** | `renderPage.tsx`          | All page emitters                              | Core rendering engine. Composes layouts, handles transclusions, injects resources.          |

---

### 🟡 Core Utility (Layout wrappers — stay in core)

These are composition utilities that take `QuartzComponent` as arguments. They must remain in core to work with both internal and external components.

| Component             | File                    | Dependencies               | Purpose                                           |
| --------------------- | ----------------------- | -------------------------- | ------------------------------------------------- |
| **DesktopOnly**       | `DesktopOnly.tsx`       | Component types            | Wraps a component to show only on desktop.        |
| **MobileOnly**        | `MobileOnly.tsx`        | Component types            | Wraps a component to show only on mobile.         |
| **Flex**              | `Flex.tsx`              | Component types, resources | Arranges multiple components in a flex row.       |
| **ConditionalRender** | `ConditionalRender.tsx` | Component types            | Renders a component only when a condition is met. |
| **Spacer**            | `Spacer.tsx`            | `lang` utility             | Simple layout spacer element.                     |

---

### 🟢 Already Migrated (Delete internal duplicates)

These components have community plugin equivalents in `quartz-community/*` repos. The internal copies are **dead code** and should be removed along with their associated styles and scripts.

| Component           | Internal File         | Community Plugin                            | Associated Styles                          | Associated Scripts           |
| ------------------- | --------------------- | ------------------------------------------- | ------------------------------------------ | ---------------------------- |
| **Backlinks**       | `Backlinks.tsx`       | `github:quartz-community/backlinks`         | `styles/backlinks.scss`                    | (uses `OverflowList`)        |
| **Breadcrumbs**     | `Breadcrumbs.tsx`     | `github:quartz-community/breadcrumbs`       | `styles/breadcrumbs.scss`                  | —                            |
| **RecentNotes**     | `RecentNotes.tsx`     | `github:quartz-community/recent-notes`      | `styles/recentNotes.scss`                  | —                            |
| **Search**          | `Search.tsx`          | `github:quartz-community/search`            | `styles/search.scss`                       | `scripts/search.inline.ts`   |
| **TableOfContents** | `TableOfContents.tsx` | `github:quartz-community/table-of-contents` | `styles/toc.scss`, `styles/legacyToc.scss` | `scripts/toc.inline.ts`      |
| **Comments**        | `Comments.tsx`        | `github:quartz-community/comments`          | —                                          | `scripts/comments.inline.ts` |

**Note**: `OverflowList.tsx` is a helper used by the internal `Backlinks.tsx` and `TableOfContents.tsx`. After deleting these internal duplicates, verify whether `OverflowList.tsx` is still imported by any remaining core component. If not, it can also be removed.

---

### 🔵 Migration Candidates (Feature components)

These are user-facing, swappable components with no hard coupling to the build pipeline. They can be extracted to community plugins.

| Component        | File               | Dependencies                     | Scripts                        | Styles                    | Complexity | Notes                                                              |
| ---------------- | ------------------ | -------------------------------- | ------------------------------ | ------------------------- | ---------- | ------------------------------------------------------------------ |
| **Darkmode**     | `Darkmode.tsx`     | `i18n`, `lang`                   | `scripts/darkmode.inline.ts`   | `styles/darkmode.scss`    | Low        | Theme toggle button. Self-contained. Interacts with CSS variables. |
| **ReaderMode**   | `ReaderMode.tsx`   | `i18n`, `lang`                   | `scripts/readermode.inline.ts` | `styles/readermode.scss`  | Low        | Reader mode toggle. Self-contained. Hides sidebars.                |
| **PageTitle**    | `PageTitle.tsx`    | `path`, `i18n`, `lang`           | —                              | Inline CSS                | Low        | Site title in sidebar. Uses `pathToRoot` for link.                 |
| **ArticleTitle** | `ArticleTitle.tsx` | `lang`                           | —                              | Inline CSS                | Very Low   | Renders frontmatter title. Minimal logic.                          |
| **ContentMeta**  | `ContentMeta.tsx`  | `Date` component, `i18n`, `lang` | —                              | `styles/contentMeta.scss` | Low        | Shows date and reading time. Uses the `Date` utility.              |
| **TagList**      | `TagList.tsx`      | `path`, `lang`                   | —                              | Inline CSS                | Low        | Renders tag links. Uses `resolveRelative` for URLs.                |
| **Footer**       | `Footer.tsx`       | `i18n`                           | —                              | `styles/footer.scss`      | Low        | Shows version and links. Commonly customized.                      |

---

### ⚪ Supporting Components (NOT QuartzComponents)

These are helper components or utilities used internally by other components. They don't follow the `QuartzComponentConstructor` factory pattern.

| Component        | File               | Used By                                              | Migration Impact                                                             |
| ---------------- | ------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Date**         | `Date.tsx`         | `ContentMeta`, `RecentNotes` (community), `PageList` | Stays in core. Community plugins that need date formatting bundle their own. |
| **PageList**     | `PageList.tsx`     | `TagContent`, `FolderContent`                        | Stays in core. Used by page-type components which are core.                  |
| **OverflowList** | `OverflowList.tsx` | `Backlinks` (internal), `TableOfContents` (internal) | Review after deleting internal duplicates. May become unused.                |

---

### Scripts Inventory

| Script                 | File       | Used By                                    | Category                   |
| ---------------------- | ---------- | ------------------------------------------ | -------------------------- |
| `clipboard.inline.ts`  | `scripts/` | `Body.tsx`                                 | 🔴 Core                    |
| `spa.inline.ts`        | `scripts/` | `componentResources.ts` emitter            | 🔴 Core                    |
| `popover.inline.ts`    | `scripts/` | `componentResources.ts` emitter            | 🔴 Core                    |
| `callout.inline.ts`    | `scripts/` | Transformer (not a component)              | 🔴 Core                    |
| `checkbox.inline.ts`   | `scripts/` | Transformer (not a component)              | 🔴 Core                    |
| `mermaid.inline.ts`    | `scripts/` | Transformer (not a component)              | 🔴 Core                    |
| `darkmode.inline.ts`   | `scripts/` | `Darkmode.tsx`                             | 🔵 Migrate with Darkmode   |
| `readermode.inline.ts` | `scripts/` | `ReaderMode.tsx`                           | 🔵 Migrate with ReaderMode |
| `search.inline.ts`     | `scripts/` | `Search.tsx` (internal duplicate)          | 🟢 Delete                  |
| `toc.inline.ts`        | `scripts/` | `TableOfContents.tsx` (internal duplicate) | 🟢 Delete                  |
| `comments.inline.ts`   | `scripts/` | `Comments.tsx` (internal duplicate)        | 🟢 Delete                  |

### Styles Inventory

| Style                 | File      | Used By                                    | Category                    |
| --------------------- | --------- | ------------------------------------------ | --------------------------- |
| `clipboard.scss`      | `styles/` | `Body.tsx`                                 | 🔴 Core                     |
| `popover.scss`        | `styles/` | `componentResources.ts` emitter            | 🔴 Core                     |
| `listPage.scss`       | `styles/` | `TagContent`, `FolderContent`              | 🔴 Core                     |
| `mermaid.inline.scss` | `styles/` | Transformer (not a component)              | 🔴 Core                     |
| `backlinks.scss`      | `styles/` | `Backlinks.tsx` (internal duplicate)       | 🟢 Delete                   |
| `breadcrumbs.scss`    | `styles/` | `Breadcrumbs.tsx` (internal duplicate)     | 🟢 Delete                   |
| `recentNotes.scss`    | `styles/` | `RecentNotes.tsx` (internal duplicate)     | 🟢 Delete                   |
| `search.scss`         | `styles/` | `Search.tsx` (internal duplicate)          | 🟢 Delete                   |
| `toc.scss`            | `styles/` | `TableOfContents.tsx` (internal duplicate) | 🟢 Delete                   |
| `legacyToc.scss`      | `styles/` | `TableOfContents.tsx` (internal duplicate) | 🟢 Delete                   |
| `darkmode.scss`       | `styles/` | `Darkmode.tsx`                             | 🔵 Migrate with Darkmode    |
| `readermode.scss`     | `styles/` | `ReaderMode.tsx`                           | 🔵 Migrate with ReaderMode  |
| `contentMeta.scss`    | `styles/` | `ContentMeta.tsx`                          | 🔵 Migrate with ContentMeta |
| `footer.scss`         | `styles/` | `Footer.tsx`                               | 🔵 Migrate with Footer      |

---

## Migration Plan

### Phase A: Delete Internal Duplicates

**Goal**: Remove the 6 internal components that already have community plugin equivalents.

**What to delete**:

1. **Component files**:
   - `quartz/components/Backlinks.tsx`
   - `quartz/components/Breadcrumbs.tsx`
   - `quartz/components/RecentNotes.tsx`
   - `quartz/components/Search.tsx`
   - `quartz/components/TableOfContents.tsx`
   - `quartz/components/Comments.tsx`

2. **Associated styles**:
   - `quartz/components/styles/backlinks.scss`
   - `quartz/components/styles/breadcrumbs.scss`
   - `quartz/components/styles/recentNotes.scss`
   - `quartz/components/styles/search.scss`
   - `quartz/components/styles/toc.scss`
   - `quartz/components/styles/legacyToc.scss`

3. **Associated scripts**:
   - `quartz/components/scripts/search.inline.ts`
   - `quartz/components/scripts/toc.inline.ts`
   - `quartz/components/scripts/comments.inline.ts`

4. **Update barrel exports** in `quartz/components/index.ts` — remove the deleted components from the export list.

5. **Verify `OverflowList.tsx`** — check if it's still imported by any remaining component. If not, delete it too.

**Validation**: Run `tsc --noEmit` and `npx quartz build` to ensure nothing breaks.

---

### Phase B: Migrate Feature Components (Optional)

**Goal**: Extract additional feature components to community plugins using the established plugin template pattern.

**Recommended migration order** (by independence and complexity):

| Priority | Component        | Reason                                                                                             |
| -------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| 1        | **ArticleTitle** | Simplest component. Zero dependencies beyond `lang`. Good proof of concept.                        |
| 2        | **TagList**      | Simple. Only needs `path` utilities.                                                               |
| 3        | **PageTitle**    | Simple. Needs `pathToRoot` utility.                                                                |
| 4        | **Darkmode**     | Self-contained with script. Needs inline script bundling.                                          |
| 5        | **ReaderMode**   | Same pattern as Darkmode.                                                                          |
| 6        | **ContentMeta**  | Slightly more complex — uses `Date` helper component. Plugin must include its own date formatting. |
| 7        | **Footer**       | Simple, but commonly customized. Consider keeping in core as a default.                            |

**For each migration**, follow the [Migration Checklist Template](#migration-checklist-template) below.

**After migrating each component**:

1. Delete internal component file + its styles/scripts.
2. Add the new community plugin to `externalPlugins` in `quartz.config.ts`.
3. Update `quartz.layout.ts` to use the plugin component.
4. Remove the component from `quartz/components/index.ts`.
5. Run `tsc --noEmit` and `npx quartz build`.

---

### Phase C: Adopt `@quartz-community/types` in Core

**Goal**: Unify the type definitions so community plugin components are directly assignable to `QuartzComponent` without casts.

**Prerequisite**: Phase A must be complete. Phase B is recommended but not required.

**Strategy**:

There are two approaches, in order of preference:

#### Option 1: Re-export from community types (Recommended)

Make core's `quartz/components/types.ts` re-export from `@quartz-community/types`:

```typescript
// quartz/components/types.ts
export type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  StringResource,
} from "@quartz-community/types"
```

**Pros**: Single source of truth. Eliminates type mismatch entirely.
**Cons**: Core loses preact-specific return type (`VNode | null` → `unknown`). Internal components would still work at runtime, but TypeScript wouldn't catch cases where a component returns a non-JSX value.

**Mitigation**: Internal components already return JSX correctly. The looser return type only matters for new component development, and the factory pattern enforced by `satisfies QuartzComponentConstructor` provides a guardrail.

#### Option 2: Structural alignment

Keep separate type definitions but make them structurally compatible:

```typescript
// quartz/components/types.ts
export type QuartzComponent = ((props: QuartzComponentProps) => unknown) & {
  css?: string | string[]
  beforeDOMLoaded?: string | string[]
  afterDOMLoaded?: string | string[]
}
```

**Pros**: Core controls its own types. Can be stricter internally.
**Cons**: Still separate type identities. May not resolve `as QuartzComponent` casts if `QuartzComponentProps` also differs.

#### Steps for Option 1

1. Add `@quartz-community/types` as a dependency in `package.json`:

   ```json
   "dependencies": {
     "@quartz-community/types": "github:quartz-community/types"
   }
   ```

2. Update `quartz/components/types.ts` to re-export:

   ```typescript
   export type {
     QuartzComponent,
     QuartzComponentConstructor,
     QuartzComponentProps,
     StringResource,
   } from "@quartz-community/types"
   ```

3. Resolve any type conflicts in internal components:
   - Internal components use concrete preact types (`JSX.Element`, `VNode`).
   - These are assignable to `unknown`, so they should work.
   - Run `tsc --noEmit` to verify.

4. Update `quartz.layout.ts`:
   - Remove all `as QuartzComponent` casts.
   - Remove the `import { QuartzComponent } from "./quartz/components/types"` line.

5. Verify:
   - `tsc --noEmit` passes.
   - `npx quartz build` succeeds.
   - Site renders correctly.

---

### Phase D: PageType System

**Goal**: Introduce PageType as a new first-class plugin category (alongside transformers, filters, emitters, and components), reclassify all current emitters into purpose-specific categories, and migrate all three page-rendering emitters to community plugins.

**Prerequisites**: Phase A and Phase C must be complete. Phase B is recommended.

#### D.1: Design Overview

Currently, every HTML-rendering emitter (ContentPage, FolderPage, TagPage, NotFoundPage) follows identical boilerplate:

1. Filter content files to find matching pages
2. Merge shared + page layout into `FullPageLayout`
3. Instantiate Header and Body constructors
4. Build `componentData`
5. Call `renderPage(cfg, slug, componentData, layout, resources)`
6. Write the resulting HTML to output

The only differences between emitters are **which files they match** (step 1) and **what body component they render** (the `pageBody` slot). This means the rendering pipeline is duplicated four times with only the filtering and body varying.

**PageType** extracts this pattern into a declarative plugin interface:

```typescript
interface PageTypePlugin {
  name: string
  priority?: number // higher wins conflicts, default 0
  match: PageMatcher // which source files this page type owns
  generate?: PageGenerator // create virtual pages (e.g., tag index, folder index)
  layout: string // layout key (references layout.byPageType)
  body: QuartzComponentConstructor // the page body component
}
```

A new **PageType dispatcher** in core replaces all individual page-emitting emitters. It iterates over registered PageTypes, runs their matchers and generators, resolves layout, and calls `renderPage` once per page.

#### D.2: Emitter Reclassification

Every current emitter is reclassified into one of four categories:

| Current Emitter      | New Category        | New Location                                                     | Rationale                                                                                                                                              |
| -------------------- | ------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `contentPage`        | **PageType** plugin | `github:quartz-community/content-page`                           | Renders individual content pages. Match: all `.md` files. Body: `Content` component.                                                                   |
| `folderPage`         | **PageType** plugin | `github:quartz-community/folder-page`                            | Generates folder index pages. Match: none (virtual). Generate: one page per folder. Body: `FolderContent`.                                             |
| `tagPage`            | **PageType** plugin | `github:quartz-community/tag-page`                               | Generates tag index pages. Match: none (virtual). Generate: one page per tag + tag listing. Body: `TagContent`.                                        |
| `404`                | **PageType** (core) | `quartz/plugins/pageTypes/404.ts`                                | Default 404 fallback. Stays in core. Match: none. Generate: single `/404` page.                                                                        |
| `componentResources` | **Core infra**      | `quartz/plugins/emitters/componentResources.ts` (unchanged)      | Aggregates CSS/JS from all components, handles analytics, SPA router, font loading. Cannot be a plugin — it needs access to all registered components. |
| `contentIndex`       | **FileEmitter**     | `quartz/plugins/emitters/contentIndex.tsx` (stays, reclassified) | Generates sitemap.xml, RSS feed, contentIndex.json. Cross-page aggregation — not a page type.                                                          |
| `aliases`            | **FileEmitter**     | `quartz/plugins/emitters/aliases.tsx` (stays, reclassified)      | Generates HTML redirect stubs from frontmatter aliases. Bulk generation, not a page type.                                                              |
| `ogImages`           | **FileEmitter**     | `quartz/plugins/emitters/ogImages.tsx` (stays, reclassified)     | Generates OG image binaries. Asset generation, not a page type.                                                                                        |
| `assets`             | **StaticFiles**     | `quartz/plugins/emitters/assets.ts` (stays, reclassified)        | Copies non-markdown files from content directory verbatim.                                                                                             |
| `static`             | **StaticFiles**     | `quartz/plugins/emitters/static.ts` (stays, reclassified)        | Copies `quartz/static/` directory verbatim.                                                                                                            |
| `favicon`            | **StaticFiles**     | `quartz/plugins/emitters/favicon.tsx` (stays, reclassified)      | Generates or copies favicon files.                                                                                                                     |
| `cname`              | **StaticFiles**     | `quartz/plugins/emitters/cname.ts` (stays, reclassified)         | Writes CNAME file for custom domains.                                                                                                                  |

**Category definitions**:

- **PageType**: Owns a set of routes, provides a body component and layout reference, produces rendered HTML pages.
- **FileEmitter**: Produces non-HTML output files (XML, JSON, binary) by aggregating data across all content. Keeps the existing `QuartzEmitterPlugin` interface.
- **StaticFiles**: Copies or generates files that don't depend on content processing. Keeps the existing `QuartzEmitterPlugin` interface.
- **Core infrastructure**: `ComponentResources` — must remain in core as it aggregates resources from all registered components.

> **Note**: FileEmitter and StaticFiles are conceptual reclassifications for clarity. They continue to use the existing `QuartzEmitterPlugin` interface and `"emitter"` category in the plugin manifest. No code changes are required for these — only the page-rendering emitters are replaced by PageTypes.

#### D.3: Composable Matchers

PageTypes use composable matcher functions to declare which source files they own:

```typescript
// Primitive matchers
match.ext(".md") // match by file extension
match.ext(".canvas") // for future Canvas page type
match.slugPrefix("tags/") // match by URL prefix
match.frontmatter("type", (v) => v === "map") // match by frontmatter field

// Combinators
match.and(
  match.ext(".md"),
  match.frontmatter("draft", (v) => !v),
)
match.or(match.ext(".md"), match.ext(".mdx"))
match.not(match.frontmatter("draft", (v) => v === true))

// Convenience
match.all() // matches everything (default content)
match.none() // matches nothing (virtual-only page types)
```

**Conflict resolution**: When multiple PageTypes match the same file, the one with the highest `priority` wins. If priorities are equal, the most recently registered PageType wins (community plugins override core defaults).

**Matcher function signature**:

```typescript
type PageMatcher = (args: {
  slug: FullSlug
  fileData: QuartzPluginData
  cfg: GlobalConfiguration
}) => boolean

// Helper namespace
const match = {
  ext: (extension: string) => PageMatcher,
  slugPrefix: (prefix: string) => PageMatcher,
  frontmatter: (key: string, predicate: (value: unknown) => boolean) => PageMatcher,
  and: (...matchers: PageMatcher[]) => PageMatcher,
  or: (...matchers: PageMatcher[]) => PageMatcher,
  not: (matcher: PageMatcher) => PageMatcher,
  all: () => PageMatcher,
  none: () => PageMatcher,
}
```

#### D.4: Virtual Page Generation

Some page types don't match source files — they generate "virtual" pages from aggregated data:

```typescript
type PageGenerator = (args: {
  content: ProcessedContent[] // all processed source files
  cfg: GlobalConfiguration
  ctx: BuildCtx
}) => VirtualPage[]

interface VirtualPage {
  slug: FullSlug // the URL this page will be served at
  title: string // page title
  data: Partial<QuartzPluginData> // synthetic file data for the page
}
```

**Examples**:

- **FolderPage**: Generates one virtual page per unique folder in the content tree.
- **TagPage**: Generates one virtual page per unique tag found in frontmatter, plus a `/tags` index page listing all tags.
- **404**: Generates a single virtual page at `/404`.

A PageType can use both `match` and `generate` — for example, a future "Collection" page type might match `.collection` files AND generate index pages.

#### D.5: Layout Configuration

The current layout model uses `sharedPageComponents` + `pageLayouts` (one per page type) which are merged by each emitter. The new model makes this explicit and extensible:

```typescript
// quartz.layout.ts (new format)

export const layout = {
  // Truly universal slots — applied to EVERY page type.
  // Keep this minimal. Only things that genuinely belong on every page.
  defaults: {
    head: Component.Head(),
  },

  // Per-page-type slot configuration.
  // Each key corresponds to a PageType plugin's `layout` field.
  byPageType: {
    content: {
      beforeBody: [
        Component.Breadcrumbs(),
        Component.ArticleTitle(),
        Component.ContentMeta(),
        Component.TagList(),
      ],
      left: [
        Component.PageTitle(),
        Component.MobileOnly(Component.Spacer()),
        Component.Search(),
        Component.Darkmode(),
        Component.Explorer(),
      ],
      right: [Component.Graph(), Component.TableOfContents(), Component.Backlinks()],
      afterBody: [Component.Comments()],
      footer: Component.Footer(),
    },
    folder: {
      beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
      left: [
        Component.PageTitle(),
        Component.MobileOnly(Component.Spacer()),
        Component.Search(),
        Component.Darkmode(),
      ],
      right: [],
      afterBody: [],
      footer: Component.Footer(),
    },
    tag: {
      beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
      left: [
        Component.PageTitle(),
        Component.MobileOnly(Component.Spacer()),
        Component.Search(),
        Component.Darkmode(),
      ],
      right: [],
      afterBody: [],
      footer: Component.Footer(),
    },
    // A future Canvas page type — no footer, no sidebars, full-width body.
    // canvas: {
    //   beforeBody: [],
    //   left: [],
    //   right: [],
    //   afterBody: [],
    // },
  },
}
```

**Key design decisions**:

- `layout.defaults` contains **only truly universal slots** — things that belong on literally every page. Currently that's just `head`. Footer is NOT in defaults because some page types (e.g., Canvas) may not want it.
- `layout.byPageType` maps PageType names to their slot configuration. Each PageType plugin declares a `layout: string` field that references a key here.
- If a PageType references a layout key that doesn't exist in `byPageType`, the dispatcher falls back to `defaults` only (head, empty slots). This allows community PageTypes to work without requiring layout configuration — they'll render with just a head and body.
- The `footer` slot is per-page-type, not a global shared slot.

**Layout resolution** (performed by the PageType dispatcher):

```
finalLayout = {
  ...layout.defaults,          // start with universal defaults (head)
  ...layout.byPageType[pageType.layout],  // overlay page-type-specific slots
}
```

#### D.6: Core Infrastructure Changes

##### D.6.1: Plugin System Extensions

The plugin loader must recognize `"pageType"` as a new plugin category:

**`quartz/plugins/loader/types.ts`**:

```typescript
// Current
export type PluginCategory = "transformer" | "filter" | "emitter"

// New
export type PluginCategory = "transformer" | "filter" | "emitter" | "pageType"
```

**`quartz/plugins/types.ts`** — add the `QuartzPageTypePlugin` interface:

```typescript
export interface QuartzPageTypePlugin {
  name: string
  priority?: number
  match: PageMatcher
  generate?: PageGenerator
  layout: string
  body: QuartzComponentConstructor
}

export interface PluginTypes {
  transformers: QuartzTransformerPlugin[]
  filters: QuartzFilterPlugin[]
  emitters: QuartzEmitterPlugin[]
  pageTypes: QuartzPageTypePlugin[] // new
}
```

**`quartz/plugins/loader/index.ts`**:

- Update `detectPluginType()` to recognize PageType exports (looks for `match`, `body`, `layout` exports).
- Update `extractPluginFactory()` to handle PageType plugins.
- Update `loadExternalPlugins()` to sort loaded plugins into the `pageTypes` array.

##### D.6.2: PageType Dispatcher

A new core module replaces the individual page-rendering emitters:

**`quartz/plugins/pageTypes/dispatcher.ts`**:

The dispatcher is a `QuartzEmitterPlugin` (it plugs into the existing emit pipeline) that:

1. Collects all registered `QuartzPageTypePlugin` instances (from core + community plugins).
2. For each source file in `content`:
   - Iterates page types by descending `priority`.
   - Finds the first PageType whose `match()` returns `true`.
   - Records the assignment: `file → pageType`.
3. For each PageType with a `generate()` function:
   - Calls `generate()` with all content.
   - Records the virtual pages: `virtualPage → pageType`.
4. For each assigned page (source + virtual):
   - Resolves layout: `layout.defaults` merged with `layout.byPageType[pageType.layout]`.
   - Instantiates `pageType.body` as the `pageBody` component.
   - Calls `renderPage()` with the resolved layout.
   - Writes HTML to output.

```typescript
// Pseudocode
const PageTypeDispatcher: QuartzEmitterPlugin = {
  name: "PageTypeDispatcher",
  async emit(ctx, content, resources) {
    const pageTypes = ctx.cfg.plugins.pageTypes // sorted by priority desc

    // Phase 1: Match source files
    const assignments = new Map<FullSlug, QuartzPageTypePlugin>()
    for (const [tree, fileData] of content) {
      for (const pt of pageTypes) {
        if (pt.match({ slug: fileData.slug!, fileData, cfg: ctx.cfg.configuration })) {
          assignments.set(fileData.slug!, pt)
          break // first match wins (highest priority)
        }
      }
    }

    // Phase 2: Generate virtual pages
    const virtualPages: Array<{ page: VirtualPage; pageType: QuartzPageTypePlugin }> = []
    for (const pt of pageTypes) {
      if (pt.generate) {
        const pages = pt.generate({ content, cfg: ctx.cfg.configuration, ctx })
        for (const page of pages) {
          virtualPages.push({ page, pageType: pt })
        }
      }
    }

    // Phase 3: Render all pages
    const fps: FilePath[] = []
    // ... render source pages from assignments
    // ... render virtual pages from virtualPages
    // ... each using resolved layout + pageType.body
    return fps
  },
}
```

##### D.6.3: renderPage.tsx Refactoring

`renderPage.tsx` currently hardcodes `HeaderConstructor` and `BodyConstructor` imports. These must become parameters:

**Current** (simplified):

```typescript
import HeaderConstructor from "./Header"
import BodyConstructor from "./Body"

export function renderPage(cfg, slug, componentData, components, resources) {
  const Header = HeaderConstructor()
  const Body = BodyConstructor()
  // ... render using Header, Body, and components
}
```

**New**:

```typescript
export function renderPage(cfg, slug, componentData, components, resources) {
  // Header and Body are now part of the components/layout passed in,
  // OR are hardcoded as core structural components (they're not swappable).
  // The key change: pageBody comes from the PageType, not from the emitter.
}
```

> **Design note**: Header and Body are structural wrappers (`<header>`, `<body>` HTML elements), not content components. They can remain hardcoded in `renderPage`. The important refactoring is that `pageBody` — the actual page content component — comes from the PageType plugin rather than being hardcoded per emitter.

##### D.6.4: Configuration Changes

**`quartz.config.ts`** — PageType plugins are loaded via `externalPlugins` just like other plugins:

```typescript
externalPlugins: [
  // Components
  { source: "github:quartz-community/search" },
  { source: "github:quartz-community/explorer" },
  { source: "github:quartz-community/backlinks" },
  // ...

  // Page Types
  { source: "github:quartz-community/content-page" },
  { source: "github:quartz-community/folder-page" },
  { source: "github:quartz-community/tag-page" },
],
```

The plugin loader auto-detects the plugin type. No separate `pageTypes` array is needed in config — detection is based on the plugin's exports (`match`, `body`, `layout` fields identify a PageType plugin).

#### D.7: Community Plugin Migrations

Three new community plugin repositories:

##### `github:quartz-community/content-page`

- **Match**: `match.ext(".md")` (or `match.all()` with low priority as a catch-all)
- **Generate**: none (source files only)
- **Layout**: `"content"`
- **Body**: `Content` component (moved from `quartz/components/pages/Content.tsx`)
- **Priority**: `0` (default — other page types with higher priority can override for specific files)

##### `github:quartz-community/folder-page`

- **Match**: `match.none()` (virtual pages only)
- **Generate**: Scans all content files, extracts unique folder paths, generates one virtual page per folder.
- **Layout**: `"folder"`
- **Body**: `FolderContent` component (moved from `quartz/components/pages/FolderContent.tsx`)
- **Dependencies**: `PageList` helper component. The plugin must bundle its own copy or import from a shared utils package.

##### `github:quartz-community/tag-page`

- **Match**: `match.none()` (virtual pages only)
- **Generate**: Scans all content files, extracts unique tags from frontmatter, generates one virtual page per tag plus a `/tags` index page.
- **Layout**: `"tag"`
- **Body**: `TagContent` component (moved from `quartz/components/pages/TagContent.tsx`)
- **Dependencies**: `PageList` helper component. Same bundling consideration as FolderPage.

##### Core: `quartz/plugins/pageTypes/404.ts`

- **Match**: `match.none()` (virtual page only)
- **Generate**: Produces a single virtual page at slug `/404`.
- **Layout**: falls back to `defaults` only (just `head`)
- **Body**: `NotFound` component (stays in `quartz/components/pages/404.tsx`)
- **Priority**: `-1` (lowest — never conflicts with other page types)

#### D.8: Type Updates (`@quartz-community/types`)

Add the following types to `~/Repos/types/src/index.ts`:

```typescript
// --- PageType Plugin Types ---

/** Matcher function: determines if a source file belongs to this page type. */
export type PageMatcher = (args: {
  slug: string
  fileData: Record<string, unknown>
  cfg: Record<string, unknown>
}) => boolean

/** Virtual page descriptor for page types that generate pages from aggregated data. */
export interface VirtualPage {
  slug: string
  title: string
  data: Record<string, unknown>
}

/** Generator function: produces virtual pages from all processed content. */
export type PageGenerator = (args: {
  content: Array<[unknown, Record<string, unknown>]>
  cfg: Record<string, unknown>
  ctx: Record<string, unknown>
}) => VirtualPage[]

/** A PageType plugin definition. */
export interface QuartzPageTypePlugin {
  name: string
  priority?: number
  match: PageMatcher
  generate?: PageGenerator
  layout: string
  body: QuartzComponentConstructor
}
```

> **Note**: The community types package uses `Record<string, unknown>` for core-specific types (`QuartzPluginData`, `GlobalConfiguration`, `BuildCtx`) because community plugins don't have access to Quartz core's internal type definitions. At runtime, the actual Quartz types are passed in — the `Record` types are a structural stand-in that avoids coupling community types to core internals.

#### D.9: Plugin Template Updates

Update `~/Repos/plugin-template` to include a PageType example:

**`src/index.ts`** — add a PageType export example (commented out):

```typescript
// --- PageType Example ---
// Uncomment and modify to create a PageType plugin instead of a component plugin.
//
// import { MyPageBody } from "./pages/MyPageBody"
// import type { QuartzPageTypePlugin, PageMatcher } from "@quartz-community/types"
//
// const matchMyPages: PageMatcher = ({ fileData }) => {
//   return fileData.frontmatter?.type === "my-custom-type"
// }
//
// export const myPageType: QuartzPageTypePlugin = {
//   name: "my-page-type",
//   priority: 10,
//   match: matchMyPages,
//   layout: "my-page-type",
//   body: MyPageBody,
// }
```

**`src/types.ts`** — add re-exports for PageType types:

```typescript
export type {
  PageMatcher,
  PageGenerator,
  VirtualPage,
  QuartzPageTypePlugin,
} from "@quartz-community/types"
```

#### D.10: Files to Create

| File                                     | Purpose                                                         |
| ---------------------------------------- | --------------------------------------------------------------- |
| `quartz/plugins/pageTypes/dispatcher.ts` | Core PageType dispatcher (replaces individual page emitters)    |
| `quartz/plugins/pageTypes/404.ts`        | Core 404 page type (default fallback)                           |
| `quartz/plugins/pageTypes/matchers.ts`   | Composable matcher helpers (`match.ext()`, `match.and()`, etc.) |
| `quartz/plugins/pageTypes/index.ts`      | Barrel exports for the pageTypes module                         |

#### D.11: Files to Modify

| File                                   | Change                                                           |
| -------------------------------------- | ---------------------------------------------------------------- |
| `quartz/plugins/types.ts`              | Add `QuartzPageTypePlugin`, update `PluginTypes`                 |
| `quartz/plugins/loader/types.ts`       | Add `"pageType"` to `PluginCategory`                             |
| `quartz/plugins/loader/index.ts`       | Update detection, extraction, and loading for PageType plugins   |
| `quartz/cfg.ts`                        | Update `FullPageLayout` or add layout resolution types           |
| `quartz/components/renderPage.tsx`     | Accept `pageBody` as parameter instead of hardcoding per-emitter |
| `quartz.config.ts`                     | Add content-page, folder-page, tag-page to `externalPlugins`     |
| `quartz.layout.ts`                     | Restructure to `layout.defaults` + `layout.byPageType` format    |
| `~/Repos/types/src/index.ts`           | Add PageType-related types                                       |
| `~/Repos/plugin-template/src/index.ts` | Add PageType example                                             |
| `~/Repos/plugin-template/src/types.ts` | Add PageType type re-exports                                     |

#### D.12: Files to Delete (after migration)

| File                                        | Replaced By                                         |
| ------------------------------------------- | --------------------------------------------------- |
| `quartz/plugins/emitters/contentPage.tsx`   | `github:quartz-community/content-page` + dispatcher |
| `quartz/plugins/emitters/folderPage.tsx`    | `github:quartz-community/folder-page` + dispatcher  |
| `quartz/plugins/emitters/tagPage.tsx`       | `github:quartz-community/tag-page` + dispatcher     |
| `quartz/plugins/emitters/404.tsx`           | `quartz/plugins/pageTypes/404.ts`                   |
| `quartz/components/pages/Content.tsx`       | Bundled into content-page community plugin          |
| `quartz/components/pages/FolderContent.tsx` | Bundled into folder-page community plugin           |
| `quartz/components/pages/TagContent.tsx`    | Bundled into tag-page community plugin              |

> **Note**: `quartz/components/pages/404.tsx` (the NotFound body component) stays in core since the 404 PageType stays in core.

#### D.13: Key Design Decisions

| Decision                                                    | Rationale                                                                                                                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PageType is a new plugin category, not a subtype of emitter | Clean separation of concerns. Emitters are a low-level escape hatch; PageTypes are a high-level declarative abstraction.                                             |
| 404 stays in core                                           | Every site needs a 404 page. It's a sensible default that shouldn't require installing a community plugin.                                                           |
| All three page types migrate to community plugins           | The v5 plugin system is the core vision. Partial migration would be inconsistent and confusing.                                                                      |
| `layout.defaults` is minimal (just `head`)                  | Not all page types want the same chrome. Canvas pages may want no footer, no sidebars. Only truly universal elements belong in defaults.                             |
| Footer is per-page-type, not in defaults                    | Explicitly requested: Canvas pages should not have footer forced on them.                                                                                            |
| FileEmitter/StaticFiles are conceptual, not new interfaces  | Avoids unnecessary API churn. The existing `QuartzEmitterPlugin` interface works fine for these. The reclassification is for documentation and mental model clarity. |
| Matchers are composable functions, not config objects       | Functions are more flexible and can express arbitrary logic. The `match.*` helpers provide convenience without limiting power.                                       |
| Plugin loader auto-detects PageType                         | Consistent with existing auto-detection for transformers/filters/emitters. No separate config array needed.                                                          |
| `PageList` helper is bundled into page type plugins         | Avoids creating a shared utils dependency just for one helper. Each plugin is self-contained.                                                                        |

---

## Execution Order

```
Step 1: Delete 6 internal duplicates (Phase A)
  ├─ Delete component files, styles, scripts
  ├─ Update quartz/components/index.ts
  ├─ Check OverflowList.tsx usage
  └─ Verify: tsc --noEmit, npx quartz build

Step 2: Migrate feature components (Phase B) — one at a time
  ├─ Create community plugin repo from template
  ├─ Migrate component code (see checklist)
  ├─ Add to externalPlugins in quartz.config.ts
  ├─ Update quartz.layout.ts
  ├─ Delete internal copy
  └─ Verify: tsc --noEmit, npx quartz build

Step 3: Adopt @quartz-community/types in core (Phase C)
  ├─ Add types dependency
  ├─ Update quartz/components/types.ts
  ├─ Remove as QuartzComponent casts from quartz.layout.ts
  └─ Verify: tsc --noEmit, npx quartz build

Step 4: Build PageType infrastructure (Phase D — core)
  ├─ Add PageType types to @quartz-community/types
  ├─ Add QuartzPageTypePlugin to quartz/plugins/types.ts
  ├─ Update PluginCategory in quartz/plugins/loader/types.ts
  ├─ Create quartz/plugins/pageTypes/matchers.ts (composable matchers)
  ├─ Create quartz/plugins/pageTypes/dispatcher.ts (core dispatcher)
  ├─ Create quartz/plugins/pageTypes/404.ts (core 404 page type)
  ├─ Update quartz/plugins/loader/index.ts (detection + loading)
  ├─ Refactor quartz/components/renderPage.tsx (accept pageBody as parameter)
  └─ Verify: tsc --noEmit

Step 5: Migrate page types to community plugins (Phase D — plugins)
  ├─ Create github:quartz-community/content-page
  │   ├─ Move Content component + styles
  │   ├─ Define match, layout, body
  │   └─ Build + verify
  ├─ Create github:quartz-community/folder-page
  │   ├─ Move FolderContent component + PageList helper + styles
  │   ├─ Define generate, layout, body
  │   └─ Build + verify
  ├─ Create github:quartz-community/tag-page
  │   ├─ Move TagContent component + PageList helper + styles
  │   ├─ Define generate, layout, body
  │   └─ Build + verify
  └─ Verify: all three plugins build independently

Step 6: Integrate and cut over (Phase D — integration)
  ├─ Add content-page, folder-page, tag-page to externalPlugins
  ├─ Restructure quartz.layout.ts to defaults + byPageType format
  ├─ Delete old emitters: contentPage.tsx, folderPage.tsx, tagPage.tsx, 404.tsx
  ├─ Delete old page components: Content.tsx, FolderContent.tsx, TagContent.tsx
  ├─ Update quartz/components/index.ts
  ├─ Update plugin-template with PageType example
  └─ Verify: tsc --noEmit, npx quartz build, site renders correctly
```

---

## Migration Checklist Templates

### Component Migration Checklist

Use this checklist for each component being migrated to a community plugin.

#### Setup

- [ ] Create new repository at `github.com/quartz-community/{component-name}`
- [ ] Clone `plugin-template` as starting point
- [ ] Update `package.json`:
  - [ ] Set `name` to `@quartz-community/{component-name}`
  - [ ] Set `repository` URL
  - [ ] Verify `@quartz-community/types` dependency
  - [ ] Verify `@quartz-community/utils` dependency (if needed)

#### Component Migration

- [ ] Copy component file to `src/components/{ComponentName}.tsx`
- [ ] Convert to factory function pattern with `satisfies QuartzComponentConstructor`
- [ ] Replace imports:
  - [ ] `"./types"` → `"@quartz-community/types"`
  - [ ] `"../util/path"` → local `src/util/path.ts` or `@quartz-community/utils`
  - [ ] `"../i18n"` → local `src/i18n/` with required locale strings
  - [ ] `"../util/lang"` → local `src/util/lang.ts`
- [ ] Extract SCSS to `src/components/styles/{name}.scss`
- [ ] Extract inline scripts (if any) to `src/components/scripts/{name}.inline.ts`
- [ ] Add type stubs: `src/components/styles.d.ts`, `src/components/scripts.d.ts`
- [ ] Attach resources: `Component.css = style`, `Component.afterDOMLoaded = script`

#### Exports

- [ ] Create `src/components/index.ts` with default export
- [ ] Create `src/index.ts` re-exporting from components
- [ ] Verify `tsup.config.ts` entry points match `package.json` exports

#### Build & Test

- [ ] Run `npm run build` — verify `dist/` output
- [ ] Run `npm run check` — typecheck, lint, format
- [ ] Install in Quartz: add to `externalPlugins` in `quartz.config.ts`
- [ ] Use in layout: update `quartz.layout.ts`
- [ ] Run `tsc --noEmit` in Quartz
- [ ] Run `npx quartz build` and verify site renders

#### Cleanup (in Quartz core)

- [ ] Delete internal component file
- [ ] Delete associated style file(s)
- [ ] Delete associated script file(s)
- [ ] Remove from `quartz/components/index.ts`
- [ ] Verify no remaining imports of deleted files

#### Publish

- [ ] Commit and push community plugin repo
- [ ] Verify Quartz build with `github:quartz-community/{component-name}` specifier

---

### PageType Migration Checklist

Use this checklist for each page type being migrated to a community plugin.

#### Setup

- [ ] Create new repository at `github.com/quartz-community/{page-type-name}`
- [ ] Clone `plugin-template` as starting point
- [ ] Update `package.json`:
  - [ ] Set `name` to `@quartz-community/{page-type-name}`
  - [ ] Set `repository` URL
  - [ ] Verify `@quartz-community/types` dependency

#### Page Body Component

- [ ] Copy page body component to `src/pages/{PageBody}.tsx`
  - ContentPage: `Content.tsx` from `quartz/components/pages/Content.tsx`
  - FolderPage: `FolderContent.tsx` from `quartz/components/pages/FolderContent.tsx`
  - TagPage: `TagContent.tsx` from `quartz/components/pages/TagContent.tsx`
- [ ] Copy helper components if needed (`PageList.tsx` for folder/tag page types)
- [ ] Replace imports:
  - [ ] `"../types"` → `"@quartz-community/types"`
  - [ ] `"../../util/path"` → local `src/util/path.ts` or `@quartz-community/utils`
  - [ ] `"../../i18n"` → local `src/i18n/` with required locale strings
- [ ] Extract associated styles to `src/pages/styles/`
- [ ] Add type stubs for styles if needed

#### PageType Definition

- [ ] Create `src/index.ts` with PageType export:
  - [ ] Define `match` using composable matchers (or `match.none()` for virtual-only)
  - [ ] Define `generate` function (for folder/tag types that create virtual pages)
  - [ ] Set `layout` key (must match a key in `layout.byPageType`)
  - [ ] Set `body` to the page body component constructor
  - [ ] Set `name` and `priority`
- [ ] Verify export satisfies `QuartzPageTypePlugin` type

#### Virtual Page Generation (if applicable)

- [ ] Implement `generate()` function:
  - [ ] Scan all content for relevant data (folders, tags, etc.)
  - [ ] Return `VirtualPage[]` with correct slugs, titles, and data
- [ ] Verify generated slugs don't conflict with source file slugs

#### Build & Test

- [ ] Run `npm run build` — verify `dist/` output
- [ ] Run `npm run check` — typecheck, lint, format
- [ ] Install in Quartz: add to `externalPlugins` in `quartz.config.ts`
- [ ] Add layout entry in `quartz.layout.ts` under `layout.byPageType`
- [ ] Run `tsc --noEmit` in Quartz
- [ ] Run `npx quartz build` and verify pages render correctly

#### Cleanup (in Quartz core)

- [ ] Delete old emitter file (`quartz/plugins/emitters/{name}.tsx`)
- [ ] Delete old page body component (`quartz/components/pages/{Name}.tsx`)
- [ ] Update emitter barrel exports
- [ ] Update component barrel exports
- [ ] Verify no remaining imports of deleted files

#### Publish

- [ ] Commit and push community plugin repo
- [ ] Verify Quartz build with `github:quartz-community/{page-type-name}` specifier
