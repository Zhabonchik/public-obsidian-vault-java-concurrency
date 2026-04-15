---
tags: [graph, obsidian, maintenance, catalog]
type: guide
related:
  - "[[00 - Home]]"
  - "[[Component Map]]"
  - "[[Tag Taxonomy]]"
status: active
---

# Graph View Guide

This guide keeps the Obsidian graph readable. The goal is to make meaningful project structure visible while avoiding accidental ghost nodes. #graph #obsidian

> [!info] Clean graph principle
> Every wikilink should point to a real note with an intentional name. Avoid generic names such as `index`, `todo`, `notes`, or `misc`.

## Naming Rules

| Rule | Good | Avoid |
|---|---|---|
| Use explicit catalog names | [[Tag Catalog]], [[Script Catalog]] | `index` |
| Use exact script note names | [[MainForm.cs]], [[VizzyXmlConverter.cs]] | `MainForm` if the script note is `MainForm.cs` |
| Keep guide names user-facing | [[04 - Export Validation]] | Internal shorthand without context |
| Prefer one hub per domain | [[Component Map]] | Many competing hub pages |

## Graph Filters

| Filter idea | Query |
|---|---|
| Component notes | `tag:#script OR tag:#project-file OR tag:#manifest` |
| Conversion core | `tag:#converter OR tag:#validation OR tag:#clean-view` |
| Live bridge | `tag:#bridge OR tag:#juno` |
| Troubleshooting | `tag:#troubleshooting OR tag:#validation` |
| Catalog pages | `tag:#catalog` |

## Cleanup Checklist

- [ ] Search for generic names such as `index`, `todo`, `misc`, and old note names.
- [ ] Run a missing-link check after moving notes between folders.
- [ ] Keep one explicit note per script.
- [ ] Keep old folder names out of wikilinks.
- [ ] Use [[Tag Taxonomy]] before adding new tags.
- [ ] Use [[Component Map]] as the central internal architecture hub.

## Dataview Link Check Pattern

Dataview cannot fully validate broken links by itself, but catalogs make them visible:

```dataview
TABLE type AS "Type", related AS "Related", file.tags AS "Tags"
FROM "VizzyCode"
SORT file.name ASC
```

## Backlinks

Related notes: [[00 - Home]], [[Component Map]], [[Tag Catalog]], [[Tag Taxonomy]], [[Obsidian Plugin Workflows]].
