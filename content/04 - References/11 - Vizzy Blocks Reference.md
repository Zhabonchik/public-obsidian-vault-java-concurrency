---
tags: [blocks, vizzy, reference, instructions, expressions]
type: reference
related:
  - "[[10 - Vizzy Authoring Guide]]"
  - "[[02 - Conversion Engine (VizzyXmlConverter)]]"
  - "[[04 - Export Validation]]"
status: active
---

# Vizzy Blocks Reference

This note is a practical reference for the Vizzy block families supported by VizzyCode. It focuses on how blocks appear in `.vizzy.cs`, how they map to XML, and where Juno compatibility is sensitive. #blocks #reference

> [!info] Scope
> This is a project support reference, not a claim that every possible Juno block is documented. Use the repository docs and examples when a block shape is unclear.

## Block Categories

| Category | Purpose | Common code shape |
|---|---|---|
| Events | Top-level entry points. | `using (new OnStart()) { }` |
| Instructions | Actions such as display, wait, input, logs, staging. | `Vz.Display(...)` |
| Control flow | If, else-if, else, loops, wait blocks. | `if (...) { }`, `while (...) { }` |
| Expressions | Values, math, comparisons, booleans. | `altitude > 1000` |
| Variables | Global, local, list, parameter references. | `// var name = 0;` |
| Craft properties | Altitude, velocity, orbit, fuel, performance. | `Vz.Craft.Orbit.Apoapsis()` |
| Planet operations | Planet properties and coordinate transforms. | `Vz.Planet("Droo").Radius()` |
| Strings | Formatting, friendly values, text operations. | `Vz.StringOp(...)` |
| Lists | List create, access, mutation, length. | List-related `Vz` calls |
| Custom instructions | User-defined command blocks. | `Vz.DeclareCustomInstruction(...)` |
| Custom expressions | User-defined value blocks. | `Vz.DeclareCustomExpression(...)` |
| MFD widgets | Display widgets and widget events. | `Vz.CreateWidget(...)` |
| Raw preservation | Exact XML fragments. | `Vz.RawXmlEval(...)` |

## Program Structure

```xml
<Program name="Mission">
  <Variables />
  <Instructions />
  <Expressions />
</Program>
```

> [!danger] Required structure
> Exported XML must satisfy [[04 - Export Validation#Validation Rules]], including root, instructions, expression style, top-level position, and metadata requirements.

## Events

| Event | Code form | Notes |
|---|---|---|
| Flight start | `using (new OnStart())` | Most common entry point. |
| Flight end | `using (new OnEnd())` | Cleanup or logging. |
| Receive message | `using (new OnReceiveMessage("name"))` | Message-driven logic. |
| Docked | `using (new OnDocked())` | Docking behavior. |
| Change SOI | `using (new OnChangeSoi())` | Sphere-of-influence changes. |
| Part collision | `using (new OnPartCollision("part"))` | Part-specific event. |
| Part explode | `using (new OnPartExplode("part"))` | Part failure event. |

> [!tip] Position events
> Add `// VZPOS x=N y=N` before newly authored top-level events.

## Control Flow

| Block | Authoring shape | XML concern |
|---|---|---|
| If | `if (condition) { }` | Condition must export as valid expression. |
| Else-if | `else if (condition) { }` | Preserves branch order. |
| Else | `else { }` | Must export as `ElseIf style="else"` with true constant. |
| While | `while (condition) { }` | Validate expression style. |
| Wait until | `using (new WaitUntil(condition)) { }` | Common flight sequencing primitive. |

> [!danger] Else shape
> Raw `<Else>` nodes are blocked. Use the converter's supported `else` syntax and validate output.

## Craft Properties

| Family | Examples |
|---|---|
| Altitude | `Vz.Craft.AltitudeAGL()`, `Vz.Craft.AltitudeASL()` |
| Orbit | `Vz.Craft.Orbit.Apoapsis()`, `Periapsis()`, `Inclination()`, `Period()` |
| Atmosphere | `Vz.Craft.Atmosphere.AirDensity()`, `AirPressure()`, `Temperature()` |
| Performance | `Vz.Craft.Performance.Mass()`, `TWR()`, `StageDeltaV()` |
| Fuel | `Vz.Craft.Fuel.Battery()`, `FuelInStage()`, `Mono()` |
| Navigation | `Vz.Craft.Nav.Pitch()`, `Heading()`, `BankAngle()` |
| Velocity | `Surface()`, `Orbital()`, `VerticalSurface()`, `MachNumber()` |
| Target | `Vz.Craft.Target.Position()`, `Name()`, `Planet()` |

## Custom Blocks

> [!warning] Header sensitivity
> Custom instructions and expressions require `callFormat`, `format`, `name`, and top-level `pos`. Copy working shapes when authoring new custom blocks.

| Custom block | XML placement | Notes |
|---|---|---|
| Custom instruction | Top-level `<Instructions>` with header first. | Body instructions follow the header. |
| Custom expression | Under `<Expressions>`. | Returns an expression value. |

## Raw And Special Blocks

| Form | Meaning |
|---|---|
| `Vz.RawXmlConstant(...)` | Exact constant XML. |
| `Vz.RawXmlVariable(...)` | Exact variable XML. |
| `Vz.RawXmlCraftProperty(...)` | Exact craft property XML. |
| `Vz.RawXmlEval(...)` | Exact evaluate expression XML. |
| `Vz.ExactEval("text")` | Clean shorthand for simple exact eval text. |

See [[05 - Raw Preservation]].

<details>
<summary>Block debugging checklist</summary>

- [ ] Identify whether the block is instruction, expression, custom block, or raw XML.
- [ ] Compare against converter-emitted code from a working XML example.
- [ ] Check validation errors before changing block semantics.
- [ ] For custom blocks, inspect header metadata first.
- [ ] For raw blocks, decode or inspect the exact XML.

</details>

## Backlinks

Related notes: [[02 - Conversion Engine (VizzyXmlConverter)]], [[04 - Export Validation]], [[05 - Raw Preservation]], [[10 - Vizzy Authoring Guide]], [[12 - Project Examples]], [[14 - Troubleshooting]].




