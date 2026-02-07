import { QuartzTransformerPlugin, QuartzFilterPlugin, QuartzEmitterPlugin } from "../types"
import { BuildCtx } from "../../util/ctx"

/**
 * Component manifest metadata
 */
export interface ComponentManifest {
  name: string
  displayName: string
  description: string
  version: string
  quartzVersion?: string
  author?: string
  homepage?: string
}

/**
 * Plugin manifest metadata for discovery and documentation
 */
export interface PluginManifest {
  name: string
  displayName: string
  description: string
  version: string
  author?: string
  homepage?: string
  keywords?: string[]
  category?: "transformer" | "filter" | "emitter"
  quartzVersion?: string
  configSchema?: object
  /** Components provided by this plugin */
  components?: Record<string, ComponentManifest>
}

/**
 * Loaded plugin with metadata
 */
export interface LoadedPlugin {
  plugin: QuartzTransformerPlugin | QuartzFilterPlugin | QuartzEmitterPlugin
  manifest: PluginManifest
  type: "transformer" | "filter" | "emitter"
  source: string
}

/**
 * Plugin resolution result
 */
export interface PluginResolution {
  /** Successfully loaded plugins */
  plugins: LoadedPlugin[]
  /** Errors that occurred during resolution */
  errors: PluginResolutionError[]
}

/**
 * Plugin resolution error
 */
export interface PluginResolutionError {
  /** Plugin name that failed to load */
  plugin: string
  /** Error message */
  message: string
  /** Error type */
  type: "not-found" | "invalid-manifest" | "version-mismatch" | "import-error"
}

/**
 * Options for plugin resolution
 */
export interface PluginResolutionOptions {
  /** Current Quartz version for compatibility checking */
  quartzVersion: string
  /** Build context for logging */
  ctx: BuildCtx
  /** Whether to enable verbose logging */
  verbose?: boolean
}

/**
 * Plugin specifier - can be:
 * - String package name (e.g., "@quartz-community/my-plugin")
 * - Object with name and options (e.g., { name: "@quartz-community/my-plugin", options: {...} })
 * - Inline plugin object (already loaded plugin instance)
 */
export type PluginSpecifier =
  | string
  | { name: string; options?: unknown }
  | { plugin: LoadedPlugin["plugin"]; manifest?: Partial<PluginManifest> }
