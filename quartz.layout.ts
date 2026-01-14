import { PageLayout, SharedLayout } from "./quartz/components/PageLayout"
import * as Component from "./quartz/components"

// 1. 定義排序邏輯（左側導覽順序）
const explorerSortFn = (a, b) => {
  const nameOrder = ["about", "書籍紀錄", "隨筆紀錄", "網站設置LOG", "tags"]
  const i = nameOrder.indexOf(a.name)
  const j = nameOrder.indexOf(b.name)

  if (i !== -1 && j !== -1) return i - j
  if (i !== -1) return -1
  if (j !== -1) return 1

  // 其餘用中文顯示名稱排序
  return (a.displayName ?? a.name).localeCompare(
    b.displayName ?? b.name,
    "zh-Hant",
  )
}

// 2. 統一的 Explorer 設定
const commonExplorer = Component.Explorer({
  title: "🏺 全站導覽",
  sortFn: explorerSortFn,
  folderClickBehavior: "link",
  mapFn: (node) => {
    // 建立一個新節點物件，避免直接改原始資料
    const newNode = { ...node }

    // 特殊命名統一處理
    if (newNode.name === "about" || newNode.displayName?.toLowerCase() === "about") {
      newNode.displayName = "👤 關於我"
    } else if (
      newNode.name === "網站設置LOG" ||
      newNode.displayName?.includes("LOG")
    ) {
      newNode.displayName = "⚙️ 網站設置 LOG"
    }

    // 是否為「檔案節點」（沒有 children）
    const isLeaf = !newNode.children || newNode.children.length === 0

    // 自動在一般檔案前面加「・」
    if (isLeaf && newNode.displayName) {
      const hasEmoji =
        newNode.displayName.includes("👤") ||
        newNode.displayName.includes("⚙️")
      if (!hasEmoji && !newNode.displayName.startsWith("・")) {
        newNode.displayName = "・" + newNode.displayName
      }
    }

    return newNode
  },
})

// 3. 共用元件：head / footer
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  beforeBody: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/vcdvcd214/lin-yung-chang",
      // ⬇ 這一行請用你實際「網站設置 LOG」頁面在瀏覽器看到的路徑
      "⚙️ 建構日誌":
        "https://vcdvcd214.github.io/lin-yung-chang/notes/網站設置LOG/",
      // 或者用站內絕對路徑版本：
      // "⚙️ 建構日誌": "/lin-yung-chang/notes/網站設置LOG/",
    },
  }),
}

// 4. 一般內容頁版型
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
}

// 5. 列表頁版型（例如 tag / 索引）
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
