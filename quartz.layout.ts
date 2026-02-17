import { PageLayout, SharedLayout } from "./quartz/components/PageLayout"
import * as Component from "./quartz/components"

// 1. 定義 Explorer 的排序邏輯
const explorerSortFn = (a, b) => {
  const nameOrder = ["about", "書籍紀錄", "隨筆紀錄", "網站設置LOG", "tags"]
  const i = nameOrder.indexOf(a.name)
  const j = nameOrder.indexOf(b.name)

  if (i !== -1 && j !== -1) return i - j
  if (i !== -1) return -1
  if (j !== -1) return 1

  return (a.displayName ?? a.name).localeCompare(
    b.displayName ?? b.name,
    "zh-Hant",
  )
}

// 2. 定義統一的 Explorer 設定（用 iconizeIcon）
const commonExplorer = Component.Explorer({
  title: "🏺 全站導覽",
  folderClickBehavior: "link",
  sortFn: explorerSortFn,
  mapFn: (node) => {
    const isFile = !node.children || node.children.length === 0
    const frontmatter = node.frontmatter ?? {}
    const displayName = node.displayName ?? node.name
    const icon = frontmatter.iconizeIcon ?? ""

    // 1. 有 iconizeIcon 就放在前面，取代原本的手動 emoji
    if (icon) {
      node.displayName = `${icon} ${displayName}`
    } else {
      node.displayName = displayName
    }

    // 2. 如果是「檔案」且沒有 icon / emoji 開頭，就加「・」點
    if (isFile && !icon && !node.displayName.startsWith("・")) {
      node.displayName = "・" + node.displayName
    }
  },
})

// 3. 共用版面設定
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  beforeBody: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/vcdvcd214/lin-yung-chang",
      "⚙️ 建構日誌": "site-log",
      "📧 聯絡我": "mailto:vcdvcd@gmail.com",
    },
  }),
}

// 4. 列表頁面版型（預設完整 Explorer）
export const defaultListPageLayout: PageLayout = {
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    commonExplorer,
  ],
  right: [],
  center: [Component.Breadcrumbs(), Component.Content()],
}

// 5. 內容頁面版型（一般文章頁，用完整 Explorer）
export const defaultContentPageLayout: PageLayout = {
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    commonExplorer,
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
  center: [Component.Breadcrumbs(), Component.Content()],

  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "vcdvcd214/lin-yung-chang",
        repoId: "R_kgDOQ47Q9g",
        category: "General",
        categoryId: "DIC_kwDOQ47Q9s4C06UD",
        mapping: "pathname",
        strict: false,
        reactionsEnabled: true,
        inputPosition: "bottom",
      },
    }),
  ],
}

// 6. notes 首頁版型：只顯示最近 8 篇筆記
export const notesHomePageLayout: PageLayout = {
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.RecentNotes({
      limit: 8,
      linkToMore: "/notes/", // 指向完整日記列表頁
      title: "📝 最近的筆記",
    }),
  ],
  right: [],
  center: [Component.Breadcrumbs(), Component.Content()],
}
