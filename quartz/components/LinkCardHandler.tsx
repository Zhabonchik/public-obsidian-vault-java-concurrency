// @ts-ignore
import linkCardScript from "./scripts/linkcard.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const LinkCardHandler: QuartzComponent = () => null

LinkCardHandler.beforeDOMLoaded = linkCardScript

export default (() => LinkCardHandler) satisfies QuartzComponentConstructor
