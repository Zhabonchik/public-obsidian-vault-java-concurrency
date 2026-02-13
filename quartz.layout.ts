import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as Plugin from "./.quartz/plugins"

// Create plugin components once and reuse across layouts
const explorerComponent = Plugin.Explorer()
const graphComponent = Plugin.Graph()
const searchComponent = Plugin.Search()
const backlinksComponent = Plugin.Backlinks()
const tocComponent = Plugin.TableOfContents()
const articleTitleComponent = Plugin.ArticleTitle()
const contentMetaComponent = Plugin.ContentMeta()
const tagListComponent = Plugin.TagList()
const pageTitleComponent = Plugin.PageTitle()
const darkmodeComponent = Plugin.Darkmode()
const readerModeComponent = Plugin.ReaderMode()
const breadcrumbsComponent = Plugin.Breadcrumbs()

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    // Plugin.Comments({
    //   provider: "giscus",
    //   options: {}}),
  ],
  footer: Plugin.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: breadcrumbsComponent,
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
  beforeBody: [breadcrumbsComponent, articleTitleComponent, contentMetaComponent],
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
