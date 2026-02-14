import { FullPageLayout } from "./quartz/cfg"
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

export const layout: {
  defaults: Partial<FullPageLayout>
  byPageType: Record<string, Partial<FullPageLayout>>
} = {
  // Components shared across all page types (can be overridden per page type)
  defaults: {
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
  },

  // Per-page-type layout overrides
  byPageType: {
    // Content pages (single notes)
    content: {
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
    },

    // Folder listing pages
    folder: {
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
    },

    // Tag listing pages
    tag: {
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
    },

    // 404 page — minimal layout
    "404": {
      beforeBody: [],
      left: [],
      right: [],
    },

    // Canvas pages — expansive layout, no sidebars
    canvas: {
      beforeBody: [breadcrumbsComponent, articleTitleComponent],
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
      right: [graphComponent, Component.DesktopOnly(tocComponent), backlinksComponent],
    },
  },
}
