import { PageLayout, SharedLayout } from "./quartz/components/PageLayout"
import * as Component from "./quartz/components"

// 🏆 這是定住順序的關鍵邏輯
const explorerSortFn = (a, b) => {
  // 1. 定義你希望看到的絕對順序 (對應資料夾名稱)
  const nameOrder = ["about", "書籍紀錄", "隨筆紀錄", "tags"]
  
  const i = nameOrder.indexOf(a.name)
  const j = nameOrder.indexOf(b.name)

  // 如果都在名單內，按名單排
  if (i !== -1 && j !== -1) return i - j
  // 名單內的優先
  if (i !== -1) return -1
  if (j !== -1) return 1

  // 名單外的按字母排 (如 zh-Hant 確保中文排序穩定)
  return (a.displayName ?? a.name).localeCompare(b.displayName ?? b.name, "zh-Hant")
}

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  beforeBody: [], 
  afterBody: [],
  footer: Component.Footer({
    links: {
      "GitHub": "https://github.com/vcdvcd214/lin-yung-chang",
      "⚙️ 建構日誌": "/隨筆紀錄/網站設置LOG",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer({
  title: "🏺 全站導覽",
  sortFn: explorerSortFn,
  mapFn: (node) => {
    // 只要是檔案（不是資料夾），標題前面就自動加上一個優雅的點點
    if (node.depth > 0 && !node.children.length) {
      if (node.displayName && !node.displayName.startsWith("・")) {
        node.displayName = "・" + node.displayName
      }
    }
  },
}),
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
    Component.Explorer({
      title: "🏺 全站導覽",
      sortFn: explorerSortFn, // 👈 這裡也要套用
    }),
  ],
  right: [],
  center: [
    Component.Breadcrumbs(),
    Component.Content(),
  ],
}