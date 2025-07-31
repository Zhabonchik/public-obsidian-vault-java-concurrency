---
title: Event System
---

Quartz uses a custom event system to coordinate between navigation and content rendering. Understanding these events is crucial for creating interactive components that work correctly with [[SPA Routing]].

## Event Types

### Navigation Event (`nav`)

The `nav` event is fired when the user navigates to a new page. This should be used for logic that needs to run once per page navigation.

```ts
document.addEventListener("nav", (e: CustomEventMap["nav"]) => {
  // Access the current page URL
  const currentUrl = e.detail.url
  console.log(`User navigated to: ${currentUrl}`)

  // Good for:
  // - Analytics tracking
  // - URL-dependent state updates
  // - Setting up page-level event handlers
  // - Theme/mode initialization
})
```

**When it fires:**

- On initial page load
- On client-side navigation (if SPA routing is enabled)
- Does NOT fire on content re-renders

### Render Event (`render`)

The `render` event is fired when content needs to be processed or updated. This should be used for DOM manipulation and content-specific logic.

```ts
document.addEventListener("render", (e: CustomEventMap["render"]) => {
  // Access the container that was updated
  const container = e.detail.htmlElement

  // Process elements within this container
  const codeBlocks = container.querySelectorAll("pre code")
  codeBlocks.forEach(addSyntaxHighlighting)

  // Good for:
  // - Setting up event listeners on new content
  // - Processing dynamic content (syntax highlighting, math rendering, etc.)
  // - Initializing interactive components
})
```

**When it fires:**

- On initial page load (with `document.body` as the container)
- When popover content is loaded
- When search results are displayed
- After content is decrypted
- Whenever `dispatchRenderEvent()` is called

## Utility Functions

Quartz provides utility functions in `quartz/components/scripts/util.ts` to make working with these events easier:

### `addRenderListener(fn)`

A convenience function for listening to render events:

```ts
import { addRenderListener } from "./util"

addRenderListener((container: HTMLElement) => {
  // Your rendering logic here
  // container is the DOM element that was updated
  const myElements = container.querySelectorAll(".my-component")
  myElements.forEach(setupMyComponent)
})
```

This is equivalent to manually adding a render event listener but with cleaner syntax.

### `dispatchRenderEvent(htmlElement)`

Triggers a render event for a specific DOM element:

```ts
import { dispatchRenderEvent } from "./util"

// After dynamically creating or updating content
const myContainer = document.getElementById("dynamic-content")
// ... update the container content ...
dispatchRenderEvent(myContainer)
```

This will cause all render event listeners to process the specified container.

## Best Practices

### When to use `nav` vs `render`

- **Use `nav` for:** Page-level setup, URL tracking, global state management
- **Use `render` for:** Content processing, element-specific event handlers, DOM manipulation

### Memory Management

Always clean up event handlers to prevent memory leaks:

```ts
addRenderListener((container) => {
  const buttons = container.querySelectorAll(".my-button")

  const handleClick = (e) => {
    /* ... */
  }

  buttons.forEach((button) => {
    button.addEventListener("click", handleClick)
    // Clean up when navigating away
    window.addCleanup(() => {
      button.removeEventListener("click", handleClick)
    })
  })
})
```

The `window.addCleanup()` function ensures handlers are removed when navigating to a new page.

### Scoped Processing

Always scope your render logic to the provided container:

```ts
// ✅ Good - only processes elements within the updated container
addRenderListener((container) => {
  const elements = container.querySelectorAll(".my-element")
  elements.forEach(process)
})

// ❌ Bad - processes all elements on the page
addRenderListener((container) => {
  const elements = document.querySelectorAll(".my-element")
  elements.forEach(process)
})
```

This ensures your logic only runs on newly updated content and avoids duplicate processing.

## Migration from Old System

If you have existing code that used the old `rerender` flag pattern:

```ts
// Old pattern ❌
document.addEventListener("nav", (e) => {
  if (e.detail.rerender) return // Skip rerender events
  // ... setup logic
})
```

You should split this into separate event handlers:

```ts
// New pattern ✅
document.addEventListener("nav", (e) => {
  // Navigation-only logic
  updateURL(e.detail.url)
})

addRenderListener((container) => {
  // Content rendering logic
  setupComponents(container)
})
```

This provides cleaner separation of concerns and better performance.
