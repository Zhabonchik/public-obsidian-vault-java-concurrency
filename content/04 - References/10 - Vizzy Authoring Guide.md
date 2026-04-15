---
tags: [authoring, vizzy, dsl, syntax]
type: guide
related:
  - "[[02 - Conversion Engine (VizzyXmlConverter)]]"
  - "[[11 - Vizzy Blocks Reference]]"
  - "[[13 - Recommended Workflows]]"
status: active
---

# Vizzy Authoring Guide

The `.vizzy.cs` format is a C#-style domain-specific language used by VizzyCode to describe Juno Vizzy programs. It is designed for conversion, not for normal C# compilation in user projects. #authoring #vizzy #dsl

> [!info] Authoring target
> For new scripts, the target is `code -> XML recognized by Juno`. For imported scripts, the target can also include strict `XML -> code -> XML` fidelity.

## What Is The vizzy.cs DSL

`.vizzy.cs` looks like C#, but it can include VizzyCode-specific constructs:

| Construct | Example | Purpose |
|---|---|---|
| Program init | `Vz.Init("Mission")` | Program name and setup. |
| Event blocks | `using (new OnStart()) { }` | Top-level Vizzy events. |
| Vizzy calls | `Vz.Display("Hello", 3);` | High-level instruction syntax. |
| Variable comments | `// var altitude = 0;` | Declares Vizzy variables. |
| Preservation anchors | `// VZEL ...` | Imported XML fidelity. |
| Raw XML | `Vz.RawXmlEval(@"<EvaluateExpression ... />")` | Exact fragment preservation. |
| Layout hints | `// VZPOS x=1200 y=-300` | Top-level block position metadata. |

> [!warning] Not ordinary C#
> Do not judge `.vizzy.cs` by whether it compiles as a normal application file. Judge it by whether VizzyCode exports valid Juno XML.

## Safe Authoring Subset

| Pattern | Safe form |
|---|---|
| Program setup | `Vz.Init("Program Name");` |
| Start event | `using (new OnStart()) { ... }` |
| End event | `using (new OnEnd()) { ... }` |
| Message event | `using (new OnReceiveMessage("name")) { ... }` |
| Display | `Vz.Display("Text", 3);` |
| Flight log | `Vz.FlightLog("Text", true);` |
| Wait until | `using (new WaitUntil(condition)) { }` |
| Craft input | `Vz.SetInput(CraftInput.Throttle, 1);` |
| Variables | `// var name = 0;` plus assignments in code |
| Layout | `// VZPOS x=N y=N` before top-level authored blocks |

```csharp
Vz.Init("Demo");

// VZPOS x=0 y=0
using (new OnStart())
{
    Vz.Display("Ready", 3);
    Vz.SetInput(CraftInput.Throttle, 1);
}

Console.WriteLine(Vz.context.currentProgram.Serialize().ToString());
```

## Event Handler Syntax

| Code form | Juno event |
|---|---|
| `OnStart()` or `Vz.OnStart()` | `FlightStart` |
| `OnEnd()` or `Vz.OnEnd()` | `FlightEnd` |
| `OnReceiveMessage("name")` | `ReceiveMessage` |
| `OnDocked()` | `Docked` |
| `OnChangeSoi()` | `ChangeSoi` |
| `OnPartCollision("part")` | `PartCollision` |
| `OnPartExplode("part")` | `PartExplode` |
| `On("eventName")` | Custom event name |

## Unsafe Or Sensitive Patterns

| Pattern | Why it is sensitive | Safer approach |
|---|---|---|
| Removing `VZEL` from imported regions | Changes preserved XML into authored XML. | Rewrite only the intended region. |
| Deleting `.vizzy.meta.json` | Hides exact import metadata from export. | Keep sidecar with imported files. |
| New top-level blocks without `VZPOS` | Can fail validation due missing `pos`. | Add layout hints. |
| Replacing `RawXml*` with cleaner code blindly | Logical equivalence may not preserve XML shape. | Decode/inspect and verify export. |
| Inventing custom block headers | `callFormat`, `format`, `name`, and `pos` are required. | Copy shapes from working examples. |
| Large global rewrites | Mixed missions need local reasoning. | Fix one region at a time. |

> [!danger] Mixed mission caution
> A file can contain preserved imported regions and handwritten authoring regions at the same time. Use [[08 - AI Integration#Repair Rules For AI]] before asking an AI to modify it.

## Example Files

| File | Type | Description |
|---|---|---|
| `Altair Alphard Vizzy.vizzy.cs` | Imported clean view | Real imported Vizzy program with matching sidecar. |
| `Altair Basic Function.vizzy.cs` | Imported clean view | Smaller imported function-style example. |
| `MFD Default.vizzy.cs` | Imported clean view | MFD-related behavior and UI blocks. |
| `T.T. Mission Program.vizzy.cs` | Mission-scale imported file | Complex and fidelity-sensitive. |
| `Universal Vizzy Mission 2.vizzy.cs` | Imported mission example | Universal mission logic with sidecar. |

<details>
<summary>Authoring checklist</summary>

- [ ] Start from a known-good pattern.
- [ ] Use normal authoring syntax first.
- [ ] Add `VZPOS` for new top-level blocks.
- [ ] Use `RawXml*` only when exact XML shape matters.
- [ ] Export with [[03 - CLI (VizzyCode.Cli)#Export]].
- [ ] Validate with [[04 - Export Validation]].

</details>

## Backlinks

Related notes: [[02 - Conversion Engine (VizzyXmlConverter)]], [[04 - Export Validation]], [[05 - Raw Preservation]], [[11 - Vizzy Blocks Reference]], [[12 - Project Examples]], [[13 - Recommended Workflows]].




