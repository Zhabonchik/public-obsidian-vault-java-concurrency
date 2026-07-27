/**
 * CodeBlock Enhancer — Language Icons
 *
 * SVG icon strings for common languages.
 * All icons are 24×24 viewBox, designed to be embedded inline.
 */

/** Mapping of language → SVG string (without outer <svg> tag attributes) */
const ICON_MAP: Record<string, string> = {
  javascript: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M7 8.5h2v6.2c0 1.8-.9 2.8-2.5 2.8-.5 0-1-.1-1.4-.3v-1.6c.3.2.6.3 1 .3.6 0 .9-.3.9-1V8.5zm5.5 0h4.2v1.6h-2.2v5.8h-2V8.5z" fill="#000"/></svg>`,
  typescript: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#3178C6"/><path d="M8 8.5h5v1.6h-3.3v1.4h3v1.6h-3v3.2H8V8.5z" fill="#fff"/><path d="M14.5 14.5c.3.2.7.3 1.2.3.6 0 1-.2 1-.6 0-.3-.2-.5-.8-.7l-.4-.1c-1-.4-1.4-.9-1.4-1.7 0-1 .8-1.7 2-1.7.5 0 1 .1 1.3.2v1.2c-.3-.2-.7-.3-1.1-.3-.5 0-.8.2-.8.5 0 .3.2.4.8.6l.4.2c1.1.4 1.6.9 1.6 1.8 0 1.1-.9 1.8-2.2 1.8-.5 0-1-.1-1.4-.3v-1.2z" fill="#fff"/></svg>`,
  python: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.5 2 8 3.5 8 5v2h4v.5H5.5C3.5 7.5 2 9 2 12s1.5 4.5 3.5 4.5H7V14c0-2 1.5-3.5 3.5-3.5h3c1.5 0 2.5-1 2.5-2.5V5c0-1.5-1.5-3-4-3zm-2 2.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" fill="#3776AB"/><path d="M12 22c3.5 0 4-1.5 4-3v-2h-4v-.5h6.5c2 0 3.5-1.5 3.5-4.5s-1.5-4.5-3.5-4.5H17V10c0 2-1.5 3.5-3.5 3.5h-3c-1.5 0-2.5 1-2.5 2.5V19c0 1.5 1.5 3 4 3zm2-2.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="#FFD43B"/></svg>`,
  rust: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#CE422B"/><path d="M12 5l.5 1.5L14 7l-1.5.5L12 9l-.5-1.5L10 7l1.5-.5L12 5z" fill="#fff"/><circle cx="12" cy="12" r="3" fill="#fff" opacity="0.3"/><path d="M12 6v12M6 12h12M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="0.5" opacity="0.4"/></svg>`,
  go: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#00ADD8"/><path d="M12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5c1.6 0 3-.7 3.9-1.9.3-.4.5-.8.6-1.3H12v-2h5.5c.1.4.1.7.1 1 0 3.3-2.5 5.7-5.6 5.7-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 4 1.5l-1.4 1.4C14.9 7.4 13.5 7 12 7z" fill="#fff"/></svg>`,
  java: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 20c-1 .5-2 .8-3 .9.5-1 1-2.5.5-3-.5-.5-1.5 0-1.5 0s.5-1.5 2-1.5 2 1.5 2 1.5-.5 1.5 0 2.1z" fill="#ED8B00"/><path d="M10 16c2-3 6-4 6-8 0-2-1-4-1-4s2 1 2 4c0 3-2 5-4 7-1 1-2 2-3 1z" fill="#ED8B00"/><path d="M12 14c3-2 5-4 5-7 0-1.5-.5-3-.5-3s1.5 1.5 1.5 4c0 3-2.5 5-4.5 6.5C13 15 12 14.5 12 14z" fill="#ED8B00"/><text x="12" y="22" font-size="6" fill="#5382A1" text-anchor="middle" font-family="serif">Java</text></svg>`,
  c: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#5C6BAC"/><text x="12" y="17" font-size="12" fill="#fff" text-anchor="middle" font-family="serif" font-weight="bold">C</text></svg>`,
  cpp: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#5C6BAC"/><text x="9" y="17" font-size="11" fill="#fff" text-anchor="middle" font-family="serif" font-weight="bold">C</text><text x="16" y="14" font-size="7" fill="#fff" text-anchor="middle" font-family="serif" font-weight="bold">+</text><text x="19" y="17" font-size="7" fill="#fff" text-anchor="middle" font-family="serif" font-weight="bold">+</text></svg>`,
  csharp: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#5C6BAC"/><text x="10" y="17" font-size="11" fill="#fff" text-anchor="middle" font-family="serif" font-weight="bold">C</text><text x="17" y="15" font-size="8" fill="#fff" text-anchor="middle" font-family="sans" font-weight="bold">#</text></svg>`,
  php: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#777BB4"/><text x="12" y="16" font-size="9" fill="#fff" text-anchor="middle" font-family="sans" font-weight="bold">php</text></svg>`,
  ruby: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 14l9 8 9-8L12 2z" fill="#CC342D"/><path d="M12 2L7 14h10L12 2z" fill="#fff" opacity="0.3"/></svg>`,
  swift: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#F05138"/><path d="M12 5c-3 0-5 2-5 5 0 1 .3 2 .8 2.8.2-1.5 1-2.8 2.2-3.8C9.5 10 9 12 9.5 14c.5 1.5 2 2.5 3.5 2.5 2.5 0 4.5-2 4.5-5s-2.5-6.5-5.5-6.5z" fill="#fff"/></svg>`,
  kotlin: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#7F52FF"/><path d="M6 6h12L6 18V6z" fill="#fff" opacity="0.9"/><path d="M6 6l6 6-6 6V6z" fill="#fff" opacity="0.6"/></svg>`,
  html: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#E34F26"/><path d="M6 4l1.2 13L12 18l4.8-1L18 4H6zm9 4H9l.2 2H15l-.4 5-2.6.7-2.6-.7-.2-2h1.5l.1 1 1.2.3 1.2-.3.2-2H9.2L8.8 7h6.5l-.3 1z" fill="#fff"/></svg>`,
  css: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#1572B6"/><path d="M6 4l1.2 13L12 18l4.8-1L18 4H6zm9.2 4l-.3 3H9l.2 2h5.5l-.4 5-2.3.7-2.3-.7-.2-1.5h1.5v.7l1 .3 1-.3.2-2H9.2L8.8 7h6.4z" fill="#fff"/></svg>`,
  scss: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#CC6699"/><path d="M12 6c-3 0-5 1.5-5 3.5 0 1.5 1.5 2.5 3 2.5s2.5-.5 2.5-1.5c0-.5-.5-1-1-1 .5 0 1 .5 1 1.5 0 2-2 3.5-4 3.5l1 1c3 0 6-2 6-5.5C15.5 7.5 14 6 12 6z" fill="#fff"/></svg>`,
  json: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#5B5B5B"/><text x="12" y="16" font-size="8" fill="#fff" text-anchor="middle" font-family="monospace" font-weight="bold">{}</text></svg>`,
  yaml: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#CB171E"/><text x="12" y="16" font-size="7" fill="#fff" text-anchor="middle" font-family="monospace" font-weight="bold">YAML</text></svg>`,
  markdown: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#333"/><path d="M5 16V8h2l3 3 3-3h2v8h-2v-4l-3 3-3-3v4H5z" fill="#fff"/></svg>`,
  bash: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#2E2E2E"/><path d="M4 7l4 4-4 4M10 15h6" stroke="#4EAA25" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  shell: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#2E2E2E"/><path d="M4 7l4 4-4 4M10 15h6" stroke="#4EAA25" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sh: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#2E2E2E"/><path d="M4 7l4 4-4 4M10 15h6" stroke="#4EAA25" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sql: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#336791"/><text x="12" y="16" font-size="8" fill="#fff" text-anchor="middle" font-family="sans" font-weight="bold">SQL</text></svg>`,
  docker: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#2496ED"/><path d="M3 12h2v2H3v-2zm3 0h2v2H6v-2zm3 0h2v2H9v-2zm3 0h2v2h-2v-2zm-6-3h2v2H6V9zm3 0h2v2H9V9zm3 0h2v2h-2V9zm0-3h2v2h-2V6zm6 6c-1 0-2 .5-2.5 1h-1c0-1-.5-1.5-.5-1.5s-2 .5-2.5 2c.5 2 2.5 3 2.5 3 0 0 0 2 1c2 0 3-1 3-1z" fill="#fff"/></svg>`,
  lua: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#000080"/><circle cx="12" cy="12" r="5" fill="#fff" opacity="0.2"/><circle cx="16" cy="8" r="2" fill="#fff"/></svg>`,
  vue: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h5l5 8 5-8h5L12 21 2 3z" fill="#41B883"/><path d="M6 3h3l3 5 3-5h3L12 13 6 3z" fill="#34495E"/></svg>`,
  react: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1" fill="none" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1" fill="none" transform="rotate(120 12 12)"/></svg>`,
  text: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#757575"/><path d="M5 6h14v2H5V6zm0 4h14v2H5v-2zm0 4h10v2H5v-2z" fill="#fff"/></svg>`,
  plaintext: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#757575"/><path d="M5 6h14v2H5V6zm0 4h14v2H5v-2zm0 4h10v2H5v-2z" fill="#fff"/></svg>`,
}

/** Alias map for common alternative names */
const ALIAS_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  rs: "rust",
  golang: "go",
  cs: "csharp",
  "c++": "cpp",
  "c#": "csharp",
  rb: "ruby",
  kt: "kotlin",
  yml: "yaml",
  md: "markdown",
  zsh: "bash",
  "shell-script": "bash",
  dockerfile: "docker",
  dockercompose: "docker",
  "docker-compose": "docker",
}

/**
 * Get the SVG icon string for a given language.
 * @param lang - language identifier (e.g. "typescript", "py", "js")
 * @returns SVG string or null if no icon is available
 */
export function getLanguageIcon(lang: string): string | null {
  const normalized = lang.toLowerCase().trim()
  if (ICON_MAP[normalized]) return ICON_MAP[normalized]
  const aliased = ALIAS_MAP[normalized]
  if (aliased && ICON_MAP[aliased]) return ICON_MAP[aliased]
  return null
}

/** Check whether an icon exists for a language */
export function hasLanguageIcon(lang: string): boolean {
  return getLanguageIcon(lang) !== null
}
