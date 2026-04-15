---
tags: [juno, mod, unity, script]
type: script
file: Mod Assets/Scripts/VizzyCode/VizzyCodeMod.cs
related:
  - "[[VizzyBridge.cs]]"
  - "[[VizzyCodeUpdater.cs]]"
  - "[[09 - Juno Mod (Mod Assets)]]"
status: active
---

# VizzyCodeMod.cs

`VizzyCodeMod.cs` is the Juno mod entry point. It owns mod lifecycle setup and connects the runtime mod container to bridge and update-loop behavior. #juno #unity

## Responsibilities

| Area | Behavior |
|---|---|
| Mod startup | Initializes VizzyCode mod behavior in Juno. |
| Bridge lifecycle | Starts or connects [[VizzyBridge.cs]]. |
| Update loop | Coordinates with [[VizzyCodeUpdater.cs]]. |
| Runtime ownership | Establishes the mod-level container for bridge features. |

## Backlinks

Related notes: [[Component Map]], [[09 - Juno Mod (Mod Assets)]], [[VizzyBridge.cs]], [[VizzyCodeUpdater.cs]].



