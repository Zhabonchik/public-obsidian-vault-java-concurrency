---
tags: [workflow, process, steps, roundtrip]
type: workflow
related:
  - "[[03 - CLI (VizzyCode.Cli)]]"
  - "[[04 - Export Validation]]"
  - "[[14 - Troubleshooting]]"
status: active
---

# Recommended Workflows

Use these workflows to keep source-of-truth, sidecar, raw preservation, validation, and Juno testing clear. #workflow #roundtrip

> [!info] First decision
> Decide whether the source of truth is the original Juno XML or the current `.vizzy.cs`.

## Workflow A Existing Juno XML

```mermaid
flowchart TD
    A[Original XML from Juno] --> B[CLI import]
    B --> C[Clean-view .vizzy.cs]
    B --> D[.vizzy.meta.json sidecar]
    C --> E[Edit intentionally]
    D --> F[Restore exact metadata]
    E --> F
    F --> G[Export XML]
    G --> H[Validate]
    H --> I[Roundtrip compare]
    I --> J[Test in Juno]
```

- [ ] Import XML with `VizzyCode.Cli import`.
- [ ] Keep `.vizzy.meta.json` beside `.vizzy.cs`.
- [ ] Identify preserved anchors or hidden sidecar boundaries.
- [ ] Edit only the intended region.
- [ ] Export with validation.
- [ ] Run `roundtrip` if fidelity is required.
- [ ] Test generated XML in Juno.

> [!tip] Preserve before rewriting
> If a region still maps to imported XML, prefer preserving it unless there is a clear reason to author it anew.

## Workflow B New Script From Scratch

```mermaid
flowchart TD
    A[New .vizzy.cs] --> B[Use safe authoring syntax]
    B --> C[Add VZPOS to top-level blocks]
    C --> D[Export with CLI or app]
    D --> E[Validate]
    E --> F[Test XML in Juno]
    F --> G[Promote as example if stable]
```

- [ ] Start from [[10 - Vizzy Authoring Guide]].
- [ ] Use normal authoring syntax before raw preservation.
- [ ] Add `// VZPOS x=N y=N` before top-level authored blocks.
- [ ] Export with [[03 - CLI (VizzyCode.Cli)#Export]].
- [ ] Fix every validation error.
- [ ] Test in Juno.
- [ ] Save working XML as a reference if it becomes reusable.

## Workflow C Deep Edit Of Imported XML

```mermaid
flowchart TD
    A[Imported .vizzy.cs plus sidecar] --> B{Region type}
    B -->|Preserved| C[Keep anchors / sidecar metadata]
    B -->|Rewritten| D[Treat as authoring code]
    C --> E[Minimal edit]
    D --> F[Use safe authoring patterns]
    E --> G[Export]
    F --> G
    G --> H[Validate]
    H --> I[Compare with working examples]
```

- [ ] Mark which regions are preserved imported XML.
- [ ] Mark which regions are intentionally rewritten authoring code.
- [ ] Do not remove `RawXml*` unless the replacement is proven safe.
- [ ] Decode `Raw*` payloads before editing.
- [ ] Validate after each focused change.
- [ ] Compare generated XML with working examples for the same pattern.

> [!warning] Mixed-region files
> Large missions can contain both preserved and rewritten regions. Debug the exact region, not the whole file at once.

<details>
<summary>Universal pre-export checklist</summary>

- [ ] Source of truth is known.
- [ ] Sidecar presence is known.
- [ ] `VZPOS` exists for authored top-level blocks.
- [ ] Raw fragments have been inspected if edited.
- [ ] Export validation passes.
- [ ] Juno test is planned for important scripts.

</details>

## Backlinks

Related notes: [[00 - Home]], [[03 - CLI (VizzyCode.Cli)]], [[04 - Export Validation]], [[05 - Raw Preservation]], [[08 - AI Integration]], [[14 - Troubleshooting]].




