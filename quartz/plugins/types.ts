import { PluggableList } from "unified"
import { StaticResources } from "../util/resources"
import { ProcessedContent, QuartzPluginData } from "./vfile"
import { QuartzComponent, QuartzComponentConstructor } from "../components/types"
import { FilePath } from "../util/path"
import { BuildCtx } from "../util/ctx"
import { GlobalConfiguration } from "../cfg"
import { VFile } from "vfile"

export interface PluginTypes {
  transformers: QuartzTransformerPluginInstance[]
  filters: QuartzFilterPluginInstance[]
  emitters: QuartzEmitterPluginInstance[]
  pageTypes?: PageTypePluginEntry[]
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

export type PageMatcher = (args: {
  slug: string
  fileData: QuartzPluginData
  cfg: GlobalConfiguration
  [key: string]: unknown
}) => boolean

export interface VirtualPage {
  slug: string
  title: string
  data: Partial<QuartzPluginData> & Record<string, unknown>
}

export type PageGenerator = (args: {
  content: ProcessedContent[]
  cfg: GlobalConfiguration
  ctx: BuildCtx
  [key: string]: unknown
}) => VirtualPage[]

export type QuartzPageTypePlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzPageTypePluginInstance

export interface QuartzPageTypePluginInstance {
  name: string
  priority?: number
  match: PageMatcher
  generate?: PageGenerator
  layout: string
  body: QuartzComponentConstructor
}

// Structural supertype accepted in plugin configuration arrays.
// Community plugins use a differently-branded FullSlug in their PageMatcher,
// making them incompatible with the internal PageMatcher under strict
// function-parameter contravariance. This wider entry type avoids forcing
// casts in quartz.config.ts while the dispatcher safely calls match/generate
// with the correct arguments at runtime.
export interface PageTypePluginEntry {
  name: string
  priority?: number
  match: (...args: never[]) => boolean
  generate?: (...args: never[]) => VirtualPage[]
  layout: string
  body: QuartzComponentConstructor
}
