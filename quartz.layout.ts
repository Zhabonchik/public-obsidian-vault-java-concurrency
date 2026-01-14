import { PageLayout, SharedLayout } from "./quartz/components/PageLayout"
import * as Component from "./quartz/components"

// 1. 定義排序邏輯
const explorerSortFn = (a, b) => {
  const nameOrder = ["about", "書籍紀錄", "隨筆紀錄", "網站設置LOG", "tags"]
  const i = nameOrder.indexOf(a.name)
  const j = nameOrder.indexOf(b.name)
  if (i !== -1 && j !== -1) return i - j
  if (i !== -1) return -1
  if (j !== -1) return 1
  return (a.displayName ?? a.name).localeCompare(b.displayName ?? b.name, "zh-Hant")
}

// 2. 定義統一的 Explorer 邏輯
const commonExplorer = Component.Explorer({
  title: "🏺 全站導覽",
  sortFn: explorerSortFn,
  folderClickBehavior: "link",
  mapFn: (node) => {
    // 處理特殊 Emoji 統一
    if (node.name === "about" || node.displayName?.toLowerCase() === "about") {
      node.displayName = "👤 關於我"
    } else if (node.name === "網站設置LOG" || node.displayName?.includes("LOG")) {
      node.displayName = "⚙️ 網站設置 LOG"
    }
    
    // 【暴力加點點】
    // 如果沒有 children (代表是檔案) 且標題還沒加過點點
    if ((!node.children || node.children.length === 0) && node.displayName) {
      const hasEmoji = node.displayName.includes("👤") || node.displayName.includes("⚙️")
      if (!hasEmoji && !node.displayName.startsWith("・")) {
        node.displayName = "・" + node.displayName
      }
    }
  },
})

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  beforeBody: [], 
  afterBody: [],
  footer: Component.Footer({
    links: {
      "GitHub": "https://github.com/vcdvcd214/lin-yung-chang",
      "⚙️ 建構日誌": "./網站設置LOG", // 🚀 改用相對路徑試試，避免 SPA 路由迷路
    },
  }),
}

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
  center: [
    Component.Breadcrumbs(),
    Component.Content(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    commonExplorer,
  ],
  right: [],
  center: [
    Component.Breadcrumbs(),
    Component.Content(),
  ],
}