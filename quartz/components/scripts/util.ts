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
  window.addCleanup(() => outsideContainer?.removeEventListener("click", click))
  document.addEventListener("keydown", esc)
  window.addCleanup(() => document.removeEventListener("keydown", esc))
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

/**
 * Highlights an element with a temporary background color effect
 * @param el - The element to highlight
 * @param duration - How long to show the highlight in milliseconds (default: 2000)
 * @param color - The highlight color (default: uses CSS variable --highlight)
 */
export function highlightElement(el: HTMLElement, duration: number = 2000, color: string = 'var(--highlight, #ffeb3b40)') {
  // Store original styles
  const originalBackground = el.style.backgroundColor
  const originalTransition = el.style.transition
  
  // Apply highlight styles
  el.style.transition = 'background-color 0.3s ease'
  el.style.backgroundColor = color
  
  // Remove highlight after specified duration
  setTimeout(() => {
    el.style.backgroundColor = originalBackground
    // Remove transition after background fades back
    setTimeout(() => {
      el.style.transition = originalTransition
    }, 300)
  }, duration)
}

/**
 * Scrolls to an element with buffer space from the page header
 * @param el - The element to scroll to
 * @param buffer - Additional buffer space in pixels (default: 20)
 * @param highlight - Whether to highlight the element after scrolling (default: true)
 */
export function scrollToElementWithBuffer(el: HTMLElement, buffer: number = 20, highlight: boolean = true) {
  // Get the height of the header to calculate buffer
  const header = document.querySelector('.page-header') as HTMLElement
  const headerHeight = header ? header.offsetHeight : 0
  const totalOffset = headerHeight + buffer
  
  // Calculate the target position
  const elementTop = el.offsetTop
  const targetPosition = elementTop - totalOffset
  
  // Scroll to the calculated position
  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: 'smooth'
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
  behavior: ScrollBehavior = 'instant'
) {
  const targetPosition = target.offsetTop - buffer
  container.scroll({ 
    top: Math.max(0, targetPosition), 
    behavior 
  })
  
  // Add highlight effect if requested
  if (highlight) {
    highlightElement(target)
  }
}
