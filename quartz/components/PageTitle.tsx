import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend+Zetta:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <h2 class={classNames(displayClass, "page-title")}>
        <a href={baseDir} class="page-title-link">
          <img
            src={`${baseDir}/static/logo-light.svg`}
            alt=""
            class="site-logo site-logo-light"
            aria-hidden="true"
          />
          <img
            src={`${baseDir}/static/logo-dark.svg`}
            alt=""
            class="site-logo site-logo-dark"
            aria-hidden="true"
          />
          {title}
        </a>
      </h2>
    </>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.5rem;
  margin: 0;
  color: var(--dark);
  transition: color 0.2s ease;
}

.page-title-link {
  display: flex;
  align-items: center;
  gap: 0.2em;
  text-decoration: none;
  color: inherit;
}

.page-title a {
  text-decoration: none;
  color: inherit;
}

.site-logo {
  height: 1.2em;
  width: auto;
  display: inline-block;
  vertical-align: middle;
}

.site-logo-dark {
  display: none;
}

@media (prefers-color-scheme: dark) {
  .site-logo-light {
    display: none;
  }
  .site-logo-dark {
    display: inline-block;
  }
}

:root[saved-theme="dark"] .site-logo-light {
  display: none;
}
:root[saved-theme="dark"] .site-logo-dark {
  display: inline-block;
}
:root[saved-theme="light"] .site-logo-light {
  display: inline-block;
}
:root[saved-theme="light"] .site-logo-dark {
  display: none;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
