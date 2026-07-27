/**
 * CodeBlock Enhancer — Quartz v5 Transformer Plugin
 *
 * Enhances Shiki-highlighted code blocks with:
 *  - Language icons + filename headers
 *  - Multi-colour line highlighting (hl:red:1-3)
 *  - Text highlighting (hlt:yellow:useState)
 *  - Copy-to-clipboard button
 *  - Foldable code blocks
 *  - 6 themes: obsidian, dracula, gruvbox, nord, tokyo-night, solarized
 *
 * Usage in quartz.config.yaml:
 *   - source: ./quartz/plugins/codeblockEnhancer
 *     enabled: true
 *     order: 25
 *     options:
 *       theme: obsidian
 *       alwaysShowLang: true
 *       showLangIcon: true
 *       copyButton: true
 *       excludedLanguages:
 *         - mermaid
 *         - math
 *       highlightColors:
 *         red: "#f88379"
 *         green: "#7ec699"
 */

import type { QuartzTransformerPlugin, QuartzTransformerPluginInstance } from "../types"
import { resolveOptions, type CodeBlockEnhancerOptions } from "./config"
import { headerTransformer } from "./headerTransformer"
import { highlightTransformer } from "./highlightTransformer"
import { copyButtonTransformer, COPY_BUTTON_SCRIPT } from "./copyButton"
// @ts-expect-error - inline SCSS import handled by Quartz bundler
import styles from "./styles.scss"

/**
 * Remark plugin that stores code block meta strings in file.data for later retrieval.
 *
 * rehype-pretty-code completely rewrites <code> element attributes during processing,
 * stripping any custom attributes like data-cbmeta. Instead of relying on hProperties
 * (which get stripped), we store meta in file.data.codeBlockMeta (a Record<number, string>
 * keyed by code block index). This survives both in-process and worker-based pipelines
 * because Quartz passes the same VFile object through both the markdown and HTML stages.
 */
function metaPreserver() {
  return (tree: any, file: any) => {
    const metaMap: Record<number, string> = {}
    let index = 0
    function visit(node: any) {
      if (node.type === "code") {
        if (node.meta) {
          metaMap[index] = node.meta
        }
        index++
      }
      if (node.children) {
        for (const child of node.children) {
          visit(child)
        }
      }
    }
    visit(tree)
    if (!file.data) file.data = {}
    file.data.codeBlockMeta = metaMap
  }
}

/**
 * Rehype plugin that restores code block meta from file.data onto <code> elements.
 *
 * This runs AFTER rehype-pretty-code (codeblockEnhancer order=25 > syntax-highlighting order=20),
 * reading from file.data.codeBlockMeta and re-attaching the meta string as data-cbmeta
 * on both the <pre> and <code> elements so that downstream transformers
 * (highlightTransformer, headerTransformer, copyButtonTransformer) can read it.
 */
function metaRestorer() {
  return (tree: any, file: any) => {
    const metaMap: Record<number, string> = (file?.data as any)?.codeBlockMeta ?? {}
    let index = 0
    function visit(node: any) {
      if (
        node.type === "element" &&
        node.tagName === "pre" &&
        node.properties?.["data-language"]
      ) {
        const meta = metaMap[index]
        if (meta) {
          node.properties["data-cbmeta"] = meta
          for (const child of node.children ?? []) {
            if (child.type === "element" && child.tagName === "code") {
              if (!child.properties) child.properties = {}
              child.properties["data-cbmeta"] = meta
              break
            }
          }
        }
        index++
      }
      for (const child of node.children ?? []) {
        visit(child)
      }
    }
    visit(tree)
  }
}

export const codeblockEnhancer: QuartzTransformerPlugin<CodeBlockEnhancerOptions> = (
  opts?: CodeBlockEnhancerOptions,
): QuartzTransformerPluginInstance => {
  const config = resolveOptions(opts)

  return {
    name: "codeblockEnhancer",

    /**
     * Remark plugins that run BEFORE rehype-pretty-code.
     * The metaPreserver plugin saves the code block's meta string (e.g. "fold")
     * as a data-cbmeta attribute on the <code> element, which survives
     * rehype-pretty-code processing.
     */
    markdownPlugins: () => {
      return [
        [metaPreserver, {}],
      ]
    },

    /**
     * Inject rehype plugins into the HTML processing pipeline.
     * These run after Shiki (rehype-pretty-code) has already
     * transformed code fences into <pre data-language="..."> elements.
     *
     * Note: rehype-pretty-code initially creates <pre class="shiki">, but
     * the syntax-highlighting plugin's post-processing strips the "shiki"
     * class and replaces it with data-language + data-theme attributes.
     * Our transformers detect code blocks via data-language instead.
     *
     * Order matters:
     * 1. Highlight transformer — operates on line spans and text nodes
     * 2. Header transformer — wraps <pre> in a container div
     * 3. Copy button — appended to the wrapper
     */
    htmlPlugins: () => {
      return [
        // metaRestorer must run first — it re-attaches data-cbmeta (stripped by
        // rehype-pretty-code) from file.data onto the processed <pre>/<code> elements.
        [metaRestorer, {}],
        [highlightTransformer(config), {}],
        [headerTransformer(config), {}],
        [copyButtonTransformer(config), {}],
      ]
    },

    /**
     * Provide external resources (CSS + JS) to be injected into pages.
     * Quartz extracts inline CSS/JS into cached external files automatically.
     */
    externalResources: () => {
      return {
        css: [
          {
            content: styles,
            inline: true,
          },
        ],
        js: [
          {
            script: COPY_BUTTON_SCRIPT,
            loadTime: "afterDOMReady" as const,
            contentType: "inline" as const,
          },
        ],
      }
    },
  }
}

export default codeblockEnhancer
