---
tags: [vscode, powershell, build, script]
type: script
file: scripts/install-vscode-integration.ps1
related:
  - "[[07 - VS Code Extension]]"
  - "[[VizzyCode.Cli.csproj]]"
  - "[[VS Code package.json]]"
status: active
---

# install-vscode-integration.ps1

`scripts/install-vscode-integration.ps1` is the repository-wide integration script for publishing the CLI, assembling the VS Code extension distribution, packaging the VSIX, and installing it into VS Code. #vscode #build

## Responsibilities

| Area | Behavior |
|---|---|
| CLI publish | Builds the standalone CLI for extension use. |
| Extension assembly | Copies extension files into the distribution folder. |
| VSIX packaging | Creates an installable VS Code extension package. |
| Local install | Installs the generated extension into VS Code. |

## Workflow

```mermaid
flowchart LR
    A[Publish CLI] --> B[Assemble extension dist]
    B --> C[Package VSIX]
    C --> D[Install in VS Code]
```

## Backlinks

Related notes: [[Component Map]], [[07 - VS Code Extension]], [[CLI Program.cs]], [[VS Code package.json]].



