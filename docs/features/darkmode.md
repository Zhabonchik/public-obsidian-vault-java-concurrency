---
title: "Darkmode"
tags:
  - component
---

Quartz supports darkmode out of the box that respects the user's theme preference. Any future manual toggles of the darkmode switch will be saved in the browser's local storage so it can be persisted across future page loads.

## Customization

- Removing darkmode: delete all usages of `Plugin.Darkmode()` from `quartz.layout.ts`.
- Install: `npx quartz plugin add github:quartz-community/darkmode`
- Source: [`quartz-community/darkmode`](https://github.com/quartz-community/darkmode)

You can also listen to the `themechange` event to perform any custom logic when the theme changes.

```js
document.addEventListener("themechange", (e) => {
  console.log("Theme changed to " + e.detail.theme) // either "light" or "dark"
  // your logic here
})
```
