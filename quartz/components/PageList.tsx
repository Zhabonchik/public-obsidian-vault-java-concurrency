import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort folders first
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    // If both are folders or both are files, sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
  sort?: SortFn
  showTags?: boolean
  variant?: "default" | "home"
} & QuartzComponentProps

export const PageList: QuartzComponent = ({
  cfg,
  fileData,
  allFiles,
  limit,
  sort,
  showTags = true,
  variant = "default",
}: Props) => {
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst(cfg)
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  if (variant === "home") {
    return (
      <ul class="page-list-home">
        {list.map((page) => {
          const title = page.frontmatter?.title ?? "Untitled"
          const date = page.dates ? getDate(cfg, page) : null

          return (
            <li class="page-list-home-item">
              <a
                href={resolveRelative(fileData.slug!, page.slug!)}
                class="page-list-home-title internal"
              >
                {title}
              </a>
              {date && (
                <span class="page-list-home-date">
                  <Date date={date} locale={cfg.locale} />
                </span>
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <ul class="section-ul">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []

        return (
          <li class="section-li">
            <div class={showTags ? "section" : "section no-tags"}>
              <p class="meta">
                {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
              </p>
              <div class="desc">
                <h3>
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                    {title}
                  </a>
                </h3>
              </div>
              {showTags && (
                <ul class="tags">
                  {tags.map((tag) => (
                    <li>
                      <a
                        class="internal tag-link"
                        href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                      >
                        {tag}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.page-list-home {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.page-list-home-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding: 0.4rem 0;
}

.page-list-home-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--dark);
  text-decoration: none;
  background-color: transparent !important;
  transition: color 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-list-home-title:hover {
  color: var(--secondary);
}

.page-list-home-date {
  font-size: 0.8rem;
  color: var(--gray);
  flex-shrink: 0;
  white-space: nowrap;
}

@media (max-width: 1199px) {
  .page-list-home-item {
    flex-direction: column;
    gap: 0.2rem;
  }

  .page-list-home-title {
    white-space: normal;
  }
}

.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}

.section.no-tags {
  grid-template-columns: fit-content(8em) 1fr;
}
`
