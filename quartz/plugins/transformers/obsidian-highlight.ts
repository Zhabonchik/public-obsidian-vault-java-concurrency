import { QuartzTransformerPlugin } from "../types"
import { Element, Text, Root, RootContent } from "hast"

/**
 * ObsidianHighlight handles Obsidian's ==highlight== syntax at the rehype
 * (HTML AST) level. This is necessary because remark-parse processes
 * emphasis (`***`) before the OFM plugin's markdown-level highlight regex
 * can run, splitting `==` markers into separate text nodes.
 *
 * This plugin runs AFTER remarkRehype and handles two cases:
 * 1. Simple: `==text==` all in one text node
 * 2. Nested: `==***text***==` where emphasis creates sibling nodes
 *    between the `==` markers
 *
 * Output: `<span class="text-highlight">...</span>`
 */

interface Options {
  /** CSS class name for the highlight span. Default: "text-highlight" */
  highlightClass: string
}

const defaultOptions: Options = {
  highlightClass: "text-highlight",
}

export const ObsidianHighlight: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  const HIGHLIGHT_REGEX = /==([^=]+)==/g

  function walk(node: Element | Root) {
    if (!node?.children) return

    let i = 0
    while (i < node.children.length) {
      const child = node.children[i]

      // Case 1: ==text== in a single text node
      if (child.type === "text" && (child as Text).value.includes("==")) {
        const val = (child as Text).value
        HIGHLIGHT_REGEX.lastIndex = 0
        if (HIGHLIGHT_REGEX.test(val)) {
          const parts: RootContent[] = []
          let lastIndex = 0
          let match: RegExpExecArray | null
          HIGHLIGHT_REGEX.lastIndex = 0
          while ((match = HIGHLIGHT_REGEX.exec(val)) !== null) {
            if (match.index > lastIndex) {
              parts.push({ type: "text", value: val.slice(lastIndex, match.index) })
            }
            parts.push({
              type: "element",
              tagName: "span",
              properties: { className: [opts.highlightClass] },
              children: [{ type: "text", value: match[1] }],
            })
            lastIndex = match.index + match[0].length
          }
          if (lastIndex < val.length) {
            parts.push({ type: "text", value: val.slice(lastIndex) })
          }
          node.children.splice(i, 1, ...parts)
          i += parts.length - 1
          continue
        }
      }

      // Case 2: == at start/end with elements between (e.g. ==***text***==)
      // First, split any "==" suffix/prefix from text nodes into separate nodes
      // so that all "==" markers are standalone text nodes
      if (child.type === "text" && (child as Text).value.endsWith("==") && (child as Text).value.trim() !== "==") {
        const val = (child as Text).value
        const prefix = val.slice(0, -2)
        const parts: RootContent[] = []
        if (prefix) parts.push({ type: "text", value: prefix })
        parts.push({ type: "text", value: "==" })
        node.children.splice(i, 1, ...parts)
        i += parts.length - 1
        continue
      }
      // Split "==text" prefix (e.g. "==text" at end of content before emphasis)
      // This handles the case where text before emphasis starts with "=="
      if (child.type === "text" && (child as Text).value.startsWith("==") && (child as Text).value.trim() !== "==") {
        const val = (child as Text).value
        const suffix = val.slice(2)
        const parts: RootContent[] = []
        parts.push({ type: "text", value: "==" })
        if (suffix) parts.push({ type: "text", value: suffix })
        node.children.splice(i, 1, ...parts)
        i += parts.length - 1
        continue
      }

      // Handle standalone "==" markers with elements between them (e.g. ==***text***==)
      // This runs after the splitting above, so all "==" markers are now standalone nodes
      if (child.type === "text" && (child as Text).value.trim() === "==") {
        for (let j = i + 2; j < node.children.length; j++) {
          const endChild = node.children[j]
          if (endChild.type === "text" && (endChild as Text).value.trim() === "==") {
            const between = node.children.slice(i + 1, j)
            if (between.length === 0) break

            const highlightChildren: RootContent[] = []
            const startBefore = (child as Text).value.replace("==", "")
            if (startBefore) highlightChildren.push({ type: "text", value: startBefore })
            highlightChildren.push(...(between as RootContent[]))
            const endAfter = (endChild as Text).value.replace("==", "")
            if (endAfter) highlightChildren.push({ type: "text", value: endAfter })

            node.children.splice(i, j - i + 1, {
              type: "element",
              tagName: "span",
              properties: { className: [opts.highlightClass] },
              children: highlightChildren,
            } as Element)
            break
          }
        }
      }

      // Recurse into child elements
      if (child.type === "element") {
        walk(child as Element)
      }
      i++
    }
  }

  return {
    name: "ObsidianHighlight",
    htmlPlugins() {
      return [
        () => (tree: Root) => {
          if (tree) walk(tree)
        },
      ]
    },
  }
}
