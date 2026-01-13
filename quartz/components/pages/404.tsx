import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>此處無語</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>🪵 <b>走偏了嗎？</b></p>
      
      <p>
        可能火候未到，或是連結的路徑在修坯時不小心削去了。<br />
        在「靜觀微語」的世界裡，有些角落還在等待泥土成型。
      </p>

      {/* 這裡加入有點好笑的引導 */}
      <div style={{ 
        backgroundColor: "rgba(0,0,0,0.05)", 
        padding: "1rem", 
        borderRadius: "8px", 
        marginTop: "2rem",
        borderLeft: "4px solid #666" 
      }}>
        <p style={{ margin: 0 }}>
          🛸 <b>意外的發現：</b><br />
          既然都迷路迷到這了，不如往下看？<br />
          聽說這裡有一群同樣走錯路的人在下面開研討會。
        </p>
      </div>

      <p style={{ fontStyle: "italic", opacity: 0.8, marginTop: "2rem" }}>
        「有時候，沒捏好的坯，也是一種必經的安靜。」
      </p>
      
      <br />
      <a href={baseDir} style={{ fontWeight: "bold", textDecoration: "underline" }}>
        回到首頁靜觀
      </a>
      
      <p style={{ fontSize: "0.8rem", marginTop: "4rem", opacity: 0.5 }}>
        ( 往下捲動，進入迷路者的微語討論區 )
      </p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
