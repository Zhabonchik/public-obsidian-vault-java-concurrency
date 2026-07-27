/**
 * CodeBlock Enhancer — Header Transformer
 *
 * Adds a header bar above each Shiki code block showing:
 *  - Language icon (SVG)
 *  - Filename / title (from meta or language name)
 *  - Language label badge
 */

import type { Root, Element, ElementContent, Properties } from "hast"
import { visit } from "unist-util-visit"
import { fromHtml } from "hast-util-from-html"
import { getLanguageIcon } from "./icons"
import { parseMeta } from "./metaParser"
import type { CodeBlockEnhancerOptions } from "./config"

/**
 * Parse an SVG string into a HAST element (using hast-util-from-html).
 * Returns the first element child, or null if parsing fails.
 */
function svgToHast(svgString: string): ElementContent | null {
  try {
    const tree = fromHtml(svgString, { fragment: true })
    // Find the first element child
    for (const child of tree.children) {
      if (child.type === "element") {
        return child as ElementContent
      }
    }
  } catch {
    // Fallback: return a text node with empty value
  }
  return null
}

/**
 * Build a HAST element for the header div.
 */
function buildHeader(
  lang: string,
  title: string | null,
  showIcon: boolean,
  alwaysShowLang: boolean,
): Element {
  const children: ElementContent[] = []

  // Language icon
  if (showIcon) {
    const iconSvg = getLanguageIcon(lang)
    if (iconSvg) {
      const iconNode = svgToHast(iconSvg)
      if (iconNode) {
        children.push({
          type: "element",
          tagName: "span",
          properties: { className: ["cb-lang-icon"] } as Properties,
          children: [iconNode],
        })
      }
    }
  }

  // Filename / title
  const displayTitle = title || lang
  children.push({
    type: "element",
    tagName: "span",
    properties: { className: ["cb-filename"] } as Properties,
    children: [{ type: "text", value: displayTitle }],
  })

  // Language label badge (only if different from title, or alwaysShowLang)
  if (alwaysShowLang && (title || lang !== displayTitle)) {
    children.push({
      type: "element",
      tagName: "span",
      properties: { className: ["cb-lang-badge"] } as Properties,
      children: [{ type: "text", value: lang }],
    })
  }

  return {
    type: "element",
    tagName: "div",
    properties: { className: ["cb-header"] } as Properties,
    children,
  }
}

/**
 * Create a rehype plugin that wraps Shiki `<pre>` blocks with a header.
 */
export function headerTransformer(opts: Required<CodeBlockEnhancerOptions>) {
  return () => {
    return (tree: Root) => {
      visit(tree, "element", (node: Element, index: number | null, parent: Element | null) => {
        if (node.tagName !== "pre") return
        if (!parent || index === null) return

        // Detect Shiki / rehype-pretty-code output
        // rehype-pretty-code creates <pre class="shiki"> but the syntax-highlighting
        // plugin strips the "shiki" class and replaces it with data-language + data-theme.
        // So we check for data-language (always present on Shiki output after transform).
        const dataLang = node.properties?.["data-language"] as string | undefined
        if (!dataLang) return
        const classList = (node.properties?.className as string[] | string | undefined) ?? []
        void classList // kept for potential future use

        // Check excluded languages
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

        if (meta.exclude || meta.noHeader) return

        const header = buildHeader(
          dataLang,
          meta.title,
          opts.showLangIcon,
          opts.alwaysShowLang,
        )

        // Wrap: insert header before the <pre>, and wrap both in a container
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["cb-wrapper", `cb-theme-${opts.theme}`, meta.fold ? "cb-foldable" : "", meta.foldClosed ? "cb-folded" : ""].filter(Boolean),
          } as Properties,
          children: [header, node],
        }

        // Replace the <pre> with the wrapper
        parent.children[index] = wrapper
      })
    }
  }
}
