import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { GlobalConfiguration } from "../cfg"
import style from "./styles/recentChanges.scss"
import { ChangedItem } from "./utils/recentChanges"
// @ts-ignore
import script from "./scripts/recentChanges.inline"

interface Options {
  title?: string
  limit: number
  showCreated: boolean
  showModified: boolean
  detailed: boolean
  filterBy: string[]
  showExcerpt: boolean
  showTags: boolean
  showFilter: boolean
  pageSize: number
  linkToMore: SimpleSlug | false
  pages: FullSlug[]
}

const defaultOptions = (_cfg: GlobalConfiguration): Options => ({
  limit: 10,
  showCreated: true,
  showModified: true,
  detailed: false,
  filterBy: [],
  showExcerpt: false,
  showTags: false,
  showFilter: false,
  pageSize: 20,
  linkToMore: false,
  pages: [],
})

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

export default ((userOpts?: Partial<Options>) => {
  const RecentChanges: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const t = i18n(cfg.locale).components.recentChanges

    // Only render on specified pages (empty = all pages)
    if (opts.pages.length > 0 && !opts.pages.some((p) => fileData.slug === p)) {
      return null
    }

    // Filter files with valid dates
    const validFiles = allFiles.filter(
      (file: QuartzPluginData) => file.dates && (file.dates.created || file.dates.modified),
    )

    // Sort by most recent date
    const sortedFiles = validFiles.sort((a: QuartzPluginData, b: QuartzPluginData) => {
      const dateA = a.dates?.modified || a.dates?.created || new Date(0)
      const dateB = b.dates?.modified || b.dates?.created || new Date(0)
      return dateB.getTime() - dateA.getTime()
    })

    // Convert to ChangedItems
    const allItems: ChangedItem[] = sortedFiles.map((file: QuartzPluginData) => {
      const created = file.dates?.created
      const modified = file.dates?.modified

      // A note is "Updated" only if its creation date predates the last modification by >1h.
      const isModified =
        created !== undefined &&
        modified !== undefined &&
        modified.getTime() - created.getTime() > 60 * 60 * 1000

      return {
        title: file.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title,
        link: file.slug as FullSlug,
        date: file.dates?.modified || file.dates?.created || new Date(),
        createdDate: file.dates?.created ?? file.dates?.modified ?? new Date(),
        type: isModified ? "modified" : "created",
        id: `${file.slug}-${isModified ? "modified" : "created"}`,
        excerpt: file.frontmatter?.description,
        tags: file.frontmatter?.tags,
      }
    })

    // Apply type filters
    let filtered = allItems
    if (!opts.showCreated) {
      filtered = filtered.filter((item) => item.type !== "created")
    }
    if (!opts.showModified) {
      filtered = filtered.filter((item) => item.type !== "modified")
    }

    // Apply path filters
    if (opts.filterBy.length > 0) {
      filtered = filtered.filter((item) => opts.filterBy.some((f) => item.link.includes(f)))
    }

    const remaining = Math.max(0, filtered.length - opts.limit)

    // JSON data island: all items as compact JSON for progressive client-side injection.
    // Links are pre-resolved server-side since the client cannot call resolveRelative.
    const allItemsJson = JSON.stringify(
      filtered.map((item) => ({
        title: item.title,
        link: resolveRelative(fileData.slug!, item.link),
        date: item.date.getTime(),
        created: item.createdDate.getTime(),
        type: item.type,
        ...(opts.showExcerpt && item.excerpt ? { excerpt: item.excerpt } : {}),
        ...(opts.showTags && item.tags?.length ? { tags: item.tags } : {}),
      })),
    ).replace(/<\//g, "<\\/")

    // For showFilter: pre-render pageSize items per type so both "New" and "Updated" tabs
    // start with visible content. Each item is tagged with its index in filtered (= allData)
    // via data-idx so the client can correctly initialize its deduplication set.
    // For !showFilter: flat limit cap, no Load More.
    const filteredWithIdx = filtered.map((item, idx) => ({ item, idx }))
    const initialItems = opts.showFilter
      ? [
          ...filteredWithIdx.filter(({ item }) => item.type === "created").slice(0, opts.pageSize),
          ...filteredWithIdx.filter(({ item }) => item.type === "modified").slice(0, opts.pageSize),
        ].sort((a, b) => b.item.date.getTime() - a.item.date.getTime())
      : filteredWithIdx.slice(0, opts.limit)

    // i18n strings passed to the client-side script via data attributes
    const i18nData = JSON.stringify({
      badgeNew: t.badgeNew,
      badgeUpdated: t.badgeUpdated,
      noChanges: t.noChanges,
    })

    return (
      <div
        class={classNames(displayClass, "recent-changes")}
        data-page-size={opts.pageSize}
        data-detailed={opts.detailed ? "1" : "0"}
        data-show-excerpt={opts.showExcerpt ? "1" : "0"}
        data-show-tags={opts.showTags ? "1" : "0"}
        data-locale={cfg.locale}
        data-i18n={i18nData}
        data-load-more-tpl={t.loadMoreTemplate}
      >
        <h3>
          {opts.linkToMore ? (
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>{opts.title ?? t.title}</a>
          ) : (
            (opts.title ?? t.title)
          )}
        </h3>

        {opts.showFilter && (
          <div class="recent-changes-filter" role="group" aria-label="Filter changes">
            <button data-filter="all" class="active">
              {t.filterAll}
            </button>
            <button data-filter="created">{t.filterNew}</button>
            <button data-filter="modified">{t.filterUpdated}</button>
          </div>
        )}

        {opts.showFilter && <p class="rc-tab-desc" aria-live="polite"></p>}

        {filtered.length === 0 ? (
          <p>{t.noChanges}</p>
        ) : (
          <ul class={`recent-changes-list ${opts.detailed ? "detailed" : "condensed"}`}>
            {initialItems.map(({ item, idx }) => (
              <li
                key={item.id}
                class={`recent-change-item ${item.type}`}
                data-type={item.type}
                data-idx={idx}
              >
                <a
                  href={resolveRelative(fileData.slug!, item.link)}
                  class="recent-change-link internal"
                >
                  <span class="recent-change-title">{item.title}</span>
                </a>
                <div class="recent-change-meta">
                  <span class="recent-change-type">
                    {item.type === "created" ? t.badgeNew : t.badgeUpdated}
                  </span>
                  <span class="recent-change-date" data-timestamp={item.date.getTime().toString()}>
                    {formatRelativeDate(item.date, cfg.locale)}
                  </span>
                </div>

                {opts.detailed && opts.showExcerpt && item.excerpt && (
                  <p class="recent-change-excerpt">{item.excerpt}</p>
                )}

                {opts.detailed && opts.showTags && item.tags && item.tags.length > 0 && (
                  <div class="recent-change-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} class="recent-change-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {opts.showFilter && (
          // @ts-ignore — dangerouslySetInnerHTML on <script> is valid in Preact
          <script
            type="application/json"
            class="rc-items-data"
            dangerouslySetInnerHTML={{ __html: allItemsJson }}
          />
        )}

        {opts.showFilter && filtered.length > 0 && (
          <button class="recent-changes-load-more" style="display:none">
            Load more
          </button>
        )}

        {!opts.showFilter && opts.linkToMore && remaining > 0 && (
          <div class="recent-changes-more">
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>View all changes →</a>
          </div>
        )}
      </div>
    )
  }

  RecentChanges.css = style
  RecentChanges.afterDOMLoaded = script
  return RecentChanges
}) satisfies QuartzComponentConstructor
