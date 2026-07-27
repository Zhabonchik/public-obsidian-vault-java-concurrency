/**
 * CodeBlock Enhancer — Configuration Types
 * Quartz v5 Transformer Plugin
 *
 * SPDX-License-Identifier: MIT
 */

export type CodeBlockTheme =
  | "obsidian"
  | "dracula"
  | "gruvbox"
  | "nord"
  | "tokyo-night"
  | "solarized"

export interface CodeBlockEnhancerOptions {
  /** Visual theme for headers, icons, and highlights */
  theme?: CodeBlockTheme
  /** Always show the language label even when no title is set */
  alwaysShowLang?: boolean
  /** Show a language icon (SVG) next to the filename */
  showLangIcon?: boolean
  /** Add a copy-to-clipboard button */
  copyButton?: boolean
  /** Languages to exclude from enhancement entirely */
  excludedLanguages?: string[]
  /** Custom highlight colours keyed by name → CSS colour value */
  highlightColors?: Record<string, string>
}

export const defaultOptions: Required<CodeBlockEnhancerOptions> = {
  theme: "obsidian",
  alwaysShowLang: true,
  showLangIcon: true,
  copyButton: true,
  excludedLanguages: ["mermaid", "math"],
  highlightColors: {
    red: "#f88379",
    green: "#7ec699",
    yellow: "#e2c770",
    blue: "#6caee6",
    purple: "#c678dd",
    orange: "#e5b07b",
    pink: "#f0a0c0",
    cyan: "#56b6c2",
  },
}

/** Merge user options with defaults */
export function resolveOptions(
  opts?: CodeBlockEnhancerOptions,
): Required<CodeBlockEnhancerOptions> {
  if (!opts) return { ...defaultOptions }
  return {
    theme: opts.theme ?? defaultOptions.theme,
    alwaysShowLang: opts.alwaysShowLang ?? defaultOptions.alwaysShowLang,
    showLangIcon: opts.showLangIcon ?? defaultOptions.showLangIcon,
    copyButton: opts.copyButton ?? defaultOptions.copyButton,
    excludedLanguages: opts.excludedLanguages ?? defaultOptions.excludedLanguages,
    highlightColors: { ...defaultOptions.highlightColors, ...opts.highlightColors },
  }
}
