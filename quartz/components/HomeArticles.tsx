import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { byDateAndAlphabetical } from "./PageList"
import { Date, getDate } from "./Date"
import style from "./styles/homeArticles.scss"

const BookIcon = () => (
  <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

const HomeArticles: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
  const pages = allFiles
    .filter((page) => page.slug !== "index")
    .sort(byDateAndAlphabetical(cfg))

  if (pages.length === 0) return null

  return (
    <section class="home-articles">
      <h2 class="home-articles-heading">
        <BookIcon />
        Articles
      </h2>
      <ul class="home-articles-list">
        {pages.map((page) => {
          const title = page.frontmatter?.title ?? "Untitled"
          const date = page.dates ? getDate(cfg, page) : null

          return (
            <li class="home-article-item">
              <a
                href={resolveRelative(fileData.slug!, page.slug!)}
                class="home-article-title internal"
              >
                {title}
              </a>
              {date && (
                <span class="home-article-date">
                  <Date date={date} locale={cfg.locale} />
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

HomeArticles.css = style
export default (() => HomeArticles) satisfies QuartzComponentConstructor
