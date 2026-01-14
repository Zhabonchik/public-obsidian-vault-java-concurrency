import { PageLayout, SharedLayout } from "./quartz/components/PageLayout"
import * as Component from "./quartz/components"

// 排序邏輯
const customSortFn = (a, b) => {
  const nameOrder = ["about", "書籍紀錄", "隨筆紀錄", "tags"]
  const i = nameOrder.indexOf(a.name)
  const j = nameOrder.indexOf(b.name)
  if (i !== -1 && j !== -1) return i - j
  if (i !== -1) return -1
  if (j !== -1) return 1
  return (a.displayName ?? a.name).localeCompare(b.displayName ?? b.name, "zh-Hant")
}

// 修復重點：sharedPageComponents 必須包含 beforeBody: []
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  beforeBody: [], // ← 就是這裡！必須是陣列，不能漏掉
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
      sortFn: customSortFn,
    }),
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
    Component.Explorer({
      title: "🏺 全站導覽",
      sortFn: customSortFn,
    }),
  ],
  right: [],
  center: [
    Component.Breadcrumbs(),
    Component.Content(),
  ],
}
