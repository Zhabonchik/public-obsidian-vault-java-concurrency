import { Element, Literal, Root } from "hast"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

function rehypeLucideIcons(verbose: boolean = false) {
  return (tree: Root) => {
    visit(tree, "text", (node: Literal, index: number | undefined, parent: any) => {
      if (
        typeof node.value === "string" &&
        typeof index === "number" &&
        parent &&
        parent.children &&
        Array.isArray(parent.children)
      ) {
        // Replace the first match of a Lucide icon tag in this node.
        // Once the node is updated with the icon element, it will trigger a
        // new visit call to this node and recursively replace all icon tags.
        const originalText = node.value
        const lucidePattern = /:luc_([a-z_]+):/
        const lucideTag = originalText.match(lucidePattern)

        if (lucideTag) {
          const [iconTag, iconName] = lucideTag
          const tagStart = lucideTag.index ?? 0

          let replacedText: Array<Literal | Element> = []

          if (tagStart > 0) {
            replacedText.push({
              type: "text",
              value: originalText.substring(0, tagStart),
            })
          }

          const lucideIconElement: Element = {
            type: "element",
            tagName: "i",
            properties: {
              class: `lucide lucide-${iconName}`,
              "data-lucide": iconName,
              "aria-hidden": "true",
            },
            children: [],
          }
          replacedText.push(lucideIconElement)

          if (verbose) {
            console.log(
              `[LucideIcons] Replaced markdown :luc_${iconName}: with HTML Lucide icon "${iconName}"`,
            )
          }

          const remainingText = originalText.substring(tagStart + iconTag.length)
          if (remainingText) {
            replacedText.push({
              type: "text",
              value: remainingText,
            })
          }

          parent.children.splice(index, 1, ...replacedText)
        }
      }
    })
  }
}

export const LucideIcons: QuartzTransformerPlugin = () => {
  return {
    name: "LucideIcons",
    htmlPlugins(ctx) {
      return [() => rehypeLucideIcons(ctx?.argv?.verbose || false)]
    },
    externalResources() {
      return {
        js: [
          {
            src: "https://unpkg.com/lucide@latest",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
          {
            script: "lucide.createIcons();",
            loadTime: "afterDOMReady",
            contentType: "inline",
          },
        ],
      }
    },
  }
}

export default LucideIcons
