import { minimatch } from "minimatch"
import { QuartzPluginData } from "../vfile"
import { GlobalConfiguration } from "../../cfg"

export function isUnlisted(
  fileData: QuartzPluginData,
  cfg: GlobalConfiguration,
): boolean {
  const unlistedFlag: boolean =
    fileData?.frontmatter?.unlisted === true || fileData?.frontmatter?.unlisted === "true"

  if (unlistedFlag) return true

  const patterns = cfg.unlistedPatterns
  if (patterns && patterns.length > 0 && fileData.slug) {
    const slug = fileData.slug
    for (const pattern of patterns) {
      if (minimatch(slug, pattern)) {
        return true
      }
    }
  }

  return false
}
