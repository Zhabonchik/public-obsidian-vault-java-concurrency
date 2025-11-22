import { registerEscapeHandler, removeAllChildren } from "./util"

interface Position {
  x: number
  y: number
}

class DiagramPanZoom {
  private isDragging = false
  private startPan: Position = { x: 0, y: 0 }
  private currentPan: Position = { x: 0, y: 0 }
  private scale = 1
  private readonly MIN_SCALE = 0.5
  private readonly MAX_SCALE = 5
  private lastTouchDistance = 0

  cleanups: (() => void)[] = []

  constructor(
    private container: HTMLElement,
    private content: HTMLElement,
  ) {
    this.setupEventListeners()
    this.setupNavigationControls()
    this.resetTransform()
  }

  private setupEventListeners() {
    // Mouse drag events
    const mouseDownHandler = this.onMouseDown.bind(this)
    const mouseMoveHandler = this.onMouseMove.bind(this)
    const mouseUpHandler = this.onMouseUp.bind(this)
    const resizeHandler = this.resetTransform.bind(this)

    // Touch events
    const touchStartHandler = this.onTouchStart.bind(this)
    const touchMoveHandler = this.onTouchMove.bind(this)
    const touchEndHandler = this.onTouchEnd.bind(this)

    this.container.addEventListener("mousedown", mouseDownHandler)
    document.addEventListener("mousemove", mouseMoveHandler)
    document.addEventListener("mouseup", mouseUpHandler)
    window.addEventListener("resize", resizeHandler)

    this.container.addEventListener("touchstart", touchStartHandler, { passive: false })
    this.container.addEventListener("touchmove", touchMoveHandler, { passive: false })
    this.container.addEventListener("touchend", touchEndHandler)

    this.cleanups.push(
      () => this.container.removeEventListener("mousedown", mouseDownHandler),
      () => document.removeEventListener("mousemove", mouseMoveHandler),
      () => document.removeEventListener("mouseup", mouseUpHandler),
      () => window.removeEventListener("resize", resizeHandler),
      () => this.container.removeEventListener("touchstart", touchStartHandler),
      () => this.container.removeEventListener("touchmove", touchMoveHandler),
      () => this.container.removeEventListener("touchend", touchEndHandler),
    )
  }

  cleanup() {
    for (const cleanup of this.cleanups) {
      cleanup()
    }
  }

  private setupNavigationControls() {
    const controls = document.createElement("div")
    controls.className = "mermaid-controls"

    // Zoom controls
    const zoomIn = this.createButton("+", () => this.zoom(0.25))
    const zoomOut = this.createButton("-", () => this.zoom(-0.25))
    const resetBtn = this.createButton("Reset", () => this.resetTransform())

    controls.appendChild(zoomOut)
    controls.appendChild(resetBtn)
    controls.appendChild(zoomIn)

    this.container.appendChild(controls)
  }

  private createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button")
    button.textContent = text
    button.className = "mermaid-control-button"
    button.addEventListener("click", onClick)
    window.addCleanup(() => button.removeEventListener("click", onClick))
    return button
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return // Only handle left click
    this.isDragging = true
    this.startPan = { x: e.clientX - this.currentPan.x, y: e.clientY - this.currentPan.y }
    this.container.style.cursor = "grabbing"
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return
    e.preventDefault()

    this.currentPan = {
      x: e.clientX - this.startPan.x,
      y: e.clientY - this.startPan.y,
    }

    this.updateTransform()
  }

  private onMouseUp() {
    this.isDragging = false
    this.container.style.cursor = "grab"
  }

  private getTouchDistance(touches: TouchList): number {
    const touch1 = touches[0]
    const touch2 = touches[1]
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  private onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      // Single touch - start panning
      this.isDragging = true
      this.startPan = {
        x: e.touches[0].clientX - this.currentPan.x,
        y: e.touches[0].clientY - this.currentPan.y,
      }
    } else if (e.touches.length === 2) {
      // Two touches - start zooming
      this.isDragging = false
      this.lastTouchDistance = this.getTouchDistance(e.touches)
    }
  }

  private onTouchMove(e: TouchEvent) {
    if (e.touches.length === 1 && this.isDragging) {
      // Pan
      e.preventDefault()
      this.currentPan = {
        x: e.touches[0].clientX - this.startPan.x,
        y: e.touches[0].clientY - this.startPan.y,
      }
      this.updateTransform()
    } else if (e.touches.length === 2) {
      // Zoom
      e.preventDefault()
      const currentDistance = this.getTouchDistance(e.touches)
      const delta = (currentDistance - this.lastTouchDistance) * 0.02

      const center = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      }

      this.zoom(delta, center)
      this.lastTouchDistance = currentDistance
    }
  }

  private onTouchEnd(e: TouchEvent) {
    if (e.touches.length === 0) {
      this.isDragging = false
    } else if (e.touches.length === 1) {
      // Switch to panning if one finger remains
      this.isDragging = true
      this.startPan = {
        x: e.touches[0].clientX - this.currentPan.x,
        y: e.touches[0].clientY - this.currentPan.y,
      }
    }
  }

  private zoom(delta: number, center?: Position) {
    const newScale = Math.min(Math.max(this.scale + delta, this.MIN_SCALE), this.MAX_SCALE)

    // Calculate zoom center relative to container
    const rect = this.container.getBoundingClientRect()
    let pX: number
    let pY: number

    if (center) {
      pX = center.x - rect.left
      pY = center.y - rect.top
    } else {
      // Default to center of container
      pX = rect.width / 2
      pY = rect.height / 2
    }

    const scaleRatio = newScale / this.scale
    this.currentPan.x = pX - (pX - this.currentPan.x) * scaleRatio
    this.currentPan.y = pY - (pY - this.currentPan.y) * scaleRatio

    this.scale = newScale
    this.updateTransform()
  }

  private updateTransform() {
    this.content.style.transform = `translate(${this.currentPan.x}px, ${this.currentPan.y}px) scale(${this.scale})`
  }

  private resetTransform() {
    this.content.style.transition = "none" // Disable transition for instant reset
    this.content.style.transform = "" // Reset transform to get accurate dimensions

    const containerRect = this.container.getBoundingClientRect()
    const contentRect = this.content.getBoundingClientRect()

    // Calculate scale to fit
    const widthRatio = containerRect.width / contentRect.width
    const heightRatio = containerRect.height / contentRect.height
    const fitScale = Math.min(widthRatio, heightRatio) * 0.9 // 90% fit

    // Clamp scale
    this.scale = Math.min(Math.max(fitScale, this.MIN_SCALE), this.MAX_SCALE)

    // Center based on new scale
    this.currentPan = {
      x: (containerRect.width - contentRect.width * this.scale) / 2,
      y: (containerRect.height - contentRect.height * this.scale) / 2,
    }

    this.updateTransform()

    // Re-enable transition after a frame
    requestAnimationFrame(() => {
      this.content.style.transition = ""
    })
  }
}

