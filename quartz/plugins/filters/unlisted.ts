import { minimatch } from "minimatch"
import { QuartzPluginData } from "../vfile"
import { GlobalConfiguration } from "../../cfg"

export function isUnlisted(
    fileData: QuartzPluginData,
    cfg: GlobalConfiguration,
    unlistedPatterns?: string[]
): boolean {
    const unlistedFlag: boolean =
        fileData?.frontmatter?.unlisted === true ||
        fileData?.frontmatter?.unlisted === "true"
        
    if (unlistedFlag) return true

    const patterns = unlistedPatterns ?? cfg.unlistedPatterns
    if (patterns && patterns.length > 0 && fileData.slug) {
        const slug = fileData.slug as string
        for (const pattern of patterns) {
            if (minimatch(slug, pattern)) {
                return true
            }
        }
    }

    return false
}