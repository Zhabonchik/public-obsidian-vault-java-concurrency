---
tags: [scripts, components, dataview, catalog]
type: catalog
related:
  - "[[Component Map]]"
  - "[[01 - Project Architecture]]"
  - "[[Tag Taxonomy]]"
status: active
---

# Script Catalog

This catalog uses Dataview to keep the script-level documentation visible and sortable. It is the practical companion to [[Component Map]]. #scripts #components #catalog

> [!info] Use with Advanced Tables
> The static tables in component notes are intentionally simple Markdown tables so Advanced Tables can realign, sort, and edit them cleanly.

## All Script Notes

```dataview
TABLE file AS "Note", file AS "Path", tags AS "Tags", status AS "Status"
FROM "VizzyCode/02 - Components"
WHERE contains(["script", "project-file", "manifest", "example-script"], type)
SORT file.name ASC
```

## Runtime Scripts

```dataview
TABLE file AS "Note", tags AS "Tags"
FROM "VizzyCode/02 - Components"
WHERE type = "script"
SORT file.name ASC
```

## Example Scripts

```dataview
TABLE file AS "Note", file AS "Path", tags AS "Tags"
FROM "VizzyCode/02 - Components/Examples"
WHERE type = "example-script"
SORT file.name ASC
```

## Project And Manifest Files

```dataview
TABLE file AS "Note", type AS "Type", tags AS "Tags"
FROM "VizzyCode/02 - Components"
WHERE contains(["project-file", "manifest"], type)
SORT file.name ASC
```

## Manual Review Checklist

- [ ] Every source script has one explanatory note.
- [ ] Every component note links back to [[Component Map]].
- [ ] Every component note links to at least one guide, workflow, or troubleshooting page.
- [ ] Every component note has `tags`, `type`, `related`, and `status` frontmatter.

## Backlinks

Related notes: [[Component Map]], [[Tag Catalog]], [[Tag Taxonomy]], [[Graph View Guide]].

