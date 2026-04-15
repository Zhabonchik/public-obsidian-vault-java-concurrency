---
tags: [vscode, powershell, installation, script]
type: script
file: vscode-extension/install.ps1
related:
  - "[[VS Code package.json]]"
  - "[[extension.js]]"
  - "[[07 - VS Code Extension]]"
status: active
---

# vscode-extension install.ps1

`vscode-extension/install.ps1` is the extension-local install helper. It belongs to the VS Code extension folder and supports extension installation workflows. #vscode #powershell

## Responsibilities

| Area | Behavior |
|---|---|
| Local install support | Helps install the extension package from the extension directory. |
| Developer workflow | Complements the repository-wide [[install-vscode-integration.ps1]] script. |
| VS Code integration | Works with the extension manifest and bundled files. |

> [!tip] Preferred broad installer
> For the full CLI publish plus extension packaging workflow, use [[install-vscode-integration.ps1]].

## Backlinks

Related notes: [[Component Map]], [[07 - VS Code Extension]], [[VS Code package.json]].



