import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>此處無語</h1>
      <p>走偏了嗎？可能火候未到，或是路徑在修坯時削去了。</p>
      <br />
      <a href={baseDir}>回到首頁靜觀</a>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
