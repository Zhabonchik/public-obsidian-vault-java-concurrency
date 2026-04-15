---
tags: [vscode, extension, commands, installation]
type: tool
related:
  - "[[03 - CLI (VizzyCode.Cli)]]"
  - "[[06 - Juno Live Bridge]]"
  - "[[13 - Recommended Workflows]]"
status: active
---

# VS Code Extension

The VS Code extension provides command palette, explorer, and editor-title actions around `VizzyCode.Cli` and the Juno Live Bridge. #vscode #extension

> [!info] Implementation file
> The extension logic lives in `vscode-extension/extension.js`, with command metadata in `vscode-extension/package.json`.

## Commands

| Command | Description |
|---|---|
| `VizzyCode: Import XML to Code` | Convert selected XML into `.vizzy.cs` plus sidecar. |
| `VizzyCode: Export Code to XML` | Convert `.vizzy.cs` to XML through CLI validation. |
| `VizzyCode: Round-Trip XML` | Run XML -> code -> XML and report the result. |
| `VizzyCode: Connect to Juno` | Check bridge status. |
| `VizzyCode: Import Vizzy from Running Game` | Read Vizzy XML from a selected part through the bridge. |
| `VizzyCode: Export Vizzy to Running Game` | Send generated XML to a selected part through the bridge. |
| `VizzyCode: Browse Craft Parts in Juno` | List current craft parts. |
| `VizzyCode: View Stages in Juno` | Inspect stage and activation group metadata. |
| `VizzyCode: Save Juno Telemetry JSON` | Save live telemetry JSON. |
| `VizzyCode: Save Full Juno Craft Snapshot JSON` | Save full craft snapshot JSON. |
| `VizzyCode: Save Juno Telemetry Report for Humans/AI` | Save readable telemetry report Markdown. |
| `VizzyCode: Save Full Juno Craft Report for Humans/AI` | Save readable craft report Markdown. |

## Installation

Recommended installer:

```powershell
.\scripts\install-vscode-integration.ps1
```

The script performs the full workflow:

| Step | Result |
|---|---|
| Publish CLI | Bundled command-line converter for the extension. |
| Prepare extension folder | `vscode-extension-dist` with extension files and CLI. |
| Package VSIX | Installable extension artifact. |
| Install extension | Commands become available in VS Code. |

## Generated Artifacts

| Artifact | Purpose |
|---|---|
| `vscode-extension-dist\` | Self-contained extension distribution folder. |
| `.vsix` package | Installable VS Code extension package. |
| Bundled CLI | Converter executable used by extension commands. |

## Manual VSIX Installation

```powershell
code --install-extension ".\vizzycode-tools.vsix"
```

Reload VS Code after installation:

```powershell
code --reuse-window .
```

> [!tip] Command discovery
> Open the Command Palette and search for `VizzyCode`. Also check context menus on `.xml` and `.cs` files.

## Restricted Mode / Workspace Trust

The extension declares support for untrusted workspaces. Commands should remain visible in restricted mode, but command behavior still depends on local CLI availability and file access.

> [!warning] Local tools still matter
> Restricted Mode support does not replace the need for a valid CLI path, readable inputs, and writable output folders.

## Troubleshooting

> [!bug] Commands do not appear
> Confirm the extension is installed and enabled, reload the VS Code window, and search the Command Palette for `VizzyCode`.

> [!bug] Export command fails
> Run the same file through [[03 - CLI (VizzyCode.Cli)#Export]] and read validator output from [[04 - Export Validation]].

> [!bug] Juno commands fail
> Check [[06 - Juno Live Bridge#Endpoint Reference]], verify the mod is running, and confirm `GET /status` responds.

<details>
<summary>Extension checklist</summary>

- [ ] Run the integration installer.
- [ ] Reload VS Code.
- [ ] Verify `VizzyCode` commands appear.
- [ ] Test CLI import/export on a small XML file.
- [ ] Test bridge status before importing from the running game.

</details>

## Backlinks

Related notes: [[03 - CLI (VizzyCode.Cli)]], [[04 - Export Validation]], [[06 - Juno Live Bridge]], [[08 - AI Integration]], [[13 - Recommended Workflows]], [[14 - Troubleshooting]].








