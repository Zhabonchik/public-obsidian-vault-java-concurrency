// @ts-ignore: this runs before DOM ready and should stay a plain script import
import darkmodeScript from "./scripts/darkmode.inline"
import styles from "./styles/themetoggle.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

const ThemeToggle: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  const label = `${i18n(cfg.locale).components.themeToggle.darkMode} / ${i18n(cfg.locale).components.themeToggle.lightMode}`
  return (
    <button
      aria-label={label}
      title={label}
      class={classNames(displayClass, "darkmode", "theme-toggle")}
      id="darkmode"
      type="button"
    >
      <svg
        class="theme-toggle__svg"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="theme-toggle-bite"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <circle class="theme-toggle__bite" cx="24" cy="4" r="5" fill="black" />
          </mask>
        </defs>
        <g class="theme-toggle__rays" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="12" y1="2.2" x2="12" y2="4.2" />
          <line x1="12" y1="19.8" x2="12" y2="21.8" />
          <line x1="2.2" y1="12" x2="4.2" y2="12" />
          <line x1="19.8" y1="12" x2="21.8" y2="12" />
          <line x1="4.95" y1="4.95" x2="6.35" y2="6.35" />
          <line x1="17.65" y1="17.65" x2="19.05" y2="19.05" />
          <line x1="4.95" y1="19.05" x2="6.35" y2="17.65" />
          <line x1="17.65" y1="6.35" x2="19.05" y2="4.95" />
        </g>
        <circle
          class="theme-toggle__body"
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask="url(#theme-toggle-bite)"
        />
      </svg>
    </button>
  )
}

ThemeToggle.beforeDOMLoaded = darkmodeScript
ThemeToggle.css = styles

export default (() => ThemeToggle) satisfies QuartzComponentConstructor
