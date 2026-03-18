function formatRelativeDate(date: Date, locale: string): string {
  const diffMs = Date.now() - date.getTime()
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  const abs = (n: number) => Math.abs(n)
  const s = Math.round(diffMs / 1000)
  const m = Math.round(diffMs / 60000)
  const h = Math.round(diffMs / 3600000)
  const d = Math.round(diffMs / 86400000)
  const w = Math.round(diffMs / 604800000)
  const mo = Math.round(diffMs / 2592000000)
  const y = Math.round(diffMs / 31536000000)
  if (abs(s) < 60) return rtf.format(-s, "second")
  if (abs(m) < 60) return rtf.format(-m, "minute")
  if (abs(h) < 24) return rtf.format(-h, "hour")
  if (abs(d) < 7) return rtf.format(-d, "day")
  if (abs(w) < 4) return rtf.format(-w, "week")
  if (abs(mo) < 12) return rtf.format(-mo, "month")
  return rtf.format(-y, "year")
}

interface RcItemJson {
  i: number
  t: string
  l: string
  d: number // most-recent-activity timestamp
  c: number // creation date timestamp
  k: "created" | "modified"
  e?: string
  g?: string[]
}

interface RcI18n {
  badgeNew: string
  badgeUpdated: string
  noChanges: string
}

