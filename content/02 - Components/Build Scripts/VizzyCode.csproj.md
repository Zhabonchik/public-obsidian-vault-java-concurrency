---
tags: [desktop, csproj, build, project-file]
type: project-file
file: VizzyCode.csproj
related:
  - "[[01 - Project Architecture]]"
  - "[[Program.cs]]"
  - "[[MainForm.cs]]"
status: active
---

# VizzyCode.csproj

`VizzyCode.csproj` defines the desktop Windows Forms application project. It compiles the app source while excluding CLI files, mod assets, generated output, examples, and `.vizzy.cs` DSL files. #build #desktop

## Responsibilities

| Area | Behavior |
|---|---|
| App type | Configures a WinForms executable. |
| Framework | Targets Windows desktop runtime support. |
| Assembly metadata | Sets name, namespace, version metadata, author, description, and icon. |
| Compilation boundaries | Excludes examples, mod assets, CLI project, generated output, and sidecars. |

## Build Commands

```powershell
dotnet build VizzyCode.csproj -c Release
dotnet publish VizzyCode.csproj -c Release -r win-x64 -p:PublishSingleFile=true --self-contained true
```

> [!warning] DSL exclusion
> `*.vizzy.cs` files are intentionally excluded because they are converter input files, not desktop app source files.

## Backlinks

Related notes: [[Component Map]], [[01 - Project Architecture]], [[Program.cs]], [[MainForm.cs]].



