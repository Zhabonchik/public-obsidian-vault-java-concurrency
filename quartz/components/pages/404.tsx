import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>此處無語</h1>
      <p>🪵 <b>走偏了嗎？</b></p>
      <p>可能火候未到，或是路徑在修坯時削去了。<br />在「靜觀微語」的世界裡，有些角落還在等待泥土成型。</p>
      <p style={{ fontStyle: "italic", opacity: 0.8, marginTop: "2rem" }}>
        「有時候，沒捏好的坯，也是一種必經的安靜。」
      </p>
      <br />
      <a href={baseDir}>回到首頁靜觀</a>
      <p style={{ fontSize: "0.8rem", marginTop: "4rem", opacity: 0.5 }}>
        ( 往下捲動，進入迷路者的微語討論區 )
      </p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
