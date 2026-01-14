import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        repo: 'vcdvcd214/lin-yung-chang',
        repoId: 'R_kgDOQ47Q9g',
        category: 'Announcements',
        categoryId: 'DIC_kwDOQ47Q9s4C06UC',
        mapping: 'pathname',
        strict: false,
        reactionsEnabled: true,
        inputPosition: 'bottom',
      }
    }),
  ],
  footer: Component.Footer({
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
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "全站導覽",
      folderClickBehavior: "link",
      useSavedState: true,
      // 這是你最需要的排序邏輯

            sortFn: (a, b) => {
        const nameOrder = ["Library", "隨筆", "tags"]
        const i = nameOrder.indexOf(a.name)
        const j = nameOrder.indexOf(b.name)
        
        // 如果兩個都在優先清單中
        if (i !== -1 && j !== -1) return i - j
        
        // 優先項目排在前面
        if (i !== -1) return -1
        if (j !== -1) return 1
        
        // 都不在清單中，按名稱排序
        return a.displayName.localeCompare(b.displayName)
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of

pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "全站導覽",
      folderClickBehavior: "link",
      useSavedState: true,
      sortFn: (a, b) => {
        const nameOrder = ["Library", "隨筆", "tags"]
        const i = nameOrder.indexOf(a.name)
        const j = nameOrder.indexOf(b.name)
        
        // 如果兩個都在優先清單中
        if (i !== -1 && j !== -1) return i - j
        
        // 優先項目排在前面
        if (i !== -1) return -1
        if (j !== -1) return 1
        
        // 都不在清單中，按名稱排序
        return a.displayName.localeCompare(b.displayName)
      },
    }),
  ],
  right: [],
}
