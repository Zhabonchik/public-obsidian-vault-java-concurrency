---
tags: [cli, commands, terminal]
type: tool
related:
  - "[[02 - Conversion Engine (VizzyXmlConverter)]]"
  - "[[04 - Export Validation]]"
  - "[[05 - Raw Preservation]]"
status: active
---

# CLI: VizzyCode.Cli

`VizzyCode.Cli` is the standalone automation interface for conversion, round-trip checks, and raw payload inspection. The VS Code extension uses this same tool for import/export behavior. #cli #terminal

> [!info] Shared core
> CLI commands use `VizzyXmlConverter`, `CodeCleanView`, and `VizzyExportValidator`, so CLI behavior should match the desktop and VS Code export path.

> [!warning] Export can fail by design
> `export` and `roundtrip` run validation before accepting generated XML. Treat validation errors as useful diagnostics.

## Command Table

| Command | Arguments | Description | Example |
|---|---|---|---|
| `import` | `<input.xml> [-o output.vizzy.cs]` | Converts XML or craft XML into clean-view `.vizzy.cs` plus sidecar. | `VizzyCode.Cli.exe import "mission.xml" -o "mission.vizzy.cs"` |
| `export` | `<input.vizzy.cs> [-o output.xml] [-n programName]` | Restores sidecar metadata if present, converts code to XML, validates, writes XML. | `VizzyCode.Cli.exe export "mission.vizzy.cs" -o "mission.xml"` |
| `roundtrip` | `<input.xml> [-o output.xml] [-c output.vizzy.cs]` | Runs XML -> code -> XML and reports byte equality. | `VizzyCode.Cli.exe roundtrip "mission.xml" -o "_rt.xml" -c "_rt.vizzy.cs"` |
| `raw-encode` | `<input.xml> [-o output.txt]` | Converts one XML element into `Raw*` and `RawXml*` forms. | `VizzyCode.Cli.exe raw-encode "snippet.xml" -o "raw-snippet.txt"` |
| `raw-decode` | `<input.txt|payload|call> [-o output.xml]` | Decodes base64, `Raw*`, `RawXml*`, or XML text back to XML. | `VizzyCode.Cli.exe raw-decode "Vz.RawEval(\"...\")" -o "decoded.xml"` |

## Import

```powershell
dotnet run --project VizzyCode.Cli\VizzyCode.Cli.csproj -- import "input.xml" -o "output.vizzy.cs"
```

```powershell
VizzyCode.Cli.exe import "Vizzy examples\orbiting maybe.xml" -o "orbiting maybe.vizzy.cs"
```

Output:

| File | Purpose |
|---|---|
| `output.vizzy.cs` | Clean visible code. |
| `output.vizzy.meta.json` | Sidecar with exact imported metadata. |

> [!tip] Imported missions
> Keep the sidecar beside the `.vizzy.cs` if fidelity matters. See [[02 - Conversion Engine (VizzyXmlConverter)#Clean View And Sidecar]].

## Export

```powershell
dotnet run --project VizzyCode.Cli\VizzyCode.Cli.csproj -- export "input.vizzy.cs" -o "output.xml"
```

```powershell
dotnet run --project VizzyCode.Cli\VizzyCode.Cli.csproj -- export "input.vizzy.cs" -o "output.xml" -n "ProgramName"
```

```powershell
VizzyCode.Cli.exe export "Vizzy examples\Auto Orbit authoring-safe.cs" -o "autorbit.xml"
```

> [!danger] Validation note
> The CLI blocks export when [[04 - Export Validation]] reports structural errors. Fix the reported XML shape before testing in Juno.

## Roundtrip

```powershell
dotnet run --project VizzyCode.Cli\VizzyCode.Cli.csproj -- roundtrip "input.xml" -o "roundtrip.xml" -c "roundtrip.vizzy.cs"
```

```powershell
VizzyCode.Cli.exe roundtrip "Vizzy examples\T.T. Mission Program.xml" -o "_tt_rt.xml" -c "_tt_rt.vizzy.cs"
```

| Result | Meaning |
|---|---|
| `same_bytes=true` | The generated XML bytes match the input XML bytes. |
| `same_bytes=false` | The command succeeded but exact byte equality was not achieved. |
| Validation failure | XML generation produced a shape blocked by the validator. |

> [!note] Byte equality
> Byte equality is most important for imported fidelity work. For deliberately rewritten authoring regions, structural correctness and Juno loading may matter more than exact byte equality.

## Raw Encode

```powershell
dotnet run --project VizzyCode.Cli\VizzyCode.Cli.csproj -- raw-encode "snippet.xml"
dotnet run --project VizzyCode.Cli\VizzyCode.Cli.csproj -- raw-encode "snippet.xml" -o "raw-snippet.txt"
```

The output includes the detected element kind, a base64 payload, a `Vz.Raw*` call, and a readable `Vz.RawXml*` call.

## Raw Decode

```powershell
dotnet run --project VizzyCode.Cli\VizzyCode.Cli.csproj -- raw-decode "Vz.RawEval(\"...\")" -o "decoded.xml"
dotnet run --project VizzyCode.Cli\VizzyCode.Cli.csproj -- raw-decode "raw-snippet.txt" -o "decoded.xml"
```

Accepted sources:

| Source | Example |
|---|---|
| File | `raw-snippet.txt` |
| Base64 payload | `PEV2...` |
| `Raw*` call | `Vz.RawEval("PEV2...")` |
| `RawXml*` call | `Vz.RawXmlEval(@"<EvaluateExpression ... />")` |
| XML text | `<Constant text="E" />` |

## Build And Publish

```powershell
dotnet build VizzyCode.Cli\VizzyCode.Cli.csproj -c Release
```

```powershell
dotnet publish VizzyCode.Cli\VizzyCode.Cli.csproj -c Release -r win-x64 -p:PublishSingleFile=true --self-contained true -o publish_cli_win64
```

## Relationship To VS Code

| VS Code command | CLI behavior |
|---|---|
| `VizzyCode: Import XML to Code` | `import` |
| `VizzyCode: Export Code to XML` | `export` |
| `VizzyCode: Round-Trip XML` | `roundtrip` |
| Live Juno commands | Bridge call plus conversion where needed |

See [[07 - VS Code Extension#Commands]].

<details>
<summary>CLI checklist</summary>

- [ ] Confirm the input file is the intended source of truth.
- [ ] Keep sidecars with imported `.vizzy.cs` files.
- [ ] Run `export` before testing authored changes in Juno.
- [ ] Use `roundtrip` for imported XML fidelity checks.
- [ ] Use `raw-decode` before editing opaque raw payloads.

</details>

## Backlinks

Related notes: [[01 - Project Architecture]], [[02 - Conversion Engine (VizzyXmlConverter)]], [[04 - Export Validation]], [[05 - Raw Preservation]], [[07 - VS Code Extension]], [[13 - Recommended Workflows]].








