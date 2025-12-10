import { QuartzEmitterPlugin } from "../types"
import { FilePath, joinSegments } from "../../util/path"
import fs from "fs"
import path from "path"

interface Options {
    /**
     * Enable favicon caching during build time.
     * When enabled, all external link favicons are pre-fetched and cached to /static/externalFavicons/
     */
    enabled: boolean
    /**
     * Number of concurrent favicon fetch requests.
     * Keep this low (1-3) to avoid hitting API rate limits.
     */
    concurrency: number
    /**
     * Timeout for individual favicon fetch requests in milliseconds.
     */
    timeout: number
    /**
     * Whether to continue build if favicon fetch fails.
     * If false, a single failed favicon will fail the entire build.
     */
    continueOnError: boolean
}

const defaultOptions: Options = {
    enabled: false,
    concurrency: 2,
    timeout: 5000,
    continueOnError: true,
}

/**
 * Pre-fetches and caches external link favicons during the build process.
 * When enabled, this plugin collects all unique external domains found in links,
 * fetches their favicons, and stores them locally in /static/externalFavicons/.
 *
 * This reduces runtime requests and improves page load performance.
 * Used in conjunction with CrawlLinks plugin configured with cacheLinkFavicons: true.
 */
export const FaviconCache: QuartzEmitterPlugin<Partial<Options>> = (userOpts) => {
    const opts = { ...defaultOptions, ...userOpts }

    return {
        name: "FaviconCache",
        async *emit(ctx, content) {
            if (!opts.enabled) {
                return
            }

            // Collect all unique domains from external links
            const domains = new Set<string>()

            for (const [_tree, vfile] of content) {
                // CrawlLinks plugin stores external link information in file.data.externalDomains
                const externalDomains = (vfile.data.externalDomains ?? []) as string[]
                for (const domain of externalDomains) {
                    if (domain && domain.trim()) {
                        domains.add(domain.toLowerCase())
                    }
                }
            }

            if (domains.size === 0) {
                return
            }

            // Create favicon cache directory
            const faviconCachePath = joinSegments(
                ctx.argv.output,
                "static/externalFavicons",
            ) as FilePath

            await fs.promises.mkdir(faviconCachePath, { recursive: true })

            // Fetch favicons with concurrency control
            const domainArray = Array.from(domains)
            let successCount = 0
            let failureCount = 0

            console.log(`Caching favicons for ${domainArray.length} unique domains...`)

            for (let i = 0; i < domainArray.length; i += opts.concurrency) {
                const batch = domainArray.slice(i, i + opts.concurrency)

                const results = await Promise.allSettled(
                    batch.map((domain) => fetchAndCacheFavicon(domain, faviconCachePath, opts)),
                )

                for (let j = 0; j < results.length; j++) {
                    const result = results[j]
                    const domain = batch[j]

                    if (result.status === "fulfilled") {
                        successCount++
                        yield joinSegments(faviconCachePath, `${domain}.ico`) as FilePath
                    } else {
                        failureCount++
                        if (!opts.continueOnError) {
                            throw result.reason
                        }
                    }
                }
            }

            console.log(
                `Favicon cache complete: ${successCount} succeeded, ${failureCount} failed`,
            )
        },

        async *partialEmit(_ctx, _content, _resources, _changeEvents) {
            // For incremental builds, we could optimize by only fetching favicons
            // for newly added/modified files. For now, we skip partial emission
            // since favicons are relatively small and the cost is minimal.
        },
    }
}

async function fetchAndCacheFavicon(
    domain: string,
    cachePath: FilePath,
    opts: Options,
): Promise<void> {
    const faviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain_url=${domain}`
    const fileName = `${domain}.ico`
    const destPath = path.join(cachePath, fileName) as FilePath

    try {
        // Create abort controller for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), opts.timeout)

        const response = await fetch(faviconUrl, {
            signal: controller.signal,
            // Add User-Agent to avoid potential blocks
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (compatible; Quartz/4.0 +https://quartz.jzhao.xyz/)",
            },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} when fetching favicon for ${domain}`)
        }

        const buffer = await response.arrayBuffer()
        await fs.promises.writeFile(destPath, Buffer.from(buffer))
    } catch (err) {
        if (!opts.continueOnError) {
            throw err
        }
        // Log warning but continue
        const errorMsg = err instanceof Error ? err.message : String(err)
        console.warn(`⚠️  Failed to cache favicon for domain '${domain}': ${errorMsg}`)
    }
}

declare module "vfile" {
    interface DataMap {
        externalDomains: string[]
    }
}
