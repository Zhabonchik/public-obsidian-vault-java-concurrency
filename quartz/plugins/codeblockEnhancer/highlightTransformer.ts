/**
 * CodeBlock Enhancer — Highlight Transformer
 *
 * Two features:
 * 1. Multi-colour line highlighting: `hl:red:1-3` → adds data-hl="red" to matching <span class="line">
 * 2. Text highlighting: `hlt:yellow:useState` → wraps matching text in <mark class="hl-yellow">
 */

import type { Root, Element, ElementContent, Text, Properties } from "hast"
import { visit } from "unist-util-visit"
import { parseMeta } from "./metaParser"
import type { CodeBlockEnhancerOptions } from "./config"

/**
 * Apply line highlighting by adding data-hl attributes to <span class="line"> elements.
 */
function applyLineHighlights(
  preNode: Element,
  meta: ReturnType<typeof parseMeta>,
  highlightColors: Record<string, string>,
): void {
  if (meta.highlightLines.length === 0) return

  // Build a map: lineNumber → color name
  const lineColorMap = new Map<number, string>()
  for (const range of meta.highlightLines) {
    for (const ln of range.lines) {
      lineColorMap.set(ln, range.color)
    }
  }

  // Find the <code> child, then iterate <span data-line> children
  // rehype-pretty-code v0.14+ uses <span data-line> (not class="line")
  let lineCounter = 0
  visit(preNode, "element", (node: Element) => {
    if (node.tagName !== "span") return
    // Check for class="line" (older Shiki) or data-line attribute (rehype-pretty-code v0.14+)
    const cls = (node.properties?.className as string[] | string | undefined) ?? []
    const classList = Array.isArray(cls) ? cls : [cls]
    const hasLineClass = classList.includes("line")
    const hasDataLine = "data-line" in (node.properties ?? {})
    if (!hasLineClass && !hasDataLine) return

    lineCounter++
    const colorName = lineColorMap.get(lineCounter)
    if (colorName) {
      if (!node.properties) node.properties = {}
      const existing = (node.properties["data-hl"] as string | undefined) ?? ""
      node.properties["data-hl"] = existing ? `${existing} ${colorName}` : colorName

      // Add inline style for the colour
      const cssColor = highlightColors[colorName] || colorName
      const existingStyle = (node.properties.style as string | undefined) ?? ""
      const newStyle = `background-color: ${cssColor}33;border-left: 3px solid ${cssColor};padding-left: calc(var(--cb-padding, 1rem) - 3px);`
      node.properties.style = existingStyle ? `${existingStyle};${newStyle}` : newStyle
    }
  })
}

/**
 * Wrap matching text in <mark> elements for text highlighting.
 */
function applyTextHighlights(
  preNode: Element,
  meta: ReturnType<typeof parseMeta>,
  highlightColors: Record<string, string>,
): void {
  if (meta.highlightText.length === 0) return

  // For each text rule, find and wrap matching text nodes
  for (const rule of meta.highlightText) {
    const colorName = rule.color
    const cssColor = highlightColors[colorName] || colorName

    visit(preNode, "text", (textNode: Text, index: number | null, parent: Element | null) => {
      if (!parent || index === null) return
      const value = textNode.value
      if (!value.includes(rule.text)) return

      // Split the text and create new nodes
      const newNodes: ElementContent[] = []
      let lastIndex = 0
      let searchFrom = 0

      while (searchFrom < value.length) {
        const found = value.indexOf(rule.text, searchFrom)
        if (found === -1) {
          newNodes.push({
            type: "text",
            value: value.slice(lastIndex),
          })
          break
        }

        // Text before the match
        if (found > lastIndex) {
          newNodes.push({
            type: "text",
            value: value.slice(lastIndex, found),
          })
        }

        // The <mark> element
        newNodes.push({
          type: "element",
          tagName: "mark",
          properties: {
            className: ["cb-text-hl", `cb-hl-${colorName}`],
            style: `background-color: ${cssColor}40; color: ${cssColor};`,
          } as Properties,
          children: [{ type: "text", value: rule.text }],
        })

        lastIndex = found + rule.text.length
        searchFrom = lastIndex
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes)
      }
    })
  }
}

/**
 * Create a rehype plugin that applies both line and text highlighting.
 */
export function highlightTransformer(opts: Required<CodeBlockEnhancerOptions>) {
  return () => {
    return (tree: Root) => {
      visit(tree, "element", (node: Element, _index: number | null, parent: Element | null) => {
        if (node.tagName !== "pre") return

        // Detect Shiki / rehype-pretty-code output (data-language present)
        const dataLang = node.properties?.["data-language"] as string | undefined
        if (!dataLang) return
        if (opts.excludedLanguages.includes(dataLang)) return

        // Get meta: read data-cbmeta from the child <code> element.
        // The metaPreserver remark plugin saves the raw meta string (e.g. "fold")
        // as data-cbmeta on the <code> element, which survives rehype-pretty-code.
        let dataMeta = ""
        const codeChild = node.children?.[0]
        if (codeChild && codeChild.type === "element" && codeChild.tagName === "code") {
          dataMeta = (codeChild.properties?.["data-cbmeta"] as string | undefined) ?? ""
        }
        const meta = parseMeta(dataMeta, dataLang)

        if (meta.exclude) return

        applyLineHighlights(node, meta, opts.highlightColors)
        applyTextHighlights(node, meta, opts.highlightColors)
      })
    }
  }
}
