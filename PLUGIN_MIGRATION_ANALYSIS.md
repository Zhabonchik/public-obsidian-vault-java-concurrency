# Quartz Plugin Migration Analysis

This document provides a comprehensive analysis of which Quartz v4 plugins and components can be migrated to separate repositories, along with strategies and recommendations for each migration.

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Migration Categories](#migration-categories)
3. [Component Analysis](#component-analysis)
4. [Plugin Analysis](#plugin-analysis)
5. [Migration Strategies](#migration-strategies)
6. [Lessons Learned](#lessons-learned)
7. [Recommended Migration Order](#recommended-migration-order)

---

## Executive Summary

Quartz v4 consists of **25 components** and **25 plugins** (13 transformers, 2 filters, 12 emitters). Not all of these are suitable for migration to external repositories. This analysis categorizes each based on:

- **Complexity** - How much code and dependencies are involved
- **Independence** - Whether it can function without deep Quartz integration
- **Community Value** - Whether external plugins would benefit the ecosystem
- **Customization Demand** - How often users want to customize this feature

### Summary Statistics

| Category     | Total | Good Candidates | Moderate | Core Only |
| ------------ | ----- | --------------- | -------- | --------- |
| Components   | 25    | 8               | 7        | 10        |
| Transformers | 13    | 5               | 4        | 4         |
| Emitters     | 12    | 3               | 4        | 5         |
| Filters      | 2     | 1               | 1        | 0         |

---

## Migration Categories

### ✅ Good Candidates

Components/plugins that are:

- Self-contained with clear boundaries
- Frequently customized by users
- Have potential for community variations
- Can work with the standard plugin API

### ⚠️ Moderate Candidates

Components/plugins that:

- Have some dependencies on Quartz internals
- Might need API adjustments to externalize
- Could benefit from being plugins but require more work

### ❌ Core Only

Components/plugins that:

- Are fundamental to Quartz's operation
- Have deep integration with build system
- Would create versioning nightmares if externalized
- Are rarely customized

---

## Component Analysis

### ✅ Good Candidates for Migration

#### 1. Explorer (Already Migrated)

**Status**: ✅ Migrated to `@quartz-community/explorer`

**Complexity**: High (FileTrieNode, state persistence, mobile navigation)
**Dependencies**: Content index data
**Value**: High - users frequently want custom sorting, filtering, and styling

**Migration Notes**:

- Required reimplementing FileTrieNode for client-side
- Needed path utilities (simplifySlug, folder prefix detection)
- State persistence via localStorage works well as standalone

#### 2. Graph (Already Migrated)

**Status**: ✅ Migrated to `@quartz-community/graph`

**Complexity**: Very High (D3 force simulation, PixiJS rendering)
**Dependencies**: Content index, D3, PixiJS (loaded from CDN)
**Value**: High - visual feature that differentiates Quartz

**Migration Notes**:

- Loads D3/PixiJS from CDN to avoid bundling large dependencies
- Configuration is self-contained via data attributes
- Works well as standalone plugin

#### 3. Search (Already Migrated)

**Status**: ✅ Migrated to `@quartz-community/search`

**Complexity**: High (FlexSearch indexing, CJK support, preview)
**Dependencies**: Content index, FlexSearch
**Value**: High - core feature with customization demand

**Migration Notes**:

- FlexSearch can be imported as ESM module
- Preview fetching works via standard fetch API
- Keyboard shortcuts are self-contained

#### 4. TableOfContents

**Status**: 📋 Recommended for migration

**Complexity**: Medium
**Dependencies**: Heading data from transformer
**Value**: Medium - users want different TOC styles

**Migration Strategy**:

```
1. Extract TableOfContents.tsx and toc.inline.ts
2. Pass heading data via data attributes
3. Style variations via CSS variables
4. Support different depth/scroll behavior options
```

#### 5. Backlinks

**Status**: 📋 Recommended for migration

**Complexity**: Medium
**Dependencies**: Content index (backlinks data)
**Value**: Medium - some users want custom backlink displays

**Migration Strategy**:

```
1. Extract Backlinks.tsx
2. Fetch backlinks from contentIndex.json
3. Support custom rendering templates
4. Add filtering options
```

#### 6. RecentNotes

**Status**: 📋 Recommended for migration

**Complexity**: Low-Medium
**Dependencies**: Content metadata
**Value**: Medium - popular feature with customization needs

**Migration Strategy**:

```
1. Extract component and date sorting logic
2. Make limit, filter, and sort configurable
3. Support custom card templates
```

#### 7. Comments

**Status**: 📋 Recommended for migration

**Complexity**: Low (wrapper for external services)
**Dependencies**: External comment providers (Giscus, Utterances, etc.)
**Value**: High - many comment system variations exist

**Migration Strategy**:

```
1. Create base Comments interface
2. Implement Giscus, Utterances, Disqus variants
3. Each provider as separate plugin or single plugin with providers
```

#### 8. Breadcrumbs

**Status**: 📋 Recommended for migration

**Complexity**: Low
**Dependencies**: Path parsing
**Value**: Low-Medium - some customization demand

**Migration Strategy**:

```
1. Extract component with path utilities
2. Make separator, styling configurable
3. Add options for hiding/showing parts
```

### ⚠️ Moderate Candidates

#### 9. Darkmode

**Status**: ⚠️ Consider migration

**Complexity**: Low
**Dependencies**: Theme system (CSS variables)
**Concerns**: Tightly coupled to Quartz's theme system

**Migration Consideration**:

- Could work if theme contract is stable
- Would need to document required CSS variables
- Risk: theme changes could break external plugins

#### 10. ReaderMode

**Status**: ⚠️ Consider migration

**Complexity**: Low
**Dependencies**: Layout system, CSS
**Concerns**: Affects layout which is Quartz-controlled

#### 11. TagList

**Status**: ⚠️ Consider migration

**Complexity**: Low
**Dependencies**: Frontmatter tags
**Value**: Low - simple component

#### 12. ContentMeta

**Status**: ⚠️ Consider migration

**Complexity**: Low
**Dependencies**: Frontmatter, date formatting
**Value**: Low-Medium

#### 13. Footer

**Status**: ⚠️ Consider migration

**Complexity**: Low
**Dependencies**: Site configuration
**Value**: Low - simple customization

#### 14. Flex

**Status**: ⚠️ Consider migration

**Complexity**: Very Low
**Dependencies**: None
**Value**: Low - utility component

#### 15. ConditionalRender

**Status**: ⚠️ Consider migration

**Complexity**: Very Low
**Dependencies**: Page context
**Value**: Low - utility component

### ❌ Core Only (Do Not Migrate)

#### 16. Content, TagContent, FolderContent

**Reason**: Core page rendering, deeply integrated with build system

#### 17. NotFound (404)

**Reason**: Needs to integrate with routing system

#### 18. Head

**Reason**: SEO and metadata, tightly coupled to configuration

#### 19. PageTitle

**Reason**: Simple, rarely customized, core branding

#### 20. ArticleTitle

**Reason**: Simple, part of core layout

#### 21. Spacer

**Reason**: Trivial utility, not worth externalizing

#### 22. DesktopOnly / MobileOnly

**Reason**: Layout utilities, simple CSS wrappers

---

## Plugin Analysis

### Transformer Plugins

#### ✅ Good Candidates

| Plugin                       | Complexity | Value     | Migration Notes                              |
| ---------------------------- | ---------- | --------- | -------------------------------------------- |
| **ObsidianFlavoredMarkdown** | High       | Very High | Popular, many want customization             |
| **RoamFlavoredMarkdown**     | Medium     | Medium    | Niche but valuable for Roam users            |
| **OxHugoFlavouredMarkdown**  | Medium     | Medium    | Niche for Hugo migrants                      |
| **Citations**                | Medium     | Medium    | Academic users want variations               |
| **Latex**                    | Medium     | High      | Math rendering variations (KaTeX vs MathJax) |

#### ⚠️ Moderate Candidates

| Plugin                 | Complexity | Concerns                                    |
| ---------------------- | ---------- | ------------------------------------------- |
| **SyntaxHighlighting** | Medium     | Many themes exist, could externalize themes |
| **TableOfContents**    | Low        | Generates heading data for component        |
| **Description**        | Low        | Simple, stable                              |
| **HardLineBreaks**     | Very Low   | Trivial                                     |

#### ❌ Core Only

| Plugin                     | Reason                             |
| -------------------------- | ---------------------------------- |
| **FrontMatter**            | Fundamental to content parsing     |
| **GitHubFlavoredMarkdown** | Base markdown features             |
| **CreatedModifiedDate**    | Deep git integration               |
| **CrawlLinks**             | Link resolution integral to Quartz |

### Emitter Plugins

#### ✅ Good Candidates

| Plugin             | Complexity | Value  | Migration Notes                      |
| ------------------ | ---------- | ------ | ------------------------------------ |
| **CustomOgImages** | High       | High   | Users want custom OG generation      |
| **CNAME**          | Very Low   | Medium | Simple but useful for custom domains |
| **Favicon**        | Low        | Low    | Simple file operations               |

#### ⚠️ Moderate Candidates

| Plugin             | Complexity | Concerns                                       |
| ------------------ | ---------- | ---------------------------------------------- |
| **ContentIndex**   | Medium     | Core data structure, careful versioning needed |
| **AliasRedirects** | Low        | Simple but integrated with routing             |
| **Static**         | Low        | File copying, stable                           |
| **Assets**         | Low        | File copying, stable                           |

#### ❌ Core Only

| Plugin                 | Reason               |
| ---------------------- | -------------------- |
| **ContentPage**        | Core page generation |
| **TagPage**            | Core page type       |
| **FolderPage**         | Core page type       |
| **ComponentResources** | CSS/JS bundling      |
| **NotFoundPage**       | 404 generation       |

### Filter Plugins

| Plugin              | Status      | Notes                         |
| ------------------- | ----------- | ----------------------------- |
| **RemoveDrafts**    | ⚠️ Moderate | Simple, could have variations |
| **ExplicitPublish** | ⚠️ Moderate | Alternative publishing model  |

---

## Migration Strategies

### Strategy 1: Client-Side Component (Recommended for UI)

Best for: Explorer, Graph, Search, TableOfContents, Backlinks

```
Components with client-side interactivity:
1. Export TSX component with factory pattern
2. Inline scripts bundled as strings
3. SCSS styles bundled as strings
4. Configuration via data attributes
5. Data fetched from /static/contentIndex.json
```

**Pros**: Complete independence, clear boundaries
**Cons**: Requires reimplementing utilities

### Strategy 2: Transformer Plugin

Best for: Markdown extensions, syntax variations

```
Transformer plugins:
1. Export factory function returning plugin object
2. Implement markdownPlugins() for remark plugins
3. Implement htmlPlugins() for rehype plugins
4. Optionally inject CSS/JS via externalResources()
```

**Pros**: Clean API, well-documented pattern
**Cons**: Limited to markdown/HTML transformation

### Strategy 3: Emitter Plugin

Best for: Output generation, file processing

```
Emitter plugins:
1. Export factory function returning plugin object
2. Implement emit() for file generation
3. Optionally implement partialEmit() for incremental builds
4. Declare dependencies via getQuartzComponents()
```

**Pros**: Full control over output
**Cons**: More complex API, needs build system understanding

### Strategy 4: Hybrid (Component + Emitter)

Best for: Features needing both UI and data generation

```
Graph-like features:
1. Component plugin for UI rendering
2. Emitter plugin for data generation
3. Clear data contract between them
```

**Pros**: Flexibility, separation of concerns
**Cons**: More complex to maintain

---

## Lessons Learned

From migrating Explorer, Graph, and Search:

### 1. Path Utilities Are Essential

Every component needs path helpers:

- `simplifySlug()` - Remove trailing `/index`
- `getCurrentSlug()` - Parse current URL
- Folder prefix detection for navigation

**Recommendation**: Create `@quartz-community/utils` package

### 2. Content Index Is The Data Contract

All components fetch from `/static/contentIndex.json`. Document this format:

```typescript
interface ContentIndex {
  [slug: string]: {
    title: string
    links: string[]
    tags: string[]
    content: string
    // ... other fields
  }
}
```

### 3. Event System Is Stable

Quartz's navigation events work reliably:

- `nav` - After page load/navigation
- `prenav` - Before navigation (save state)
- `window.addCleanup()` - Register cleanup handlers

### 4. CDN Loading Works Well

For large dependencies (D3, PixiJS, FlexSearch):

- Load from CDN at runtime
- Avoids bundling bloat
- Users can self-host if needed

### 5. TypeScript Limitations

Inline scripts run in browser context:

- Use `@ts-nocheck` directive
- Document expected globals
- Provide type stubs if needed

### 6. State Persistence Patterns

Standard patterns work:

- `localStorage` for persistent state (folder states)
- `sessionStorage` for session state (scroll positions)
- URL hash for shareable state (if needed)

---

## Recommended Migration Order

Based on value, complexity, and community demand:

### Phase 1: High Value, Already Migrated ✅

1. ~~Explorer~~ - Complete
2. ~~Graph~~ - Complete
3. ~~Search~~ - Complete

### Phase 2: High Value, Medium Complexity

4. **Comments** - Many provider variations needed
5. **TableOfContents** - Frequently customized
6. **Backlinks** - Popular feature

### Phase 3: Medium Value, Low Complexity

7. **RecentNotes** - Common customization
8. **Breadcrumbs** - Simple migration
9. **Latex** - Math rendering variations

### Phase 4: Transformer Plugins

10. **ObsidianFlavoredMarkdown** - High demand
11. **Citations** - Academic users
12. **RoamFlavoredMarkdown** - Niche but valuable

### Phase 5: Emitter Plugins

13. **CustomOgImages** - High customization demand
14. **ContentIndex** - Careful versioning needed

### Phase 6: Evaluate Based on Demand

- Darkmode (if theme API stabilizes)
- SyntaxHighlighting themes
- Other minor components

---

## Appendix: Migration Checklist

For each plugin migration:

- [ ] Create repository from plugin-template
- [ ] Copy component/plugin code
- [ ] Replace Quartz imports with `@quartz-community/types`
- [ ] Reimplement required utilities (path helpers, etc.)
- [ ] Add `@ts-nocheck` for inline scripts
- [ ] Update data fetching to use `/static/contentIndex.json`
- [ ] Handle both data formats (`data.content || data`)
- [ ] Test with `npm run build`
- [ ] Test with actual Quartz site
- [ ] Document configuration options
- [ ] Add to plugin registry

---

_This document was generated based on analysis of Quartz v4 codebase and lessons learned from migrating Explorer, Graph, and Search plugins._