const cssVars = [
  "--secondary",
  "--tertiary",
  "--gray",
  "--light",
  "--lightgray",
  "--highlight",
  "--dark",
  "--darkgray",
  "--codeFont",
] as const

let mermaidImport = undefined
document.addEventListener("nav", async () => {
  const center = document.querySelector(".center") as HTMLElement
  const nodes = center.querySelectorAll("code.mermaid") as NodeListOf<HTMLElement>
  if (nodes.length === 0) return

  mermaidImport ||= await import(
    // @ts-ignore
    "https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.esm.min.mjs"
  )
  const mermaid = mermaidImport.default

  const textMapping: WeakMap<HTMLElement, string> = new WeakMap()
  for (const node of nodes) {
    textMapping.set(node, node.innerText)
  }

  async function renderMermaid() {
    // de-init any other diagrams
    for (const node of nodes) {
      node.removeAttribute("data-processed")
      const oldText = textMapping.get(node)
      if (oldText) {
        node.innerHTML = oldText
      }
    }

    const computedStyleMap = cssVars.reduce(
      (acc, key) => {
        acc[key] = window.getComputedStyle(document.documentElement).getPropertyValue(key)
        return acc
      },
      {} as Record<(typeof cssVars)[number], string>,
    )

    const darkMode = document.documentElement.getAttribute("saved-theme") === "dark"
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: darkMode ? "dark" : "base",
      themeVariables: {
        fontFamily: computedStyleMap["--codeFont"],
        primaryColor: computedStyleMap["--light"],
        primaryTextColor: computedStyleMap["--darkgray"],
        primaryBorderColor: computedStyleMap["--tertiary"],
        lineColor: computedStyleMap["--darkgray"],
        secondaryColor: computedStyleMap["--secondary"],
        tertiaryColor: computedStyleMap["--tertiary"],
        clusterBkg: computedStyleMap["--light"],
        edgeLabelBackground: computedStyleMap["--highlight"],
      },
    })

    await mermaid.run({ nodes })
  }

  await renderMermaid()
  document.addEventListener("themechange", renderMermaid)
  window.addCleanup(() => document.removeEventListener("themechange", renderMermaid))

  for (let i = 0; i < nodes.length; i++) {
    const codeBlock = nodes[i] as HTMLElement
    const pre = codeBlock.parentElement as HTMLPreElement
    const clipboardBtn = pre.querySelector(".clipboard-button") as HTMLButtonElement
    const expandBtn = pre.querySelector(".expand-button") as HTMLButtonElement

    const clipboardStyle = window.getComputedStyle(clipboardBtn)
    const clipboardWidth =
      clipboardBtn.offsetWidth +
      parseFloat(clipboardStyle.marginLeft || "0") +
      parseFloat(clipboardStyle.marginRight || "0")

    // Set expand button position
    expandBtn.style.right = `calc(${clipboardWidth}px + 0.3rem)`
    pre.prepend(expandBtn)

    // query popup container
    const popupContainer = pre.querySelector("#mermaid-container") as HTMLElement
    if (!popupContainer) return

    let panZoom: DiagramPanZoom | null = null
    function showMermaid() {
      const container = popupContainer.querySelector("#mermaid-space") as HTMLElement
      const content = popupContainer.querySelector(".mermaid-content") as HTMLElement
      if (!content) return
      removeAllChildren(content)

      // Clone the mermaid content
      const mermaidContent = codeBlock.querySelector("svg")!.cloneNode(true) as SVGElement
      content.appendChild(mermaidContent)

      // Show container
      popupContainer.classList.add("active")
      container.style.cursor = "grab"

      // Initialize pan-zoom after showing the popup
      panZoom = new DiagramPanZoom(container, content)
    }

    function hideMermaid() {
      popupContainer.classList.remove("active")
      panZoom?.cleanup()
      panZoom = null
    }

    expandBtn.addEventListener("click", showMermaid)
    registerEscapeHandler(popupContainer, hideMermaid)

    window.addCleanup(() => {
      panZoom?.cleanup()
      expandBtn.removeEventListener("click", showMermaid)
    })
  }
})
