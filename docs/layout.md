---
title: Layout
---

Certain emitters may also output [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) files. To enable easy customization, these emitters allow you to fully rearrange the layout of the page.

In v5, the layout is defined in `quartz.layout.ts` using a `defaults` + `byPageType` structure.

- `defaults` contains layout components shared across ALL page types (head, header, afterBody, footer).
- `byPageType` contains per-page-type overrides (content, folder, tag, 404) for beforeBody, left, and right sections.

Each page is composed of multiple different sections which contain `QuartzComponents`. The following code snippet lists all of the valid sections that you can add components to:

```typescript title="quartz/cfg.ts"
export interface FullPageLayout {
  head: QuartzComponent // single component
  header: QuartzComponent[] // laid out horizontally
  beforeBody: QuartzComponent[] // laid out vertically
  pageBody: QuartzComponent // single component
  afterBody: QuartzComponent[] // laid out vertically
  left: QuartzComponent[] // vertical on desktop and tablet, horizontal on mobile
  right: QuartzComponent[] // vertical on desktop, horizontal on tablet and mobile
  footer: QuartzComponent // single component
}
```

These correspond to following parts of the page:

| Layout                          | Preview                             |
| ------------------------------- | ----------------------------------- |
| Desktop (width > 1200px)        | ![[quartz-layout-desktop.png\|800]] |
| Tablet (800px < width < 1200px) | ![[quartz-layout-tablet.png\|800]]  |
| Mobile (width < 800px)          | ![[quartz-layout-mobile.png\|800]]  |

> [!note]
> There are two additional layout fields that are _not_ shown in the above diagram.
>
> 1. `head` is a single component that renders the `<head>` [tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) in the HTML. This doesn't appear visually on the page and is only is responsible for metadata about the document like the tab title, scripts, and styles.
> 2. `header` is a set of components that are laid out horizontally and appears _before_ the `beforeBody` section. This enables you to replicate the old Quartz 3 header bar where the title, search bar, and dark mode toggle. By default, Quartz doesn't place any components in the `header`.

### Configuration

Layout components are imported from two main sources:

```ts title="quartz.layout.ts"
import * as Component from "./quartz/components" // internal HOC components
import * as Plugin from "./.quartz/plugins" // community component plugins
```

Internal components (`Component.Head()`, `Component.Spacer()`, `Component.Flex()`, `Component.MobileOnly()`, `Component.DesktopOnly()`, `Component.ConditionalRender()`) are layout utilities. Community component plugins (`Plugin.Explorer()`, `Plugin.Search()`, `Plugin.Darkmode()`, etc.) provide the actual UI features.

Here is a simplified example of the layout structure:

```ts title="quartz.layout.ts"
export const layout = {
  defaults: {
    head: Component.Head(),
    header: [],
    afterBody: [],
    footer: Plugin.Footer({ links: { ... } }),
  },
  byPageType: {
    content: {
      beforeBody: [Plugin.ArticleTitle(), Plugin.ContentMeta(), Plugin.TagList()],
      left: [Plugin.PageTitle(), Plugin.Search(), Plugin.Explorer()],
      right: [Plugin.Graph(), Plugin.TableOfContents(), Plugin.Backlinks()],
    },
    folder: {
      beforeBody: [Plugin.Breadcrumbs(), Plugin.ArticleTitle()],
      left: [Plugin.PageTitle(), Plugin.Search(), Plugin.Explorer()],
      right: [],
    },
    tag: { ... },
    "404": { beforeBody: [], left: [], right: [] },
  },
}
```

Fields defined in `defaults` can be overridden by specific entries in `byPageType`.

Community component plugins are installed via `npx quartz plugin add github:quartz-community/<name>` and imported from `.quartz/plugins`. See [[layout-components]] for built-in layout utilities (Flex, MobileOnly, DesktopOnly, etc.).

You can also checkout the guide on [[creating components]] if you're interested in further customizing the behaviour of Quartz.

### Layout breakpoints

Quartz has different layouts depending on the width the screen viewing the website.

The breakpoints for layouts can be configured in `variables.scss`.

- `mobile`: screen width below this size will use mobile layout.
- `desktop`: screen width above this size will use desktop layout.
- Screen width between `mobile` and `desktop` width will use the tablet layout.

```scss
$breakpoints: (
  mobile: 800px,
  desktop: 1200px,
);
```

### Style

Most meaningful style changes like colour scheme and font can be done simply through the [[configuration#General Configuration|general configuration]] options. However, if you'd like to make more involved style changes, you can do this by writing your own styles. Quartz uses [Sass](https://sass-lang.com/guide/) for styling.

You can see the base style sheet in `quartz/styles/base.scss` and write your own in `quartz/styles/custom.scss`.

> [!note]
> Some components may provide their own styling as well! Community plugins bundle their own styles. If you'd like to customize styling for a specific component, double check the component definition to see how its styles are defined.
