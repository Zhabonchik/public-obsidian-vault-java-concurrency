import { PageLayout, SharedLayout } from "./quartz/components/PageLayout"
import * as Component from "./quartz/components"

const explorerSortFn = (a, b) => {
  // 🏆 按照你想要的順序排列，把 LOG 也排進去
  const nameOrder = ["about", "書籍紀錄", "隨筆紀錄", "網站設置LOG", "tags"]
  const i = nameOrder.indexOf(a.name)
  const j = nameOrder.indexOf(b.name)
  if (i !== -1 && j !== -1) return i - j
  if (i !== -1) return -1
  if (j !== -1) return 1
  return (a.displayName ?? a.name).localeCompare(b.displayName ?? b.name, "zh-Hant")
}

// 🎯 這是核心：統一「點點」與「Emoji」的邏輯
const commonExplorer = Component.Explorer({
  title: "🏺 全站導覽",
  sortFn: explorerSortFn,
  mapFn: (node) => {
    // 1. 統一 Emoji：讓關於我與 LOG 不再孤單
    if (node.name === "about") { node.displayName = "👤 關於我" }
    if (node.name === "網站設置LOG") { node.displayName = "⚙️ 網站設置 LOG" }
    
    // 2. 統一點點：只要是檔案，標題前就自動加「・」
    // node.depth > 0 確保資料夾本身不會被加點點
    if (node.depth > 0 && !node.children.length) {
      if (node.displayName && !node.displayName.startsWith("・")) {
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
      "⚙️ 建構日誌": "/網站設置LOG", // 🚀 修正 404：直接指向根目錄檔案
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    commonExplorer, // 套用統一邏輯
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
    commonExplorer, // 🚀 關鍵修正：這裡也要套用 commonExplorer，點進去才會有點點！
  ],
  right: [],
  center: [
    Component.Breadcrumbs(),
    Component.Content(),
  ],
}