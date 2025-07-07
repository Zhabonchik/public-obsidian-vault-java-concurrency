import { clearAllHighlights, fetchCanonical, scrollInContainerToElement } from "./util"
import { computePosition, flip, inline, shift } from "@floating-ui/dom"

import { normalizeRelativeURLs } from "../../util/path"

const p = new DOMParser()
let activeAnchor: HTMLAnchorElement | null = null

async function mouseEnterHandler(
  this: HTMLAnchorElement,
  { clientX, clientY }: { clientX: number; clientY: number },
) {
  const link = (activeAnchor = this)
  if (link.dataset.noPopover === "true") {
    return
  }

  // Clear any existing highlights immediately when entering a new link
  clearAllHighlights()

  async function setPosition(popoverElement: HTMLElement) {
    const { x, y } = await computePosition(link, popoverElement, {
      strategy: "fixed",
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()],
    })
    Object.assign(popoverElement.style, {
      transform: `translate(${x.toFixed()}px, ${y.toFixed()}px)`,
    })
  }

  function showPopover(popoverElement: HTMLElement, targetHash: string = "") {
    clearActivePopover()
    popoverElement.classList.add("active-popover")
    setPosition(popoverElement as HTMLElement)

    // Always scroll to hash anchor if present, regardless of popover state
    if (targetHash !== "") {
      const popoverInner = popoverElement.querySelector(".popover-inner") as HTMLElement | null
      if (popoverInner) {
        const hashWithoutPound = targetHash.slice(1)
        const targetAnchor = `popover-internal-${hashWithoutPound}`
        
        // Try to find the element by ID first
        let heading = popoverInner.querySelector(`#${targetAnchor}`) as HTMLElement | null
        
        // If not found by ID, try to find by text content (fallback for headings)
        if (!heading) {
          const headings = popoverInner.querySelectorAll('h1, h2, h3, h4, h5, h6')
          for (const h of headings) {
            const headingElement = h as HTMLElement
            const headingText = headingElement.textContent?.trim().toLowerCase() || ''
            const targetText = hashWithoutPound.toLowerCase().replace(/-/g, ' ')
            
            // More strict matching: avoid matching very short headings unless they're exact matches
            const isExactMatch = headingText === targetText
            const isSubstringMatch = headingText.length >= 3 && (
              headingText.includes(targetText) || 
              (targetText.length >= 3 && targetText.includes(headingText))
            )
            
            if (isExactMatch || isSubstringMatch) {
              heading = headingElement
              break
            }
          }
        }
        
        if (heading) {
          // Use utility function to scroll with buffer and highlight
          scrollInContainerToElement(popoverInner, heading, 20, true, "instant")
        }
      }
    }
  }

  const targetUrl = new URL(link.href)
  const hash = decodeURIComponent(targetUrl.hash)
  targetUrl.hash = ""
  targetUrl.search = ""
  const popoverId = `popover-${link.pathname}`
  const prevPopoverElement = document.getElementById(popoverId)

  // dont refetch if there's already a popover
  if (!!document.getElementById(popoverId)) {
    showPopover(prevPopoverElement as HTMLElement, hash)
    return
  }

  const response = await fetchCanonical(targetUrl).catch((err) => {
    console.error(err)
  })

  if (!response) return
  const [contentType] = response.headers.get("Content-Type")!.split(";")
  const [contentTypeCategory, typeInfo] = contentType.split("/")

  const popoverElement = document.createElement("div")
  popoverElement.id = popoverId
  popoverElement.classList.add("popover")
  const popoverInner = document.createElement("div")
  popoverInner.classList.add("popover-inner")
  popoverInner.dataset.contentType = contentType ?? undefined
  popoverElement.appendChild(popoverInner)

  switch (contentTypeCategory) {
    case "image":
      const img = document.createElement("img")
      img.src = targetUrl.toString()
      img.alt = targetUrl.pathname

      popoverInner.appendChild(img)
      break
    case "application":
      switch (typeInfo) {
        case "pdf":
          const pdf = document.createElement("iframe")
          pdf.src = targetUrl.toString()
          popoverInner.appendChild(pdf)
          break
        default:
          break
      }
      break
    default:
      const contents = await response.text()
      const html = p.parseFromString(contents, "text/html")
      normalizeRelativeURLs(html, targetUrl)
      // prepend all IDs inside popovers to prevent duplicates
      html.querySelectorAll("[id]").forEach((el) => {
        const targetID = `popover-internal-${el.id}`
        el.id = targetID
      })
      const elts = Array.from(html.getElementsByClassName("popover-hint"))
      if (elts.length === 0) return

      elts.forEach((elt) => popoverInner.appendChild(elt))
  }

  if (!!document.getElementById(popoverId)) {
    return
  }

  document.body.appendChild(popoverElement)
  if (activeAnchor !== this) {
    return
  }

  showPopover(popoverElement, hash)
}

function clearActivePopover() {
  activeAnchor = null
  const allPopoverElements = document.querySelectorAll(".popover")
  allPopoverElements.forEach((popoverElement) => popoverElement.classList.remove("active-popover"))
  // Clear any remaining highlights when closing popovers
  clearAllHighlights()
}

function clearActivePopoverAndHighlights() {
  clearActivePopover()
  // Also clear highlights immediately when mouse leaves
  clearAllHighlights()
}

document.addEventListener("nav", () => {
  const links = Array.from(document.querySelectorAll("a.internal")) as HTMLAnchorElement[]
  for (const link of links) {
    link.addEventListener("mouseenter", mouseEnterHandler)
    link.addEventListener("mouseleave", clearActivePopoverAndHighlights)
    // Use type assertion to avoid TypeScript error when checking individual files
    if (typeof (window as any).addCleanup === 'function') {
      (window as any).addCleanup(() => {
        link.removeEventListener("mouseenter", mouseEnterHandler)
        link.removeEventListener("mouseleave", clearActivePopoverAndHighlights)
      })
    }
  }
})