function setupRecentChanges() {
  // Read page locale from <html lang="..."> (set by Quartz from cfg.locale)
  const pageLocale = document.documentElement.lang || "en-US"

  // Refresh relative dates on all pre-rendered items
  const dateEls = document.querySelectorAll<HTMLElement>(".recent-change-date[data-timestamp]")
  dateEls.forEach((el) => {
    const ts = parseInt(el.dataset.timestamp!, 10)
    if (!isNaN(ts)) {
      el.textContent = formatRelativeDate(new Date(ts), pageLocale)
    }
  })

  const containers = document.querySelectorAll<HTMLElement>(".recent-changes")
  containers.forEach((container) => {
    const filterGroup = container.querySelector<HTMLElement>(".recent-changes-filter")
    if (!filterGroup) return

    const locale = container.dataset.locale ?? pageLocale
    const pageSize = parseInt(container.dataset.pageSize ?? "20", 10)
    const isDetailed = container.dataset.detailed === "1"
    const showExcerpt = container.dataset.showExcerpt === "1"
    const showTags = container.dataset.showTags === "1"
    const loadMoreTpl = container.dataset.loadMoreTpl ?? "Load {count} more · {remaining} remaining"
    const i18nData: RcI18n = JSON.parse(container.dataset.i18n ?? "{}")

    const list = container.querySelector<HTMLUListElement>(".recent-changes-list")
    const loadMoreBtn = container.querySelector<HTMLButtonElement>(".recent-changes-load-more")
    const tabDesc = container.querySelector<HTMLParagraphElement>(".rc-tab-desc")

    if (!list) return
    const safeList = list

    const dataScript = container.querySelector<HTMLScriptElement>(".rc-items-data")
    if (!dataScript) return

    let allData: RcItemJson[]
    try {
      allData = JSON.parse(dataScript.textContent ?? "[]")
    } catch {
      return
    }

    // Three sort views:
    //   "all"      → all notes by most recent activity
    //   "created"  → ALL notes by creation date (the "New" tab)
    //   "modified" → only modified notes by modification date
    const sortedArrays: Record<string, RcItemJson[]> = {
      all: [...allData].sort((a, b) => b.d - a.d),
      created: [...allData].sort((a, b) => b.c - a.c),
      modified: allData.filter((x) => x.k === "modified").sort((a, b) => b.d - a.d),
    }

    // Human-readable descriptions for each tab
    const tabDescriptions: Record<string, string> = {
      all: `All ${allData.length} notes · most recent activity first`,
      created: `All ${allData.length} notes · sorted by when they were added`,
      modified: `${sortedArrays.modified.length} revised notes · latest changes first`,
    }

    // Per-tab injection pointer
    const injectedCount: Record<string, number> = { all: 0, created: 0, modified: 0 }

    let currentFilter = localStorage.getItem("recent-changes-filter") ?? "all"

    function createItemEl(item: RcItemJson, filter: string): HTMLLIElement {
      const li = document.createElement("li")
      li.className = `recent-change-item ${item.k}`
      li.dataset.type = item.k

      const a = document.createElement("a")
      a.href = item.l
      a.className = "recent-change-link internal"
      const titleSpan = document.createElement("span")
      titleSpan.className = "recent-change-title"
      titleSpan.textContent = item.t
      a.appendChild(titleSpan)
      li.appendChild(a)

      const meta = document.createElement("div")
      meta.className = "recent-change-meta"

      const typeSpan = document.createElement("span")
      typeSpan.className = "recent-change-type"
      typeSpan.textContent =
        item.k === "created" ? (i18nData.badgeNew ?? "New") : (i18nData.badgeUpdated ?? "Edited")
      meta.appendChild(typeSpan)

      // Use creation timestamp for the "New" tab, activity timestamp otherwise
      const ts = filter === "created" ? item.c : item.d
      const dateSpan = document.createElement("span")
      dateSpan.className = "recent-change-date"
      dateSpan.dataset.timestamp = ts.toString()
      dateSpan.textContent = formatRelativeDate(new Date(ts), locale)
      meta.appendChild(dateSpan)

      li.appendChild(meta)

      if (isDetailed && showExcerpt && item.e) {
        const p = document.createElement("p")
        p.className = "recent-change-excerpt"
        p.textContent = item.e
        li.appendChild(p)
      }

      if (isDetailed && showTags && item.g?.length) {
        const tagsDiv = document.createElement("div")
        tagsDiv.className = "recent-change-tags"
        item.g.forEach((tag) => {
          const tagSpan = document.createElement("span")
          tagSpan.className = "recent-change-tag"
          tagSpan.textContent = tag
          tagsDiv.appendChild(tagSpan)
        })
        li.appendChild(tagsDiv)
      }

      return li
    }

    function updateTabDesc(filter: string) {
      if (tabDesc) tabDesc.textContent = tabDescriptions[filter] ?? ""
    }

    function updateLoadMoreBtn(filter: string) {
      if (!loadMoreBtn) return
      const arr = sortedArrays[filter] ?? []
      const loaded = injectedCount[filter]
      const remaining = arr.length - loaded
      if (remaining <= 0) {
        loadMoreBtn.style.display = "none"
      } else {
        const count = Math.min(pageSize, remaining)
        loadMoreBtn.textContent = loadMoreTpl
          .replace("{count}", String(count))
          .replace("{remaining}", String(remaining))
        loadMoreBtn.style.display = "block"
      }
    }

    function renderTab(filter: string) {
      safeList.innerHTML = ""
      injectedCount[filter] = 0
      const arr = sortedArrays[filter] ?? []
      const end = Math.min(pageSize, arr.length)
      for (let i = 0; i < end; i++) {
        safeList.appendChild(createItemEl(arr[i], filter))
      }
      injectedCount[filter] = end
      updateTabDesc(filter)
      updateLoadMoreBtn(filter)
    }

    function loadMore(filter: string) {
      const arr = sortedArrays[filter] ?? []
      const start = injectedCount[filter]
      const end = Math.min(start + pageSize, arr.length)
      for (let i = start; i < end; i++) {
        safeList.appendChild(createItemEl(arr[i], filter))
      }
      injectedCount[filter] = end
      updateLoadMoreBtn(filter)
    }

    const buttons = filterGroup.querySelectorAll<HTMLButtonElement>("button[data-filter]")
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter ?? "all"
        localStorage.setItem("recent-changes-filter", currentFilter)
        buttons.forEach((b) => b.classList.toggle("active", b === btn))
        renderTab(currentFilter)
      })
    })

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => loadMore(currentFilter))
    }

    // Restore saved filter button active state
    if (currentFilter !== "all") {
      const savedBtn = filterGroup.querySelector<HTMLButtonElement>(
        `button[data-filter="${currentFilter}"]`,
      )
      if (savedBtn) {
        buttons.forEach((b) => b.classList.remove("active"))
        savedBtn.classList.add("active")
      }
    }

    // Initialize: keep SSR items if on "all" tab, otherwise rebuild
    if (currentFilter === "all") {
      injectedCount.all = safeList.querySelectorAll(".recent-change-item").length
      updateTabDesc("all")
      updateLoadMoreBtn("all")
    } else {
      renderTab(currentFilter)
    }
  })
}

document.addEventListener("nav", setupRecentChanges)
