import darkmodeScript from "./scripts/darkmode.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Darkmode: QuartzComponent = (_props: QuartzComponentProps) => {
  return null
}

Darkmode.beforeDOMLoaded = darkmodeScript

export default (() => Darkmode) satisfies QuartzComponentConstructor
