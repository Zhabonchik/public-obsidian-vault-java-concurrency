export function registerEscapeHandler(outsideContainer: HTMLElement | null, cb: () => void) {
  if (!outsideContainer) return
  function click(this: HTMLElement, e: HTMLElementEventMap["click"]) {
    if (e.target !== this) return
    e.preventDefault()
    e.stopPropagation()
    cb()
  }

  function esc(e: HTMLElementEventMap["keydown"]) {
    if (!e.key.startsWith("Esc")) return
    e.preventDefault()
    cb()
  }

  outsideContainer?.addEventListener("click", click)
  // Use type assertion to avoid TypeScript error when checking individual files
  if (typeof (window as any).addCleanup === "function") {
    ;(window as any).addCleanup(() => outsideContainer?.removeEventListener("click", click))
  }
  document.addEventListener("keydown", esc)
  if (typeof (window as any).addCleanup === "function") {
    ;(window as any).addCleanup(() => document.removeEventListener("keydown", esc))
  }
}

export function removeAllChildren(node: HTMLElement) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

// AliasRedirect emits HTML redirects which also have the link[rel="canonical"]
// containing the URL it's redirecting to.
// Extracting it here with regex is _probably_ faster than parsing the entire HTML
// with a DOMParser effectively twice (here and later in the SPA code), even if
// way less robust - we only care about our own generated redirects after all.
const canonicalRegex = /<link rel="canonical" href="([^"]*)">/

export async function fetchCanonical(url: URL): Promise<Response> {
  const res = await fetch(`${url}`)
  if (!res.headers.get("content-type")?.startsWith("text/html")) {
    return res
  }

  // reading the body can only be done once, so we need to clone the response
  // to allow the caller to read it if it's was not a redirect
  const text = await res.clone().text()
  const [_, redirect] = text.match(canonicalRegex) ?? []
  return redirect ? fetch(`${new URL(redirect, url)}`) : res
}

// Keep track of active highlights to clean them up
let activeHighlights: Set<{
  element: HTMLElement
  originalBackground: string
  originalTransition: string
  timeoutId: number
}> = new Set()

/**
 * Clears all active highlights immediately
 */
export function clearAllHighlights() {
  // Clear tracked highlights
  activeHighlights.forEach(({ element, originalBackground, originalTransition, timeoutId }) => {
    clearTimeout(timeoutId)
    element.style.backgroundColor = originalBackground
    element.style.transition = originalTransition
  })
  activeHighlights.clear()

  // Also clear any highlights that might not be tracked (backup cleanup)
  // This catches highlights in popovers or other edge cases
  const allHighlightedElements = document.querySelectorAll('[style*="background-color"]')
  allHighlightedElements.forEach((el) => {
    const element = el as HTMLElement
    if (
      element.style.backgroundColor.includes("var(--highlight") ||
      element.style.backgroundColor.includes("#ffeb3b")
    ) {
      element.style.backgroundColor = ""
      element.style.transition = ""
    }
  })
}

/**
 * Highlights an element with a temporary background color effect
 * @param el - The element to highlight
 * @param duration - How long to show the highlight in milliseconds (default: 2000)
 * @param color - The highlight color (default: uses CSS variable --highlight)
 */
export function highlightElement(
  el: HTMLElement,
  duration: number = 2000,
  color: string = "var(--highlight, #ffeb3b40)",
) {
  // Clear any existing highlight on this element
  activeHighlights.forEach((highlight) => {
    if (highlight.element === el) {
      clearTimeout(highlight.timeoutId)
      activeHighlights.delete(highlight)
    }
  })

  // Store original styles
  const originalBackground = el.style.backgroundColor
  const originalTransition = el.style.transition

  // Apply highlight styles
  el.style.transition = "background-color 0.3s ease"
  el.style.backgroundColor = color

  // Set up cleanup
  const timeoutId = window.setTimeout(() => {
    el.style.backgroundColor = originalBackground
    // Remove transition after background fades back
    setTimeout(() => {
      el.style.transition = originalTransition
      // Remove from active highlights
      activeHighlights.forEach((highlight) => {
        if (highlight.element === el) {
          activeHighlights.delete(highlight)
        }
      })
    }, 300)
  }, duration)

  // Track this highlight
  activeHighlights.add({
    element: el,
    originalBackground,
    originalTransition,
    timeoutId,
  })
}

/**
 * Scrolls to an element with buffer space from the page header
 * @param el - The element to scroll to
 * @param buffer - Additional buffer space in pixels (default: 20)
 * @param highlight - Whether to highlight the element after scrolling (default: true)
 */
export function scrollToElementWithBuffer(
  el: HTMLElement,
  buffer: number = 20,
  highlight: boolean = true,
) {
  // Get the height of the header to calculate buffer
  const header = document.querySelector(".page-header") as HTMLElement
  const headerHeight = header ? header.offsetHeight : 0
  const totalOffset = headerHeight + buffer

  // Calculate the target position
  const elementTop = el.offsetTop
  const targetPosition = elementTop - totalOffset

  // Scroll to the calculated position
  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: "smooth",
  })

  // Add highlight effect if requested
  if (highlight) {
    highlightElement(el)
  }
}

/**
 * Scrolls within a container element to a target element with buffer
 * @param container - The container element to scroll within
 * @param target - The target element to scroll to
 * @param buffer - Buffer space in pixels (default: 20)
 * @param highlight - Whether to highlight the element after scrolling (default: true)
 * @param behavior - Scroll behavior (default: 'instant')
 */
export function scrollInContainerToElement(
  container: HTMLElement,
  target: HTMLElement,
  buffer: number = 20,
  highlight: boolean = true,
  behavior: ScrollBehavior = "instant",
) {
  // Use requestAnimationFrame to ensure content is rendered before scrolling
  requestAnimationFrame(() => {
    const targetPosition = target.offsetTop - buffer
    container.scroll({
      top: Math.max(0, targetPosition),
      behavior,
    })

    // Add highlight effect if requested
    if (highlight) {
      // Small delay to ensure scroll completes before highlighting
      setTimeout(() => {
        highlightElement(target)
      }, 50)
    }
  })
}
