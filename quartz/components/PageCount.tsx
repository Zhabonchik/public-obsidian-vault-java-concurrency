import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageCount: QuartzComponent = ({
  allFiles,
  displayClass,
  cfg,
}: QuartzComponentProps) => {
  const count = allFiles.length
  return (
    <div class={classNames(displayClass, "page-count")}>
      <p>{i18n(cfg.locale).components.pageCount.totalItems({ count })}</p>
    </div>
  )
}

PageCount.css = `
.page-count {
  padding: 0.5rem;
  font-size: 0.9rem;
  color: var(--secondary);
}
`

export default (() => PageCount) satisfies QuartzComponentConstructor
