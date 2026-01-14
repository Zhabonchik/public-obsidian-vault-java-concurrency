const commonExplorer = Component.Explorer({
  title: "🏺 全站導覽",
  sortFn: explorerSortFn,
  folderClickBehavior: "link",
  mapFn: (node) => {
    // 1. 特殊節點命名 (優先處理)
    if (node.name === "about" || node.displayName?.toLowerCase() === "about") {
      node.displayName = "👤 關於我"
    } else if (node.name === "網站設置LOG" || node.displayName?.includes("LOG")) {
      node.displayName = "⚙️ 網站設置 LOG"
    }
    
    // 2. 檔案點點 (加上關鍵判斷)
    // 這裡我們多加一個判斷：如果 displayName 已經有 Emoji，就不加點點
    if (
      node.file && 
      node.displayName && 
      !node.displayName.startsWith("・") &&
      !node.displayName.includes("👤") && 
      !node.displayName.includes("⚙️")
    ) {
      node.displayName = "・" + node.displayName
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
      // 🚀 關鍵修正：如果你點擊會 404，請確認檔案在根目錄
      // 在 Quartz 4 中，連結通常不需要 .md，但開頭的 / 有時會造成 SPA 路由誤判
      "⚙️ 建構日誌": "網站設置LOG", 
    },
  }),
}