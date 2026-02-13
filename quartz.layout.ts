import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent } from "./quartz/components/types"
import * as Plugin from "./.quartz/plugins"

// Create plugin components once and reuse across layouts
const explorerComponent = Plugin.Explorer() as QuartzComponent
const graphComponent = Plugin.Graph() as QuartzComponent
const searchComponent = Plugin.Search() as QuartzComponent
const backlinksComponent = Plugin.Backlinks() as QuartzComponent
const tocComponent = Plugin.TableOfContents() as QuartzComponent
const articleTitleComponent = Plugin.ArticleTitle() as QuartzComponent
const contentMetaComponent = Plugin.ContentMeta() as QuartzComponent
const tagListComponent = Plugin.TagList() as QuartzComponent
const pageTitleComponent = Plugin.PageTitle() as QuartzComponent
const darkmodeComponent = Plugin.Darkmode() as QuartzComponent
const readerModeComponent = Plugin.ReaderMode() as QuartzComponent

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    // Plugin.Comments({
    //   provider: "giscus",
    //   options: {}) as QuartzComponent,
  ],
  footer: Plugin.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }) as QuartzComponent,
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    articleTitleComponent,
    contentMetaComponent,
    tagListComponent,
  ],
  left: [
    pageTitleComponent,
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: searchComponent,
          grow: true,
        },
        { Component: darkmodeComponent },
        { Component: readerModeComponent },
      ],
    }),
    explorerComponent,
  ],
  right: [graphComponent, Component.DesktopOnly(tocComponent), backlinksComponent],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), articleTitleComponent, contentMetaComponent],
  left: [
    pageTitleComponent,
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: searchComponent,
          grow: true,
        },
        { Component: darkmodeComponent },
      ],
    }),
    explorerComponent,
  ],
  right: [],
}
