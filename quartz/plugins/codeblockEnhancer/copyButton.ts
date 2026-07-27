/**
 * CodeBlock Enhancer — Copy Button
 *
 * Adds a copy-to-clipboard button to each code block and provides
 * the client-side JavaScript for the copy functionality.
 */

import type { Root, Element, ElementContent, Properties } from "hast"
import { visit } from "unist-util-visit"
import { fromHtml } from "hast-util-from-html"
import { parseMeta } from "./metaParser"
import type { CodeBlockEnhancerOptions } from "./config"

/**
 * The client-side JavaScript injected via externalResources.
 * This script:
 * 1. Finds all .cb-copy buttons
 * 2. On click, reads the text from the associated <pre> block
 * 3. Copies to clipboard
 * 4. Shows visual feedback (copied! → ✓ → copy)
 */
export const COPY_BUTTON_SCRIPT = `
(function() {
  'use strict';

  function initCopyButtons() {
    var buttons = document.querySelectorAll('.cb-copy:not([data-cb-initialized])');
    buttons.forEach(function(btn) {
      btn.setAttribute('data-cb-initialized', 'true');
      btn.addEventListener('click', function() {
        var wrapper = btn.closest('.cb-wrapper');
        if (!wrapper) return;
        var pre = wrapper.querySelector('pre');
        if (!pre) return;

        // Get code text from the <pre> block
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;
        text = text.replace(/\\n$/, ''); // trim trailing newline

        function showSuccess() {
          var orig = btn.innerHTML;
          btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
          btn.classList.add('cb-copied');
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.classList.remove('cb-copied');
          }, 2000);
        }

        function fallbackCopy() {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); showSuccess(); } catch(e) {}
          document.body.removeChild(ta);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(showSuccess).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }
      });
    });

    // Fold toggle (re-bound on SPA navigation)
    var foldHeaders = document.querySelectorAll(".cb-foldable .cb-header:not([data-cb-fold-init])");
    foldHeaders.forEach(function(header) {
      header.setAttribute("data-cb-fold-init", "true");
      header.addEventListener("click", function() {
        var wrapper = header.closest(".cb-wrapper");
        if (wrapper) wrapper.classList.toggle("cb-folded");
      });
    });
  }

  // Run on DOMContentLoaded and on SPA navigation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }

  // Re-init on SPA route change (Quartz uses client-side navigation)
  var lastUrl = location.href;
  new MutationObserver(function() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(initCopyButtons, 100);
    }
  }).observe(document, { subtree: true, childList: true });

})();
`

const COPY_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`

/**
 * Parse the copy icon SVG into a HAST node.
 */
function copyIconToHast(): ElementContent {
  try {
    const tree = fromHtml(COPY_ICON_SVG, { fragment: true })
    for (const child of tree.children) {
      if (child.type === "element") {
        return child as ElementContent
      }
    }
  } catch {
    // ignore
  }
  return { type: "text", value: " Copy" }
}

/**
 * Create a rehype plugin that adds copy buttons to code blocks.
 */
export function copyButtonTransformer(opts: Required<CodeBlockEnhancerOptions>) {
  return () => {
    return (tree: Root) => {
      if (!opts.copyButton) return

      visit(tree, "element", (node: Element, index: number | null, parent: Element | null) => {
        if (node.tagName !== "pre") return
        if (!parent || index === null) return

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

        if (meta.exclude || meta.noCopy) return

        // Build the copy button element
        const copyButton: Element = {
          type: "element",
          tagName: "button",
          properties: {
            className: ["cb-copy"],
            type: "button",
            "aria-label": "Copy code to clipboard",
            title: "Copy",
          } as Properties,
          children: [copyIconToHast()],
        }

        // Check if the parent is already a cb-wrapper (from headerTransformer)
        const isAlreadyWrapped =
          parent.tagName === "div" &&
          Array.isArray(parent.properties?.className) &&
          (parent.properties!.className as string[]).includes("cb-wrapper")

        if (isAlreadyWrapped) {
          // Append button to the wrapper
          parent.children.push(copyButton)
        } else {
          // Wrap in a new container
          const wrapper: Element = {
            type: "element",
            tagName: "div",
            properties: {
              className: ["cb-wrapper", `cb-theme-${opts.theme}`, meta.fold ? "cb-foldable" : "", meta.foldClosed ? "cb-folded" : ""].filter(Boolean),
            } as Properties,
            children: [node, copyButton],
          }
          parent.children[index] = wrapper
        }
      })
    }
  }
}
