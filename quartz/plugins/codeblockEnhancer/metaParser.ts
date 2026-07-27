/**
 * CodeBlock Enhancer — Meta Parser
 *
 * Parses the meta string from fenced code blocks.
 *
 * Supported syntax (space-separated tokens):
 *   title="filename.js"     → set a custom filename/title
 *   hl:<color>:<range>      → highlight lines with a named colour
 *   hlt:<color>:<text>      → highlight matching text with a named colour
 *   fold                    → mark block as foldable (starts collapsed)
 *   fold:open               → foldable, starts expanded
 *   fold:closed             → foldable, starts collapsed (same as fold)
 *   exclude                 → exclude this block from enhancement
 *   noheader                → skip header rendering
 *   nocopy                  → skip copy button
 *
 * Examples:
 *   title="app.ts" hl:red:1-3 hlt:yellow:useState fold
 *   hl:blue:5-10 hlt:green:const
 */

export interface LineHighlightRange {
  color: string
  /** 1-indexed line numbers */
  lines: number[]
}

export interface TextHighlightRule {
  color: string
  /** Raw text to match (case-sensitive) */
  text: string
}

export interface CodeBlockMeta {
  /** Raw meta string */
  raw: string
  /** Custom title / filename */
  title: string | null
  /** Line highlight ranges */
  highlightLines: LineHighlightRange[]
  /** Text highlight rules */
  highlightText: TextHighlightRule[]
  /** Whether the block should be foldable */
  fold: boolean
  foldClosed: boolean
  /** Whether to exclude this block from all enhancement */
  exclude: boolean
  /** Whether to skip the header bar */
  noHeader: boolean
  /** Whether to skip the copy button */
  noCopy: boolean
  /** Language identifier (if available from data-language) */
  lang: string | null
}

/**
 * Parse a line range spec like "1-3", "5", "1,3,5-7" into an array of line numbers.
 */
function parseLineRange(spec: string): number[] {
  const lines: number[] = []
  for (const part of spec.split(",")) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const dashIdx = trimmed.indexOf("-")
    if (dashIdx !== -1) {
      const start = parseInt(trimmed.substring(0, dashIdx), 10)
      const end = parseInt(trimmed.substring(dashIdx + 1), 10)
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i >= 1) lines.push(i)
        }
      }
    } else {
      const n = parseInt(trimmed, 10)
      if (!isNaN(n) && n >= 1) lines.push(n)
    }
  }
  return [...new Set(lines)].sort((a, b) => a - b)
}

/**
 * Parse the raw meta string from a fenced code block.
 *
 * @param raw - the meta string after the language identifier (may be empty)
 * @param lang - the language identifier (e.g. "typescript")
 */
export function parseMeta(raw: string, lang?: string | null): CodeBlockMeta {
  const meta: CodeBlockMeta = {
    raw: raw ?? "",
    title: null,
    highlightLines: [],
    highlightText: [],
    fold: false,
    foldClosed: false,
    exclude: false,
    noHeader: false,
    noCopy: false,
    lang: lang ?? null,
  }

  if (!meta.raw || !meta.raw.trim()) return meta

  // Tokenize: respect quoted strings for title="..."
  const tokens: string[] = []
  let i = 0
  const s = meta.raw
  while (i < s.length) {
    // Skip whitespace
    while (i < s.length && /\s/.test(s[i])) i++
    if (i >= s.length) break

    // Read token — if it contains a quote, read until closing quote
    let token = ""
    let inQuote = false
    while (i < s.length) {
      const ch = s[i]
      if (ch === '"') {
        inQuote = !inQuote
        token += ch
        i++
        continue
      }
      if (!inQuote && /\s/.test(ch)) break
      token += ch
      i++
    }
    if (token) tokens.push(token)
  }

  for (const token of tokens) {
    // title="..."
    if (token.startsWith("title=")) {
      const val = token.substring(6)
      if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
        meta.title = val.slice(1, -1)
      } else {
        meta.title = val
      }
      continue
    }

    // hl:<color>:<range>
    if (token.startsWith("hl:")) {
      const parts = token.split(":")
      if (parts.length >= 3) {
        const color = parts[1]
        const rangeStr = parts.slice(2).join(":")
        const lines = parseLineRange(rangeStr)
        if (lines.length > 0) {
          meta.highlightLines.push({ color, lines })
        }
      }
      continue
    }

    // hlt:<color>:<text>
    if (token.startsWith("hlt:")) {
      const parts = token.split(":")
      if (parts.length >= 3) {
        const color = parts[1]
        const text = parts.slice(2).join(":")
        if (text) {
          meta.highlightText.push({ color, text })
        }
      }
      continue
    }

    // fold:closed - foldable and starts collapsed (same as fold)
    // fold:open - foldable but starts expanded
    if (token.toLowerCase() === "fold:closed") {
      meta.fold = true
      meta.foldClosed = true
      continue
    }
    if (token.toLowerCase() === "fold:open") {
      meta.fold = true
      meta.foldClosed = false
      continue
    }

    // Simple flags
    switch (token.toLowerCase()) {

      case "fold":
        meta.fold = true
        meta.foldClosed = true
        break
      case "exclude":
        meta.exclude = true
        break
      case "noheader":
        meta.noHeader = true
        break
      case "nocopy":
        meta.noCopy = true
        break
    }
  }

  return meta
}
