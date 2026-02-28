import { PageFrame } from "./types"
import { DefaultFrame } from "./DefaultFrame"
import { FullWidthFrame } from "./FullWidthFrame"
import { MinimalFrame } from "./MinimalFrame"

export type { PageFrame, PageFrameProps } from "./types"
export { DefaultFrame } from "./DefaultFrame"
export { FullWidthFrame } from "./FullWidthFrame"
export { MinimalFrame } from "./MinimalFrame"

/**
 * Registry of built-in page frames. Page types can reference these by name
 * via their `frame` property, and YAML config can override via
 * `layout.byPageType.<name>.template`.
 *
 * The "default" frame reproduces the original three-column Quartz layout.
 */
const builtinFrames: Record<string, PageFrame> = {
  default: DefaultFrame,
  "full-width": FullWidthFrame,
  minimal: MinimalFrame,
}

/**
 * Resolve a frame by name. Returns the DefaultFrame if the name is not found,
 * logging a warning for unknown frame names.
 */
export function resolveFrame(name: string | undefined): PageFrame {
  if (!name || name === "default") {
    return DefaultFrame
  }
  const frame = builtinFrames[name]
  if (!frame) {
    console.warn(
      `Unknown page frame "${name}", falling back to "default". Available frames: ${Object.keys(builtinFrames).join(", ")}`,
    )
    return DefaultFrame
  }
  return frame
}
