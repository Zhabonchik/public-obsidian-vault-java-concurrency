// quartz.layout.ts
import { PageLayout } from "./quartz/components/PageLayout"
import { Content } from "./quartz/components/Content"
import { Explorer } from "./quartz/components/Explorer"
import { Graph } from "./quartz/components/Graph"
import { RecentNotes } from "./quartz/components/RecentNotes"
import { TagList } from "./quartz/components/TagList"
import { Footer } from "./quartz/components/Footer"

/**
 * Explorer 專用排序函式
 * - 固定優先順序：Library → 隨筆 → tags
 * - 其餘依 displayName（或 name）排序
 */
const explorerSortFn = (a: any, b: any) => {
  const nameOrder = ["Library", "隨筆", "tags"]
  const i = nameOrder.indexOf(a.name)
  const j = nameOrder.indexOf(b.name)

  if (i !== -1 && j !== -1) return i - j
  if (i !== -1) return -1
  if (j !== -1) return 1

  return (a.displayName ?? a.name).localeCompare(
    b.displayName ?? b.name,
    "zh-Hant"
  )
}

export const layout: PageLayout = {
  left: [
    Explorer({
      title: "", // ← 之後你要下什麼 title，直接改這裡
      sortFn: explorerSortFn,
    }),
  ],

  right: [
    Graph(),
    RecentNotes({
      title: "最近筆記",
      limit: 5,
    }),
    TagList(),
  ],

  center: [
    Content(),
  ],

  footer: Footer(),
}
