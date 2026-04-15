---
tags: [tags, dataview, catalog]
type: catalog
related:
  - "[[00 - Home]]"
  - "[[13 - Recommended Workflows]]"
  - "[[14 - Troubleshooting]]"
status: active
---

# Tag Catalog

This catalog uses Dataview to list notes in the `VizzyCode` folder by tags and note type. #tags #catalog

> [!info] Dataview catalog
> Use this page when browsing the wiki by topic instead of by numbered workflow.

```dataview
TABLE file.tags AS "Tags", type AS "Type", status AS "Status"
FROM "VizzyCode"
WHERE file.tags
SORT file.name ASC
```

## Core Tags

| Tag | Meaning | Entry point |
|---|---|---|
| `#architecture` | Project structure and components. | [[01 - Project Architecture]] |
| `#conversion` | XML/code conversion behavior. | [[02 - Conversion Engine (VizzyXmlConverter)]] |
| `#cli` | Command-line workflows. | [[03 - CLI (VizzyCode.Cli)]] |
| `#validation` | Export validator rules. | [[04 - Export Validation]] |
| `#raw` | Raw preservation and exact XML fragments. | [[05 - Raw Preservation]] |
| `#bridge` | Juno live bridge. | [[06 - Juno Live Bridge]] |
| `#vscode` | VS Code extension workflow. | [[07 - VS Code Extension]] |
| `#ai` | AI context and provider integration. | [[08 - AI Integration]] |
| `#authoring` | Safe `.vizzy.cs` authoring. | [[10 - Vizzy Authoring Guide]] |
| `#troubleshooting` | Failure diagnosis. | [[14 - Troubleshooting]] |

## Related Catalogs

| Catalog | Use |
|---|---|
| [[Script Catalog]] | Browse script-level component notes. |
| [[Tag Taxonomy]] | Canonical tag vocabulary for Tag Wrangler. |
| [[Graph View Guide]] | Graph cleanup and wikilink naming rules. |
| [[Obsidian Plugin Workflows]] | Plugin usage rules for Dataview, Advanced Tables, and Tag Wrangler. |
| [[Wiki Maintenance]] | Ongoing maintenance checklists. |

## Backlinks

Related notes: [[00 - Home]], [[01 - Project Architecture]], [[13 - Recommended Workflows]], [[14 - Troubleshooting]], [[Tag Taxonomy]].




