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

// 2. 定義統一的 Explorer 設定
const commonExplorer = Component.Explorer({
  title: "🏺 全站導覽",
  folderClickBehavior: "link",
  sortFn: explorerSortFn,
  mapFn: (node) => {
    // 1. 處理特殊名稱加 Emoji
    if (node.name === "about" || node.displayName?.toLowerCase() === "about") {
      node.displayName = "👤 關於我"
    } else if (
      node.name === "網站設置LOG" ||
      node.displayName?.includes("網站設置LOG")
    ) {
      node.displayName = "⚙️ 網站設置 LOG"
    } else if (node.name === "隨筆紀錄" || node.displayName === "隨筆紀錄") {
      node.displayName = "✍️ 隨筆紀錄"
    } else if (node.name === "書籍紀錄" || node.displayName === "書籍紀錄") {
      node.displayName = "📚 書籍紀錄"
    }

    // 2. 判斷是否為檔案（沒有 children）
    const isFile = !node.children || node.children.length === 0

    // 3. 只有在「檔案」且「標題沒被我們剛剛加過 emoji」時，才加點點
    if (isFile && node.displayName) {
      // 明確檢查：如果標題是這幾個特定 emoji 開頭，就不加點點
      const specialEmojis = ["👤", "⚙️", "✍️", "📚"]
      const startsWithSpecialEmoji = specialEmojis.some((emoji) =>
        node.displayName.startsWith(emoji),
      )

      // 如果不是我們定義的特殊 emoji，也沒有點點，就加上去
      if (!startsWithSpecialEmoji && !node.displayName.startsWith("・")) {
        node.displayName = "・" + node.displayName
      }
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
      "📧 聯絡我": "mailto:vcdvcd@gmail.com",
    },
  }),
}

// 4. 內容頁面版型
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

// 5. 列表頁面版型
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
