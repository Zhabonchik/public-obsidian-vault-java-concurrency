// Vertical typewriter cycling through the site author's name in three
// scripts. Each character is rendered on its own line so the strip fits
// inside the narrow rail. Runs after every Quartz `nav` event.

// Full-width Unicode characters (U+FF21..U+FF54 for Latin) so every glyph
// occupies a 1em square — visually uniform with CJK full-width characters.
const PATTERNS = ["ｋｏｍｅｎｏ", "ｒｉｃｅｓｅｔ", "米野"]
const TYPE_MS = 160
const ERASE_MS = 90
const HOLD_AFTER_TYPE_MS = 1600
const HOLD_AFTER_ERASE_MS = 350

document.addEventListener("nav", () => {
  const container = document.querySelector<HTMLElement>(".rail-name")
  if (!container) return

  const cursor = container.querySelector<HTMLElement>(".rail-name__cursor")
  if (!cursor) return

  // Clear any chars left over from a prior navigation (script re-runs on nav).
  container.querySelectorAll(".rail-name__char").forEach((n) => n.remove())

  let patternIdx = 0
  let typedCount = 0
  let phase: "typing" | "holding-full" | "erasing" | "holding-empty" = "typing"
  let timer: number | null = null

  const currentChars = () => Array.from(PATTERNS[patternIdx])

  const appendChar = (ch: string) => {
    const span = document.createElement("span")
    span.className = "rail-name__char"
    span.textContent = ch
    container.insertBefore(span, cursor)
  }

  const removeLastChar = () => {
    const chars = container.querySelectorAll(".rail-name__char")
    chars[chars.length - 1]?.remove()
  }

  const tick = () => {
    const chars = currentChars()

    if (phase === "typing") {
      appendChar(chars[typedCount])
      typedCount += 1
      if (typedCount >= chars.length) {
        phase = "holding-full"
        timer = window.setTimeout(tick, HOLD_AFTER_TYPE_MS)
      } else {
        timer = window.setTimeout(tick, TYPE_MS)
      }
      return
    }

    if (phase === "holding-full") {
      phase = "erasing"
      timer = window.setTimeout(tick, ERASE_MS)
      return
    }

    if (phase === "erasing") {
      removeLastChar()
      typedCount -= 1
      if (typedCount <= 0) {
        typedCount = 0
        phase = "holding-empty"
        patternIdx = (patternIdx + 1) % PATTERNS.length
        timer = window.setTimeout(tick, HOLD_AFTER_ERASE_MS)
      } else {
        timer = window.setTimeout(tick, ERASE_MS)
      }
      return
    }

    if (phase === "holding-empty") {
      phase = "typing"
      timer = window.setTimeout(tick, TYPE_MS)
      return
    }
  }

  timer = window.setTimeout(tick, HOLD_AFTER_ERASE_MS)

  window.addCleanup(() => {
    if (timer !== null) clearTimeout(timer)
  })
})
