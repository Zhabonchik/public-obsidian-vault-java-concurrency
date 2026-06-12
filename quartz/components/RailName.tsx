// @ts-ignore: this runs after DOM ready and should stay a plain script import
import script from "./scripts/railname.inline"
import styles from "./styles/railname.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const RailName: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=M+PLUS+1+Code:wght@500&display=swap"
        rel="stylesheet"
      />
      <div class={classNames(displayClass, "rail-name")} aria-hidden="true">
        <span class="rail-name__cursor">_</span>
      </div>
    </>
  )
}

RailName.afterDOMLoaded = script
RailName.css = styles

export default (() => RailName) satisfies QuartzComponentConstructor
