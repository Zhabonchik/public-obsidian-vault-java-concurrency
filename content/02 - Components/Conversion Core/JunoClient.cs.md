---
tags: [bridge, http, client, script]
type: script
file: JunoClient.cs
related:
  - "[[MainForm.cs]]"
  - "[[06 - Juno Live Bridge]]"
  - "[[VizzyBridge.cs]]"
status: active
---

# JunoClient.cs

`JunoClient.cs` is the desktop app HTTP client for the Juno Live Bridge. It wraps bridge calls and parses the JSON responses needed by [[MainForm.cs]]. #bridge #http

## Responsibilities

| Area | Behavior |
|---|---|
| Connection status | Calls `/status`. |
| Craft data | Calls `/craft` and parses part lists. |
| Vizzy import/export | Reads and writes part Vizzy XML. |
| Stages | Reads stage metadata and triggers activation. |
| Diagnostics | Fetches telemetry and snapshot JSON. |
| DTOs | Defines `StatusInfo`, `PartInfo`, `CraftInfo`, `VizzyInfo`, and `StagesInfo`. |

## Bridge Call Map

```mermaid
graph LR
    A[JunoClient.cs] --> B[GET /status]
    A --> C[GET /craft]
    A --> D[GET /vizzy/{partId}]
    A --> E[PUT /vizzy/{partId}]
    A --> F[GET /stages]
    A --> G[GET /snapshot]
    A --> H[GET /telemetry]
```

> [!warning] Parser boundary
> This client uses lightweight response parsing for app needs. If bridge payloads become more complex, keep parsing changes aligned with [[JunoReportBuilder.cs]] and [[06 - Juno Live Bridge]].

## Backlinks

Related notes: [[Component Map]], [[MainForm.cs]], [[06 - Juno Live Bridge]], [[VizzyBridge.cs]].



