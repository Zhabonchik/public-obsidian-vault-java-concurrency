---
tags: [tags, taxonomy, tag-wrangler, catalog]
type: taxonomy
related:
  - "[[Tag Catalog]]"
  - "[[Graph View Guide]]"
  - "[[Obsidian Plugin Workflows]]"
status: active
---

# Tag Taxonomy

This note defines the canonical tag vocabulary for the VizzyCode vault. Use it with Tag Wrangler to rename, merge, and keep tags consistent. #tags #tag-wrangler

> [!tip] Tag Wrangler workflow
> Rename tags from the tag pane instead of editing one file at a time. After a rename, open [[Tag Catalog]] to confirm the new vocabulary is coherent.

## Canonical Area Tags

| Tag | Use | Main note |
|---|---|---|
| `#architecture` | Project structure and dependency maps. | [[01 - Project Architecture]] |
| `#components` | Script-level component documentation. | [[Component Map]] |
| `#converter` | Conversion engine details. | [[VizzyXmlConverter.cs]] |
| `#validation` | Export validator and safety checks. | [[04 - Export Validation]] |
| `#raw` | Raw preservation and exact XML fragments. | [[05 - Raw Preservation]] |
| `#bridge` | Juno live bridge and HTTP integration. | [[06 - Juno Live Bridge]] |
| `#vscode` | VS Code extension workflow. | [[07 - VS Code Extension]] |
| `#ai` | AI context and provider integration. | [[08 - AI Integration]] |
| `#juno` | Juno game and mod integration. | [[09 - Juno Mod (Mod Assets)]] |
| `#authoring` | `.vizzy.cs` authoring rules. | [[10 - Vizzy Authoring Guide]] |
| `#troubleshooting` | Debugging and recovery. | [[14 - Troubleshooting]] |

## Canonical Object Tags

| Tag | Use |
|---|---|
| `#script` | A note documenting a source script. |
| `#project-file` | A note documenting a project file. |
| `#manifest` | A note documenting manifest metadata. |
| `#example` | A note documenting an example script. |
| `#workflow` | A process-oriented note. |
| `#reference` | A stable reference note. |
| `#catalog` | A navigation or Dataview catalog note. |
| `#template` | A reusable note template. |

## Tags To Avoid

| Avoid | Use instead | Reason |
|---|---|---|
| `#misc` | A specific area tag | Too vague for graph filtering. |
| `#notes` | `#reference` or `#catalog` | Adds no useful meaning. |
| `#code` | `#script` or `#converter` | Too broad. |
| `#error` | `#troubleshooting` or `#validation` | Prefer action-oriented tags. |
| One-off personal tags | Existing canonical tags | Keeps Tag Wrangler cleanup simple. |

## Optional Hierarchy

If you want more structured filtering, Tag Wrangler can rename flat tags into nested tags:

| Flat tag | Nested option |
|---|---|
| `#converter` | `#area/converter` |
| `#validation` | `#area/validation` |
| `#script` | `#object/script` |
| `#workflow` | `#object/workflow` |
| `#vscode` | `#surface/vscode` |
| `#bridge` | `#surface/bridge` |

> [!warning] Rename carefully
> Do nested tag migration in one pass and then refresh [[Tag Catalog]]. Mixing flat and nested forms creates noisy graph filters.

## Backlinks

Related notes: [[Tag Catalog]], [[Script Catalog]], [[Graph View Guide]], [[Obsidian Plugin Workflows]].

