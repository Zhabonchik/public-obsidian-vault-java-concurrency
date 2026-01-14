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

// 2. 定義統一的 Explorer 邏輯 (解決點點與 Emoji 躁感)
const commonExplorer = Component.Explorer({
  title: "🏺 全站導覽",
  sortFn: explorerSortFn,
  folderClickBehavior: "link",
  mapFn: (node) => {
    if (node.name === "about" || node.displayName?.toLowerCase() === "about") {
      node.displayName = "👤 關於我"
    } else if (node.name === "網站設置LOG" || node.displayName?.includes("LOG")) {
      node.displayName = "⚙️ 網站設置 LOG"
    }
    
    // 只要是檔案，前面強制加點點
    if (node.file && node.displayName && !node.displayName.startsWith("・")) {
      const isSpecial = node.displayName.includes("👤") || node.displayName.includes("⚙️")
      if (!isSpecial) {
        node.displayName = "・" + node.displayName
      }
    }
  },
})

// 3. 匯出共用組件
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  beforeBody: [], 
  afterBody: [],
  footer: Component.Footer({
    links: {
      "GitHub": "https://github.com/vcdvcd214/lin-yung-chang",
      "⚙️ 建構日誌": "網站設置LOG", 
    },
  }),
}

// 4. 匯出內容頁佈局 (一定要有 export)
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

// 5. 匯出列表頁佈局 (一定要有 export)
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