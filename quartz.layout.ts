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

  return (a.displayName ?? a.name).localeCompare(
    b.displayName ?? b.name,
    "zh-Hant",
  )
}

// 2. 定義統一的 Explorer 邏輯
const commonExplorer = Component.Explorer({
  title: "🏺 全站導覽",
  folderClickBehavior: "link",
  sortFn: explorerSortFn,
  mapFn: (node) => {
    // 處理特殊資料夾/檔案名稱加 Emoji
    // 透過 name (檔名/資料夾名) 或 displayName (標題) 來對應
    
    // 1. 關於我
    if (node.name === "about" || node.displayName?.toLowerCase() === "about") {
      node.displayName = "👤 關於我"
    } 
    // 2. 網站設置 LOG
    else if (node.name === "網站設置LOG" || node.displayName?.includes("網站設置LOG")) {
      node.displayName = "⚙️ 網站設置 LOG"
    }
    // 3. 隨筆紀錄 (新增)
    else if (node.name === "隨筆紀錄" || node.displayName === "隨筆紀錄") {
      node.displayName = "✍️ 隨筆紀錄"
    }
    // 4. 書籍紀錄 (順手幫你加上，看起來比較整齊，如果不喜歡可刪除這段)
    else if (node.name === "書籍紀錄" || node.displayName === "書籍紀錄") {
      node.displayName = "📚 書籍紀錄"
    }

    // 【檔案節點加點點邏輯】
    // node.file 存在代表它是具體的檔案頁面（非資料夾）
    if (node.file) {
      // 檢查是否已經有 emoji（包含上面剛加的，或是標題自帶的）
      const hasEmoji = /\p{Emoji}/u.test(node.displayName ?? "")
      
      // 如果沒有 Emoji 且沒有點點，才加上「・」
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
      GitHub: "https://github.com/vcdvcd214/lin-yung-chang",
      "⚙️ 建構日誌":
        "https://vcdvcd214.github.io/lin-yung-chang/notes/網站設置LOG/",
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
  center: [Component.Breadcrumbs(), Component.Content()],
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
  center: [Component.Breadcrumbs(), Component.Content()],
}
