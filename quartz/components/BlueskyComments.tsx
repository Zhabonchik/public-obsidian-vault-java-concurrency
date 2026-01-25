
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/bluesky.inline"
import style from "./styles/bluesky.scss"

const BlueskyComments: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const blueskyUrl = fileData.frontmatter?.blueskyUrl as string | undefined
    if (!blueskyUrl) {
        return null
    }

    return (
        <div class={classNames(displayClass, "bluesky-comments-container")} id="bluesky-comments" data-url={blueskyUrl}>
            <h2>Comments</h2>
            <p class="bluesky-meta">
                Post a reply on <a href={blueskyUrl} target="_blank" rel="noopener noreferrer">Bluesky</a> to join the conversation.
            </p>
            <div id="bluesky-comments-list">
                <p>Loading comments...</p>
            </div>
        </div>
    )
}

BlueskyComments.afterDOMLoaded = script
BlueskyComments.css = style

export default (() => BlueskyComments) satisfies QuartzComponentConstructor
