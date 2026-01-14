// 1. 先定義最強的排序邏輯 (放在檔案上方)
const customSortFn = (a, b) => {
  // 這裡的名稱一定要跟你在 Obsidian 看到的「資料夾名稱」一模一樣
  const nameOrder = ["關於我", "書籍紀錄", "隨筆紀錄", "網站設置LOG", "tags"]
  const i = nameOrder.indexOf(a.name)
  const j = nameOrder.indexOf(b.name)
  if (i !== -1 && j !== -1) return i - j
  if (i !== -1) return -1
  if (j !== -1) return 1
  return (a.displayName ?? a.name).localeCompare(b.displayName ?? b.name, "zh-Hant")
}

// 2. 下面是你的版面配置
export const layout: PageLayout = {
  left: [
    Explorer({
      title: "🏺 全站導覽", // 這裡可以加你要的 Emoji
      sortFn: customSortFn,  // 套用上面那個邏輯
    }),
  ],
  center: [
    Content(),
  ],
  right: [
    Graph(),
    RecentNotes({ title: "最近筆記", limit: 5 }),
    TagList(),
  ],
  // 3. 在頁尾加一個傳送門
  footer: Footer({
    links: {
      "GitHub": "https://github.com/vcdvcd214/lin-yung-chang",
      "⚙️ 建構日誌": "/網站設置LOG", 
    },
  }),
}
