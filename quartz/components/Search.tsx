import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/search.scss"
// @ts-ignore
import script from "./scripts/search.inline"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

export interface SearchOptions {
  enablePreview: boolean
  variant: "default" | "home-inline" | "page-corner"
  buttonText?: string
  searchPlaceholder?: string
}

const defaultOptions: SearchOptions = {
  enablePreview: true,
  variant: "default",
}

export default ((userOpts?: Partial<SearchOptions>) => {
  const Search: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }
    const defaultPlaceholder = i18n(cfg.locale).components.search.searchBarPlaceholder
    const searchPlaceholder =
      opts.searchPlaceholder ?? i18n(cfg.locale).components.search.searchBarPlaceholder
    const searchAriaLabel = searchPlaceholder.trim() !== "" ? searchPlaceholder : defaultPlaceholder
    const buttonText = opts.buttonText ?? i18n(cfg.locale).components.search.title
    const searchIcon = (
      <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7">
        <title>Search</title>
        <g class="search-path" fill="none">
          <path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4" />
          <circle cx="8" cy="8" r="7" />
        </g>
      </svg>
    )

    if (opts.variant === "home-inline") {
      return (
        <div class={classNames(displayClass, "search", `search-${opts.variant}`)}>
          <div class="search-container">
            <div class="search-space">
              <label class="search-inline-shell">
                {searchIcon}
                <input
                  autocomplete="off"
                  class="search-bar"
                  name="search"
                  type="search"
                  aria-label={searchAriaLabel}
                  placeholder={searchPlaceholder || undefined}
                />
              </label>
              <div class="search-layout" data-preview={opts.enablePreview}></div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div class={classNames(displayClass, "search", `search-${opts.variant}`)}>
        <button class="search-button" aria-label={buttonText}>
          {searchIcon}
          <p>{buttonText}</p>
        </button>
        <div class="search-container">
          <div class="search-space">
            <input
              autocomplete="off"
              class="search-bar"
              name="search"
              type="search"
              aria-label={searchAriaLabel}
              placeholder={searchPlaceholder || undefined}
            />
            <div class="search-layout" data-preview={opts.enablePreview}></div>
          </div>
        </div>
      </div>
    )
  }

  Search.afterDOMLoaded = script
  Search.css = style

  return Search
}) satisfies QuartzComponentConstructor
