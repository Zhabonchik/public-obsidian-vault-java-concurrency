---
title: "View Transitions"
---

View Transitions provide smooth, animated page transitions when navigating between pages in Quartz. This progressively enhances the [[SPA Routing]] experience by utilizing the browser-native [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) where available.

When navigating between pages, if the View Transitions API is supported and enabled, Quartz will wrap the content update in a view transition. This creates smooth, customizable animations as the page content changes, providing a more polished and app-like experience.

Under the hood, Quartz uses [[SPA Routing]] to intercept link clicks and perform client-side navigation. The View Transitions feature builds on top of this by wrapping the DOM updates in `document.startViewTransition()`, allowing the browser to automatically animate the changes between the old and new page states.

> [!info]
> View Transitions require [[SPA Routing]] to be enabled in the [[configuration]]. Browsers that don't support the View Transitions API will fall back to instant page updates without animations.

## Customization

Quartz assigns appropriate `view-transition-name` properties to its component, allowing you to create custom animations for different parts of the page.

### Styling Transitions

You can customize the behavior of these transitions by adding CSS to your `quartz/styles/custom.scss` file. For example:

```scss title="quartz/styles/custom.scss"
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.5s;
}
```

For more advanced customization options, see the [MDN documentation on customizing view transition animations](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#customizing_your_animations).

### Programmatic Transitions

When [[creating components|creating your own components]], you can use the `startViewTransition` utility function to wrap DOM updates in a view transition. This ensures your custom scripts respect your view transition settings.

```typescript
import { startViewTransition } from "./scripts/util"

// Wrap your DOM update in a view transition
startViewTransition(() => {
  // Your DOM updates here
  element.textContent = "New content"
})
```

The `startViewTransition` function will automatically use the View Transitions API if the browser is supported, otherwise it will fallback to eager execution.

## Configuration

View Transitions require both [[SPA Routing]] and the View Transitions feature to be enabled in the [[configuration]]:

1. Enable [[SPA Routing]]: set the `enableSPA` field to `true`
2. Enable View Transitions: set the `enableViewTransitions` field to `true`

```typescript title="quartz.config.ts"
const config: QuartzConfig = {
  configuration: {
    // ...
    enableSPA: true,
    enableViewTransitions: true,
    // ...
  },
}
```
