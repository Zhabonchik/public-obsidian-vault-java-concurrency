---
title: CanvasPage
tags:
  - plugin/pageType
---

This plugin is a page type plugin that renders [JSON Canvas](https://jsoncanvas.org) (`.canvas`) files as interactive, pannable and zoomable canvas pages. It supports the full [JSON Canvas 1.0 spec](https://jsoncanvas.org/spec/1.0/), including text nodes with Markdown rendering, file nodes that link to other pages in your vault, link nodes for external URLs, and group nodes for visual organization. Edges between nodes are rendered as SVG paths with optional labels, arrow markers, and colors.

See [[CanvasPage.canvas]] for a live demo showcasing all supported features.

> [!note]
> For information on how to add, remove or configure plugins, see the [[configuration#Plugins|Configuration]] page.

This plugin accepts the following configuration options:

- `enableInteraction`: Whether to enable pan and zoom interaction on the canvas. Default: `true{:ts}`.
- `initialZoom`: The initial zoom level when the canvas is first displayed. Default: `1{:ts}`.
- `minZoom`: The minimum zoom level allowed when zooming out. Default: `0.1{:ts}`.
- `maxZoom`: The maximum zoom level allowed when zooming in. Default: `5{:ts}`.
- `defaultFullscreen`: Whether canvas pages default to fullscreen mode. When enabled, the canvas fills the entire viewport on load. Users can toggle fullscreen with the button in the top-right corner, or press `Escape` to exit. Default: `false{:ts}`.

### Features

- **Text nodes**: Render Markdown content including headings, bold, italic, strikethrough, lists, links, and code blocks via [GFM](https://github.github.com/gfm/) support.
- **File nodes**: Link to other pages in your vault. Supports popover previews on hover.
- **Link nodes**: Reference external URLs.
- **Group nodes**: Visual grouping containers with optional labels and background colors.
- **Edges**: SVG connections between nodes with optional labels, arrow markers, and colors. Supports all four sides (top, right, bottom, left) and both preset colors (1–6) and custom hex colors.
- **Fullscreen mode**: Toggle button to expand the canvas to fill the viewport. Configurable default via `defaultFullscreen`.
- **Preset colors**: Six preset colors (red, orange, yellow, green, cyan, purple) plus custom hex colors (`#RRGGBB`) for nodes and edges.

## API

- Category: Page Type
- Function name: `ExternalPlugin.CanvasPage()`.
- Source: [`quartz-community/canvas-page`](https://github.com/quartz-community/canvas-page)
- Install: `npx quartz plugin add github:quartz-community/canvas-page`
