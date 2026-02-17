declare module "../plugin-data.js" {
  export function configExists(): boolean
  export function createConfigFromDefault(): Record<string, unknown>
}

declare module "@opentui/core" {
  export type SelectOption = { name: string; description: string; value?: any }
  export type TabSelectOption = { name: string; description: string; value?: any }
  export interface CliRendererOptions {
    exitOnCtrlC?: boolean
    useAlternateScreen?: boolean
  }
  export function createCliRenderer(options?: CliRendererOptions): Promise<unknown>
}

declare module "@opentui/react" {
  export function createRoot(renderer: unknown): { render(element: unknown): void }
  export function useKeyboard(
    handler: (event: {
      name: string
      shift?: boolean
      ctrl?: boolean
      meta?: boolean
      eventType?: string
      repeated?: boolean
    }) => void,
  ): void
  export function useOnResize(callback: (width: number, height: number) => void): void
  export function useTimeline(options?: {
    duration?: number
    loop?: boolean
    autoplay?: boolean
  }): unknown
  export function useRenderer(): { destroy(): void; console: { show(): void } }
  export function useTerminalDimensions(): { width: number; height: number }
}

declare module "../../plugin-data.js" {
  export function readPluginsJson(): Record<string, unknown> | null
  export function writePluginsJson(data: Record<string, unknown>): void
  export function readDefaultPluginsJson(): Record<string, unknown> | null
  export function readLockfile(): Record<string, unknown> | null
  export function writeLockfile(lockfile: Record<string, unknown>): void
  export function extractPluginName(source: string): string
  export function readManifestFromPackageJson(pluginDir: string): Record<string, unknown> | null
  export function parseGitSource(source: string): { name: string; url: string; ref?: string }
  export function getGitCommit(pluginDir: string): string
  export function getPluginDir(name: string): string
  export function pluginDirExists(name: string): boolean
  export function ensurePluginsDir(): void
  export function getEnrichedPlugins(): Array<{
    index: number
    name: string
    displayName: string
    source: string
    enabled: boolean
    options: Record<string, unknown>
    order: number
    layout: {
      position: string
      priority: number
      display: string
      condition?: string
      group?: string
      groupOptions?: Record<string, unknown>
    } | null
    category: string | string[]
    installed: boolean
    locked: {
      source: string
      resolved: string
      commit: string
      installedAt: string
    } | null
    manifest: Record<string, unknown> | null
    currentCommit: string | null
    modified: boolean
  }>
  export function getLayoutConfig(): Record<string, unknown> | null
  export function getGlobalConfig(): Record<string, unknown> | null
  export function updatePluginEntry(index: number, updates: Record<string, unknown>): boolean
  export function updateGlobalConfig(updates: Record<string, unknown>): boolean
  export function updateLayoutConfig(layout: Record<string, unknown>): boolean
  export function reorderPlugin(fromIndex: number, toIndex: number): boolean
  export function removePluginEntry(index: number): boolean
  export function addPluginEntry(entry: Record<string, unknown>): boolean
  export function configExists(): boolean
  export function createConfigFromDefault(): Record<string, unknown>
  export const LOCKFILE_PATH: string
  export const PLUGINS_DIR: string
  export const PLUGINS_JSON_PATH: string
  export const DEFAULT_PLUGINS_JSON_PATH: string
}

declare module "../../plugin-git-handlers.js" {
  export function handlePluginInstall(): Promise<void>
  export function handlePluginAdd(sources: string[]): Promise<void>
  export function handlePluginRemove(names: string[]): Promise<void>
  export function handlePluginUpdate(names?: string[]): Promise<void>
  export function handlePluginRestore(): Promise<void>
  export function handlePluginList(): Promise<void>
  export function handlePluginEnable(names: string[]): Promise<void>
  export function handlePluginDisable(names: string[]): Promise<void>
  export function handlePluginConfig(name: string, options?: { set?: string }): Promise<void>
  export function handlePluginCheck(): Promise<void>
}

declare module "./async-plugin-ops.js" {
  export type ProgressCallback = (
    message: string,
    type: "info" | "success" | "error" | "warning",
  ) => void
  export interface OperationResult {
    success: boolean
    installed?: number
    failed?: number
    updated?: string[]
    errors?: string[]
  }
  export function tuiPluginUpdate(
    names?: string[],
    onProgress?: ProgressCallback,
  ): Promise<OperationResult>
  export function tuiPluginInstall(onProgress?: ProgressCallback): Promise<OperationResult>
  export function tuiPluginRestore(onProgress?: ProgressCallback): Promise<OperationResult>
  export function tuiPluginAdd(
    sources: string[],
    onProgress?: ProgressCallback,
  ): Promise<OperationResult>
  export function tuiPluginRemove(
    names: string[],
    onProgress?: ProgressCallback,
  ): Promise<OperationResult>
}

declare module "../async-plugin-ops.js" {
  export type ProgressCallback = (
    message: string,
    type: "info" | "success" | "error" | "warning",
  ) => void
  export interface OperationResult {
    success: boolean
    installed?: number
    failed?: number
    updated?: string[]
    errors?: string[]
  }
  export function tuiPluginUpdate(
    names?: string[],
    onProgress?: ProgressCallback,
  ): Promise<OperationResult>
  export function tuiPluginInstall(onProgress?: ProgressCallback): Promise<OperationResult>
  export function tuiPluginRestore(onProgress?: ProgressCallback): Promise<OperationResult>
  export function tuiPluginAdd(
    sources: string[],
    onProgress?: ProgressCallback,
  ): Promise<OperationResult>
  export function tuiPluginRemove(
    names: string[],
    onProgress?: ProgressCallback,
  ): Promise<OperationResult>
}

declare module "../constants.js" {
  export const version: string
  export const ORIGIN_NAME: string
  export const UPSTREAM_NAME: string
  export const QUARTZ_SOURCE_BRANCH: string
  export const QUARTZ_SOURCE_REPO: string
  export const cwd: string
  export const cacheDir: string
  export const cacheFile: string
  export const fp: string
  export const contentCacheFolder: string
}
