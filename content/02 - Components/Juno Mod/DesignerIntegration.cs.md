---
tags: [juno, mod, designer, script]
type: script
file: Mod Assets/Scripts/VizzyCode/DesignerIntegration.cs
related:
  - "[[VizzyBridge.cs]]"
  - "[[CraftInfo.cs]]"
  - "[[06 - Juno Live Bridge]]"
status: active
---

# DesignerIntegration.cs

`DesignerIntegration.cs` provides bridge access to Juno designer-scene data, including craft parts and Vizzy program import/export operations before flight. #designer #juno

## Responsibilities

| Area | Behavior |
|---|---|
| Designer craft access | Finds and reads the currently loaded craft in the designer. |
| Part selection | Supports part lookup for Vizzy import/export. |
| Vizzy data | Reads or writes Vizzy XML on compatible parts. |
| Bridge support | Supplies designer-mode data to [[VizzyBridge.cs]]. |

> [!tip] Designer context
> Designer data is structural craft data, not active flight telemetry. Use [[06 - Juno Live Bridge#Scene Awareness]] when interpreting it.

## Backlinks

Related notes: [[Component Map]], [[06 - Juno Live Bridge]], [[VizzyBridge.cs]], [[CraftInfo.cs]].



