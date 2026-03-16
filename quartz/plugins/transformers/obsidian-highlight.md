# ObsidianHighlight

Handles Obsidian's `==highlight==` syntax at the rehype (HTML AST) level, including nested emphasis like `==***text***==`.

## Why a rehype plugin?

Remark-parse processes emphasis (`***`) **before** the OFM plugin's markdown-level highlight regex runs, splitting `==` markers into separate text nodes. This plugin runs after `remarkRehype` and handles both cases:

1. **Simple:** `==text==` → `<span class="text-highlight">text</span>`
2. **Nested:** `==***text***==` → matches `==` as sibling text nodes with inline elements between them

## Usage

```ts
// quartz.config.ts
import { ObsidianHighlight } from "./quartz/plugins/transformers/obsidian-highlight"

Plugin.ObsidianHighlight()
```

## Options

| Option           | Type     | Default            | Description                          |
| ---------------- | -------- | ------------------ | ------------------------------------ |
| `highlightClass` | `string` | `"text-highlight"` | CSS class for the highlight `<span>` |

## Example

```ts
// Custom class
Plugin.ObsidianHighlight({ highlightClass: "mark" })
```

## CSS

The output uses the `--textHighlight` CSS variable defined in `quartz.config.ts` theme colors. Override via:

```ts
// quartz.config.ts
colors: {
  lightMode: { textHighlight: "#84a59d88" },
  darkMode: { textHighlight: "#84a59d88" },
}
```
