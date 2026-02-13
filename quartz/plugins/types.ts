import { PluggableList } from "unified"
import { StaticResources } from "../util/resources"
import { ProcessedContent, QuartzPluginData } from "./vfile"
import { QuartzComponent, QuartzComponentConstructor } from "../components/types"
import { FilePath, FullSlug } from "../util/path"
import { BuildCtx } from "../util/ctx"
import { GlobalConfiguration } from "../cfg"
import { VFile } from "vfile"

export interface PluginTypes {
  transformers: QuartzTransformerPluginInstance[]
  filters: QuartzFilterPluginInstance[]
  emitters: QuartzEmitterPluginInstance[]
  pageTypes?: QuartzPageTypePluginInstance[]
}

type OptionType = object | undefined
type ExternalResourcesFn = (ctx: BuildCtx) => Partial<StaticResources> | undefined
export type QuartzTransformerPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzTransformerPluginInstance
export type QuartzTransformerPluginInstance = {
  name: string
  textTransform?: (ctx: BuildCtx, src: string) => string
  markdownPlugins?: (ctx: BuildCtx) => PluggableList
  htmlPlugins?: (ctx: BuildCtx) => PluggableList
  externalResources?: ExternalResourcesFn
}

export type QuartzFilterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzFilterPluginInstance
export type QuartzFilterPluginInstance = {
  name: string
  shouldPublish(ctx: BuildCtx, content: ProcessedContent): boolean
}

export type ChangeEvent = {
  type: "add" | "change" | "delete"
  path: FilePath
  file?: VFile
}

export type QuartzEmitterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzEmitterPluginInstance
export type QuartzEmitterPluginInstance = {
  name: string
  emit: (
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
  ) => Promise<FilePath[]> | AsyncGenerator<FilePath>
  partialEmit?: (
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
    changeEvents: ChangeEvent[],
  ) => Promise<FilePath[]> | AsyncGenerator<FilePath> | null
  /**
   * Returns the components (if any) that are used in rendering the page.
   * This helps Quartz optimize the page by only including necessary resources
   * for components that are actually used.
   */
  getQuartzComponents?: (ctx: BuildCtx) => QuartzComponent[]
  externalResources?: ExternalResourcesFn
}

// ============================================================================
// PageType Plugin Types
// ============================================================================

/**
 * Matcher function: determines if a source file belongs to a page type.
 * Returns true if the page type should own this file.
 */
export type PageMatcher = (args: {
  slug: FullSlug
  fileData: QuartzPluginData
  cfg: GlobalConfiguration
}) => boolean

/**
 * Virtual page descriptor for page types that generate pages
 * from aggregated data (e.g., tag indexes, folder listings).
 */
export interface VirtualPage {
  slug: FullSlug
  title: string
  data: Partial<QuartzPluginData>
}

/**
 * Generator function: produces virtual pages from all processed content.
 * Used by page types that don't match source files but instead create
 * synthetic pages (e.g., one page per tag, one page per folder).
 */
export type PageGenerator = (args: {
  content: ProcessedContent[]
  cfg: GlobalConfiguration
  ctx: BuildCtx
}) => VirtualPage[]

/**
 * Factory function that creates a PageType plugin instance.
 */
export type QuartzPageTypePlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzPageTypePluginInstance

/**
 * A PageType plugin instance.
 *
 * PageTypes are a declarative abstraction over page-rendering emitters.
 * Each PageType declares which files it owns (via `match`), optionally
 * generates virtual pages (via `generate`), and provides a body component
 * and layout reference for rendering.
 */
export type QuartzPageTypePluginInstance = {
  name: string
  /** Higher priority wins when multiple page types match the same file. Default: 0. */
  priority?: number
  /** Determines which source files this page type owns. */
  match: PageMatcher
  /** Produces virtual pages from aggregated content data. */
  generate?: PageGenerator
  /** Layout key — references a key in `layout.byPageType`. */
  layout: string
  /** The body component constructor for this page type. */
  body: QuartzComponentConstructor
}
