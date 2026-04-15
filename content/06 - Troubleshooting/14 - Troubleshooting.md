---
tags: [errors, debug, troubleshooting, juno]
type: troubleshooting
related:
  - "[[04 - Export Validation]]"
  - "[[06 - Juno Live Bridge]]"
  - "[[13 - Recommended Workflows]]"
status: active
---

# Troubleshooting

This page groups common VizzyCode failures by symptom, cause, and first fix. #troubleshooting #debug

> [!info] Debug order
> Start with export validation, then source-of-truth, then sidecar/anchors, then Juno bridge state.

## Common Errors

| Error | Cause | Solution |
|---|---|---|
| Juno does not show the program | XML structure is invalid or top-level metadata is incomplete. | Run [[04 - Export Validation]] and inspect top-level blocks. |
| Export validation fails | Known invalid XML shape was generated. | Fix the exact reported rule first. |
| Roundtrip is not identical | Formatting, metadata, or structure changed. | Check sidecar, anchors, raw fragments, and byte comparison context. |
| Bridge does not connect | Mod is not running, scene unavailable, or port unreachable. | Check `GET /status` and [[06 - Juno Live Bridge]]. |
| VS Code commands do not appear | Extension not installed/enabled or window not reloaded. | See [[07 - VS Code Extension#Troubleshooting]]. |
| Raw payload is unclear | Base64 payload hides XML. | Use [[03 - CLI (VizzyCode.Cli)#Raw Decode]]. |
| Custom block fails | Missing `callFormat`, `format`, `name`, or `pos`. | Compare with working XML and validate. |

## Juno Does Not Load The XML

> [!bug] Symptom
> The XML file exists, but Juno does not display the Vizzy program as expected.

Check in this order:

1. Run CLI export and read validation output.
2. Confirm root is `<Program>`.
3. Confirm at least one top-level `<Instructions>` block exists.
4. Check top-level `Event`, `CustomInstruction`, `CustomExpression`, and `Comment` metadata.
5. Check else encoding.
6. Check raw fragments that were edited.
7. Compare against a working example from [[12 - Project Examples]].

## Export Validation Fails

> [!bug] Symptom
> Desktop app, CLI, or VS Code export blocks the save.

Use the rule table in [[04 - Export Validation#Validation Rules]]. Do not skip a validator failure to test in Juno; the validator is already identifying a known invalid class.

## Roundtrip Is Not Identical

> [!bug] Symptom
> `roundtrip` completes but reports `same_bytes=false`.

Possible causes:

| Cause | Check |
|---|---|
| Sidecar missing | Ensure `.vizzy.meta.json` exists. |
| Edited preserved line | Compare clean-view line against sidecar behavior. |
| Raw fragment changed | Decode and compare exact XML. |
| Formatting changed | Compare structural XML before assuming behavior changed. |
| Authored rewrite | Byte equality may no longer be the goal for that region. |

## Bridge Does Not Connect

> [!bug] Symptom
> Desktop or VS Code bridge commands fail.

Checklist:

- [ ] Juno is running.
- [ ] The VizzyCode mod is enabled.
- [ ] `GET /status` responds at `127.0.0.1:7842`.
- [ ] The active scene supports the requested operation.
- [ ] A craft is loaded for craft endpoints.
- [ ] A part with Vizzy is selected for import/export.

## VS Code Extension Does Not Appear

> [!bug] Symptom
> `VizzyCode` commands are missing from the Command Palette.

Checklist:

- [ ] Extension is installed.
- [ ] Extension is enabled.
- [ ] VS Code window has been reloaded.
- [ ] Command Palette search uses `VizzyCode`.
- [ ] CLI path setting is valid if using a custom path.

## AI Repair Goes In The Wrong Direction

> [!bug] Symptom
> AI changes look cleaner but exported XML still fails or fidelity gets worse.

Use [[08 - AI Integration#Context Bundles]]. Provide source-of-truth, original XML, `.vizzy.cs`, sidecar, validator output, and bridge reports when relevant.

<details>
<summary>Incident checklist</summary>

- [ ] Record the command or UI action that failed.
- [ ] Save validator output.
- [ ] Identify source of truth.
- [ ] Confirm sidecar state.
- [ ] Inspect raw fragments.
- [ ] Compare against a working example.
- [ ] Fix one issue and re-export.

</details>

## Backlinks

Related notes: [[03 - CLI (VizzyCode.Cli)]], [[04 - Export Validation]], [[05 - Raw Preservation]], [[06 - Juno Live Bridge]], [[07 - VS Code Extension]], [[13 - Recommended Workflows]].




