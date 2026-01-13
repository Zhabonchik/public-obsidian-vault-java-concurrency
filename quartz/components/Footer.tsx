import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <hr />
        <p>
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
        </p>

        {/* --- 林永章的數位建構 Log 區 --- */}
        <div className="site-log" style={{ fontSize: "0.85rem", margin: "1rem 0", opacity: 0.8 }}>
          <p style={{ margin: "0.2rem 0" }}>🪵 <b>靜觀微語｜建構日誌</b></p>
          <p style={{ margin: "0.2rem 0" }}>• 數位窯火穩定燒製中 (GoatCounter 觀測中)</p>
          <p style={{ margin: "0.2rem 0" }}>• Google SEO 驗證通過｜Giscus 交流區啟動</p>
          
          {/* 隱藏的計數器圖片，會默默統計每一位訪客 */}
          <img 
            src="https://vcdvcd.goatcounter.com/count?p=/footer-auto" 
            style={{ display: "none" }} 
            alt="goatcounter"
          />
        </div>
        {/* ---------------------------- */}

        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
