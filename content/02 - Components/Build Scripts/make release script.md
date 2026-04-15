---
tags: [release, powershell, build, script]
type: script
file: _make_release_062.ps1
related:
  - "[[VizzyCode.csproj]]"
  - "[[VizzyCode.Cli.csproj]]"
  - "[[install-vscode-integration.ps1]]"
status: active
---

# make release script

`_make_release_062.ps1` is a repository helper for release-oriented build work. Document it as a build orchestration script rather than as application behavior. #build #powershell

## Responsibilities

| Area | Behavior |
|---|---|
| Build orchestration | Groups release-oriented build steps. |
| Packaging support | Works alongside desktop, CLI, and extension publish commands. |
| Maintenance | Provides a repeatable script entry point for repository packaging tasks. |

> [!note] Naming
> The note intentionally uses a descriptive title instead of mirroring the exact helper filename as a graph hub.

## Backlinks

Related notes: [[Component Map]], [[VizzyCode.csproj]], [[VizzyCode.Cli.csproj]], [[07 - VS Code Extension]].



