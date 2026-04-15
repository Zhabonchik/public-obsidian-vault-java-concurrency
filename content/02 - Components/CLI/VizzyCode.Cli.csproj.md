---
tags: [cli, csproj, build, script]
type: project-file
file: VizzyCode.Cli/VizzyCode.Cli.csproj
related:
  - "[[CLI Program.cs]]"
  - "[[03 - CLI (VizzyCode.Cli)]]"
  - "[[install-vscode-integration.ps1]]"
status: active
---

# VizzyCode.Cli.csproj

`VizzyCode.Cli.csproj` defines the standalone CLI project used for automation and VS Code integration. #cli #build

## Responsibilities

| Area | Behavior |
|---|---|
| Target runtime | Configures the CLI project target framework and build behavior. |
| Publish workflow | Supports single-file CLI publishing. |
| Extension support | Produces the executable bundled by [[install-vscode-integration.ps1]]. |

## Build Commands

```powershell
dotnet build VizzyCode.Cli\VizzyCode.Cli.csproj -c Release
dotnet publish VizzyCode.Cli\VizzyCode.Cli.csproj -c Release -r win-x64 -p:PublishSingleFile=true --self-contained true -o publish_cli_win64
```

## Backlinks

Related notes: [[Component Map]], [[CLI Program.cs]], [[03 - CLI (VizzyCode.Cli)]], [[07 - VS Code Extension]].



