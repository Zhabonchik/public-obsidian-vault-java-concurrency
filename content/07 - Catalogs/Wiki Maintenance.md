---
tags: [maintenance, obsidian, graph, catalog]
type: workflow
related:
  - "[[Graph View Guide]]"
  - "[[Tag Taxonomy]]"
  - "[[Component Template]]"
status: active
---

# Wiki Maintenance

Use this workflow when adding scripts, moving notes, or cleaning the graph. #maintenance #obsidian

## Add A New Script Note

- [ ] Create the note under the right folder in `02 - Components`.
- [ ] Use [[Component Template]] as the structure.
- [ ] Add `type: script`, `type: project-file`, or `type: manifest`.
- [ ] Add canonical tags from [[Tag Taxonomy]].
- [ ] Link it from [[Component Map]].
- [ ] Link it to at least one guide or workflow.
- [ ] Check [[Script Catalog]] after saving.

## Rename Or Move Notes

- [ ] Use Obsidian rename when possible so wikilinks update automatically.
- [ ] Search for the old title after moving.
- [ ] Avoid creating generic graph nodes.
- [ ] Re-run a missing-link check.
- [ ] Open [[Graph View Guide]] and verify the hub structure still makes sense.

## Review Queues

```dataview
TABLE type AS "Type", status AS "Status", related AS "Related"
FROM "VizzyCode"
WHERE !status OR !type
SORT file.name ASC
```

```dataview
TASK
FROM "VizzyCode"
WHERE !completed
SORT file.name ASC
```

## Backlinks

Related notes: [[Graph View Guide]], [[Tag Taxonomy]], [[Script Catalog]], [[Component Template]].

