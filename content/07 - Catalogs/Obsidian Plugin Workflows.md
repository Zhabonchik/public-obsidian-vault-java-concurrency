---
tags: [obsidian, plugins, advanced-tables, tag-wrangler, dataview]
type: guide
related:
  - "[[Tag Taxonomy]]"
  - "[[Script Catalog]]"
  - "[[Graph View Guide]]"
status: active
---

# Obsidian Plugin Workflows

This note documents how the wiki should use Obsidian plugins without making the vault fragile. #obsidian #plugins

## Dataview

Use Dataview for catalogs that should update automatically.

| Use | Pattern |
|---|---|
| All notes | `FROM "VizzyCode"` |
| Component scripts | `FROM "VizzyCode/02 - Components"` |
| Examples | `FROM "VizzyCode/02 - Components/Examples"` |
| Open tasks | `TASK FROM "VizzyCode" WHERE !completed` |

> [!warning] Avoid timestamp dashboards
> The wiki avoids date-based panels. Prefer stable catalogs by name, type, tags, and status.

## Advanced Tables

Use Advanced Tables to keep reference tables aligned and easy to edit.

| Table type | Where used | Rule |
|---|---|---|
| Responsibility tables | Component notes | Keep columns short: Area, Behavior. |
| Command tables | CLI and VS Code notes | Keep examples in inline code unless multi-line is needed. |
| Tag tables | [[Tag Taxonomy]] | Keep one canonical tag per row. |
| Troubleshooting tables | [[14 - Troubleshooting]] | Use Error, Cause, Solution. |

> [!tip] Table style
> Prefer three or four columns. If a row needs a paragraph, move that detail below the table as a callout.

## Tag Wrangler

Use Tag Wrangler for vocabulary cleanup.

| Task | Recommended action |
|---|---|
| Rename a tag | Rename globally from the tag pane. |
| Merge similar tags | Pick the canonical tag from [[Tag Taxonomy]]. |
| Audit tags | Open [[Tag Catalog]] after changes. |
| Filter graph | Use canonical area and object tags. |

## Safe Plugin Boundaries

> [!danger] Do not make core documentation depend on one plugin
> Dataview catalogs are helpful, but every critical workflow should still be reachable through ordinary wikilinks from [[00 - Home]] and [[Component Map]].

## Backlinks

Related notes: [[00 - Home]], [[Tag Catalog]], [[Tag Taxonomy]], [[Script Catalog]], [[Graph View Guide]].

