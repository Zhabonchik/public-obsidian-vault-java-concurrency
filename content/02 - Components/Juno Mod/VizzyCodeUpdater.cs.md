---
tags: [juno, mod, unity, update-loop, script]
type: script
file: Mod Assets/Scripts/VizzyCode/VizzyCodeUpdater.cs
related:
  - "[[VizzyCodeMod.cs]]"
  - "[[VizzyBridge.cs]]"
  - "[[CraftInfo.cs]]"
status: active
---

# VizzyCodeUpdater.cs

`VizzyCodeUpdater.cs` supports runtime update-loop behavior for the Juno mod. It keeps bridge-relevant runtime state fresh while the game is running. #juno #update-loop

## Responsibilities

| Area | Behavior |
|---|---|
| Update loop | Runs periodic mod-side update logic. |
| Runtime state | Helps keep scene and craft state available to the bridge. |
| Bridge support | Works with [[VizzyBridge.cs]] and [[CraftInfo.cs]]. |

## Backlinks

Related notes: [[Component Map]], [[09 - Juno Mod (Mod Assets)]], [[VizzyCodeMod.cs]], [[VizzyBridge.cs]].



